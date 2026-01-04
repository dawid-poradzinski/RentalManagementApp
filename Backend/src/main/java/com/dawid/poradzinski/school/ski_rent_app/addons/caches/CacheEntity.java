package com.dawid.poradzinski.school.ski_rent_app.addons.caches;

import java.time.OffsetDateTime;
import java.util.UUID;

public record CacheEntity(OffsetDateTime from, OffsetDateTime to, UUID token) {

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        return (object instanceof CacheEntity cacheEntity)
                && this.token.equals(cacheEntity.token)
                && this.from.isEqual(cacheEntity.from)
                && this.to.isEqual(cacheEntity.to);
    }
}
