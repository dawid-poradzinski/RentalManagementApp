package com.dawid.poradzinski.school.ski_rent_app.addons.caches;

import java.util.concurrent.TimeUnit;

import org.cache2k.Cache;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dawid.poradzinski.school.ski_rent_app.addons.ProjectConsts;

import org.cache2k.Cache2kBuilder;
import org.cache2k.event.CacheEntryExpiredListener;


@Configuration
public class CacheConfig {

    @Bean
    public Cache<String, CacheEntity> rentalPendingItems(CacheIndexService cacheIndexService) {
        return new Cache2kBuilder<String, CacheEntity>() {}
            .expireAfterWrite(ProjectConsts.CACHE_TTL, TimeUnit.MINUTES)
            .addListener((CacheEntryExpiredListener<String, CacheEntity>) (cache, entry) -> { cacheIndexService.onCacheExpired(entry.getKey()); })
            .build();
    }
}
