package com.dawid.poradzinski.school.ski_rent_app.service;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.cache2k.Cache;
import org.openapitools.model.CheckItemEntity;
import org.openapitools.model.ItemStatusTypeEnum;
import org.openapitools.model.Price;
import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.KeyNotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;

@Service
public class ItemCheckService {
    
    private final ItemRepository itemRepository;
    private final Cache<UUID, HashSet<Long>> rentalPendingItems;


    ItemCheckService(ItemRepository itemRepository,
                     Cache<UUID, HashSet<Long>> rentalPendingItems) {
        this.itemRepository = itemRepository;
        this.rentalPendingItems = rentalPendingItems;
    }
    public Price itemPrice(HashSet<Long> ids) throws Exception{
        Map<String, BigDecimal> prices = itemRepository.findAllById(ids).stream()
        .collect(Collectors.groupingBy(
                Item::getPriceCurrency,
                Collectors.mapping(
                        Item::getPriceAmount,
                        Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                )
        ));
        String current = prices.containsKey("PLN") ? "PLN" : prices.keySet().stream().findFirst().orElse(null);
        if(current == null) {
            throw new Exception();
        }
        BigDecimal total = prices.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        return new Price(total, current);
    }

    public ResponseItemCheck itemCheck(RequestItemCheck request) throws KeyNotFoundException, Exception{
        
        UUID uuid = request.getKey();
        HashSet<Long> cacheIds;

        if (request.getKey() != null) {
            if (!rentalPendingItems.containsKey(uuid)) {
                throw new KeyNotFoundException(uuid.toString());
            }  
            cacheIds = rentalPendingItems.get(uuid);
            if(cacheIds.isEmpty()) {
                throw new Exception("key timeout");
            }
        } else {
            cacheIds = new HashSet<>();
        }
      
        List<Long> idsToCheck = request.getItins();
        idsToCheck.removeAll(cacheIds);

        List<Item> items = itemRepository.findAllById(idsToCheck);

        HashSet<Long> validIds = items.stream().filter(item -> item.getStatus() == ItemStatusTypeEnum.AVAILABLE).filter(item -> !item.getDamaged()).map(item -> item.getId()).collect(Collectors.toCollection(HashSet::new));

        if (!validIds.isEmpty()) {
            if(request.getKey() == null) {
                uuid = UUID.randomUUID();
            }
            itemRepository.saveAll(items.stream().filter(item -> validIds.contains(item.getId())).peek(item -> item.setStatus(ItemStatusTypeEnum.PENDING)).toList());
            cacheIds.addAll(validIds);
            rentalPendingItems.put(uuid, cacheIds);
        }

        CheckItemEntity entity = new CheckItemEntity(new ArrayList<>(validIds), new ArrayList<>(cacheIds), OffsetDateTime.now().plus(5, ChronoUnit.MINUTES), itemPrice(cacheIds), uuid);

        return new ResponseItemCheck(OffsetDateTime.now(), entity);
    }
}
