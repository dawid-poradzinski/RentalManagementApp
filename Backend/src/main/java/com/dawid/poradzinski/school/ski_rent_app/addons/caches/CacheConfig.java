package com.dawid.poradzinski.school.ski_rent_app.addons.caches;

import java.util.HashSet;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.cache2k.Cache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;

import org.cache2k.Cache2kBuilder;
import org.cache2k.event.CacheEntryExpiredListener;
import org.openapitools.model.ItemStatusTypeEnum;


@Configuration
public class CacheConfig {

    private final ItemRepository itemRepository;

    CacheConfig(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Bean
    public Cache<UUID, HashSet<Long>> rentalPendingItems() {
        return new Cache2kBuilder<UUID, HashSet<Long>>() {}
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .addAsyncListener((CacheEntryExpiredListener<UUID, HashSet<Long>>) (cache, entry) -> {
                HashSet<Long> ids = entry.getValue();
                List<Item> items = itemRepository.findAllById(ids);
                items.forEach(item -> item.setStatus(ItemStatusTypeEnum.AVAILABLE));
                itemRepository.saveAll(items);
            })
            .build();
    }
}
