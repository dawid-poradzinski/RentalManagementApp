package com.dawid.poradzinski.school.ski_rent_app.addons.caches;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;


@Component
public class CacheIndexService {

    // itemId can hold multiple token:itemId keys
    private final ConcurrentHashMap<Long, Set<String>> itemToKey = new ConcurrentHashMap<>();
    // token can hold multiple token:itemId keys
    private final ConcurrentHashMap<UUID, Set<String>> tokenToKey = new ConcurrentHashMap<>();

    public void onCacheExpired(String key) {
        String[] values = key.split(":");
        tokenToKey.getOrDefault(UUID.fromString(values[0]), Set.of()).remove(key);
        itemToKey.getOrDefault(Long.parseLong(values[1]), Set.of()).remove(key);
    }

    public void saveToMaps(Long itemId, UUID token, String key) {
        itemToKey.computeIfAbsent(itemId, k -> ConcurrentHashMap.newKeySet()).add(key);
        tokenToKey.computeIfAbsent(token, k -> ConcurrentHashMap.newKeySet()).add(key);
    }

    public Set<String> findKeysForItemById(Long id) {
        return itemToKey.getOrDefault(id, Set.of());
    }

    public Set<String> getKeysByToken(UUID token) {
        return tokenToKey.getOrDefault(token, Set.of());
    }
    
}
