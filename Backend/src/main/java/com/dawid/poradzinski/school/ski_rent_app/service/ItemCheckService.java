package com.dawid.poradzinski.school.ski_rent_app.service;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.cache2k.Cache;
import org.openapitools.model.CheckItemEntity;
import org.openapitools.model.ItemStatusTypeEnum;
import org.openapitools.model.Price;
import org.openapitools.model.RequestItemCheck;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.InvalidShopKey;
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

    public Price itemPrice(List<Item> items) throws Exception{
        if(items.isEmpty()) {
            throw new Exception("Empty list to price");
        }
        Map<String, BigDecimal> prices = items.stream()
        .collect(Collectors.groupingBy(
                Item::getPriceCurrency,
                Collectors.mapping(
                        Item::getPriceAmount,
                        Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                )
        ));
        String currency = prices.containsKey("PLN") ? "PLN" : prices.keySet().stream().findFirst().orElse(null);
        if(currency == null) {
            throw new Exception("currency not specified");
        }
        BigDecimal total = prices.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);

        return new Price().priceAmount(total).priceCurrency(currency);
    }
    
    public List<Item> itemShop(UUID key, HashSet<Long> shopItins) throws Exception{
        HashSet<Long> cachedIds = rentalPendingItems.get(key);
        if (cachedIds == null) {
            throw new InvalidShopKey("Invalid shop key: " + key);
        }
        if (shopItins.stream().filter(id -> cachedIds.contains(id)).collect(Collectors.toSet()).size() != shopItins.size()) {
            throw new Exception("Cached itins don't match shoped itins");
        }
        List<Item> items = itemRepository.findAllById(cachedIds).stream().peek(item -> {
            if(shopItins.contains(item.getId())) {
                item.setStatus(ItemStatusTypeEnum.RENTED);
                item.setLastRental(OffsetDateTime.now());
            } else {
                item.setStatus(ItemStatusTypeEnum.AVAILABLE);
            }
        }).toList();

        rentalPendingItems.remove(key);

        return itemRepository.saveAll(items);
    } 

    public CheckItemEntity itemCheck(RequestItemCheck request) throws Exception{
        
        UUID uuid = request.getKey();
        HashSet<Long> cacheIds;

        if (request.getKey() != null) {
            if (!rentalPendingItems.containsKey(uuid)) {
                throw new KeyNotFoundException("Shop key doesn't exist: " + uuid.toString());
            }  
            cacheIds = rentalPendingItems.get(uuid);
            if(cacheIds == null) {
                throw new KeyNotFoundException("Shop key timeout: " + uuid.toString());
            }
        } else {
            cacheIds = new HashSet<>();
        }
      
        List<Long> idsToCheck = request.getItins();
        idsToCheck.removeAll(cacheIds);

        List<Item> items = new ArrayList<>();

        if (!idsToCheck.isEmpty()) {
            items = itemRepository.findAllById(idsToCheck);
        }

        List<Item> validItems = items.stream().filter(item -> item.getStatus() == ItemStatusTypeEnum.AVAILABLE).filter(item -> !item.getDamaged()).toList();
        List<Long> validIds = validItems.stream().map(item -> item.getId()).toList();
        if (!validItems.isEmpty()) {
            if(request.getKey() == null) {
                uuid = UUID.randomUUID();
            }
            itemRepository.saveAll(validItems.stream().peek(item -> item.setStatus(ItemStatusTypeEnum.PENDING)).toList());
            cacheIds.addAll(validIds);
            rentalPendingItems.put(uuid, cacheIds);
        }

        if (cacheIds.isEmpty()) {
            return new CheckItemEntity().key(uuid);
        } else {
            CheckItemEntity checkItemEntity = new CheckItemEntity()
                .validatedItins(validIds)
                .allItins(new ArrayList<>(cacheIds))
                .key(uuid)
                .validUntil(OffsetDateTime.now().plus(5, ChronoUnit.MINUTES))
                .price(itemPrice(validItems));
            return checkItemEntity;
        }

    }
}
