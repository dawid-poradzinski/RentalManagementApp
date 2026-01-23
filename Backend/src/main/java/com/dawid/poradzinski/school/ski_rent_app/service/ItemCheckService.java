package com.dawid.poradzinski.school.ski_rent_app.service;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.cache2k.Cache;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.ProjectConsts;
import com.dawid.poradzinski.school.ski_rent_app.addons.caches.CacheEntity;
import com.dawid.poradzinski.school.ski_rent_app.addons.caches.CacheIndexService;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.ItemMapper;
import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;

@Service
public class ItemCheckService {
    
    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;
    private final Cache<String, CacheEntity> rentalPendingItems;
    private final CacheIndexService cacheIndexService;

    ItemCheckService(ItemRepository itemRepository,
                     Cache<String, CacheEntity> rentalPendingItems, ItemMapper itemMapper, CacheIndexService cacheIndexService) {
        this.itemRepository = itemRepository;
        this.rentalPendingItems = rentalPendingItems;
        this.itemMapper = itemMapper;
        this.cacheIndexService = cacheIndexService;
    }

    private void saveToCache(Long itemId, CacheEntity cacheEntity) {
        String key = cacheEntity.token() + ":" + itemId;
        rentalPendingItems.put(key, cacheEntity);
        cacheIndexService.saveToMaps(itemId, cacheEntity.token(), key);
    }

    // return list of valid and not valid
    public ResponseItemCheck itemCheck(List<Long> ids, CacheEntity cacheEntity, BigDecimal priceModifier) {

        // if no timeCollide for id, then return nothing
        HashMap<Long, CacheEntity> itemsWithCacheConflict = findTimeCollideInCache(ids, cacheEntity.from(), cacheEntity.to());

        HashSet<Long> valid = new HashSet<>();
        HashSet<Long> notValid = new HashSet<>();

        itemsWithCacheConflict.forEach((id, entity) -> {
            if(entity.equals(cacheEntity)) {
                valid.add(id);
            } else {
                notValid.add(id);
            }
        });

        HashSet<Long> toCheckInDb = ids.stream()
                .filter(id -> !valid.contains(id) && !notValid.contains(id))
                .collect(Collectors.toCollection(HashSet::new));

        itemRepository.checkAvailabilityForItems(toCheckInDb, cacheEntity.from(), cacheEntity.to()).forEach(item -> {
            if(item.collision()) {
                notValid.add(item.id());
            } else {
                valid.add(item.id());
            }
        });

        valid.forEach(id -> {
            saveToCache(id, cacheEntity);
        });

        List<Item> validItems = new ArrayList<>();
        List<Item> notValidItems = new ArrayList<>();
        
        itemRepository.findAllById(ids).forEach(item -> {
            item.setPriceAmount(item.getPriceAmount().multiply(priceModifier));
            if (valid.contains(item.getId())) {
                validItems.add(item);
            } else {
                notValidItems.add(item);
            }
        });

        return new ResponseItemCheck()
            .valid(itemMapper.mapItemsToListItemEntity(validItems))
            .notValid(itemMapper.mapItemsToListItemEntity(notValidItems))
            .ttl(OffsetDateTime.now().plus(ProjectConsts.CACHE_TTL, ChronoUnit.MINUTES));

    }

    // return list of values with time collide
    private HashMap<Long, CacheEntity> findTimeCollideInCache(List<Long> ids, OffsetDateTime from, OffsetDateTime to) {
        HashMap<Long, CacheEntity> response = new HashMap<>();
        
        ids.forEach(id -> {
            var keys = cacheIndexService.findKeysForItemById(id);
            if (!keys.isEmpty()) {
                var cacheCollide = findTimeCrash(rentalPendingItems.peekAll(keys), from, to);
                if (cacheCollide.isPresent()) {
                    response.put(id, cacheCollide.get());
                }
            }
        });

        return response;
    }

    // return first time collide
    private Optional<CacheEntity> findTimeCrash(Map<String, CacheEntity> entities, OffsetDateTime from, OffsetDateTime to) {
    
        for (Map.Entry<String, CacheEntity> entry : entities.entrySet()) {
            if (entry.getValue().from().isBefore(to) && entry.getValue().to().isAfter(from)) {
                return Optional.of(entry.getValue());
            }
        }

        return Optional.empty();
    }

    public Map<String, CacheEntity> checkCacheForIdsForSpecificToken(List<Long> ids, UUID token) {
        Set<String> keys = cacheIndexService.getKeysByToken(token);

        Set<String> lookingFor = new HashSet<>();
        Set<Long> missingKeys = new HashSet<>();
        ids.forEach(id -> {
            var key = token.toString() + ":" + id;
            if (!keys.contains(key)) {
                missingKeys.add(id);
            } else {
                lookingFor.add(key);
            }
        });

        if (!missingKeys.isEmpty()) {
            throw new RuntimeException(missingKeys.toString());
        }

        return rentalPendingItems.peekAll(lookingFor);
    }
}
