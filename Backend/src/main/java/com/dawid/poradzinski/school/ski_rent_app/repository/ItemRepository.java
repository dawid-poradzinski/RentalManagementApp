package com.dawid.poradzinski.school.ski_rent_app.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dawid.poradzinski.school.ski_rent_app.addons.ItemAvailabilityDto;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;

public interface ItemRepository extends JpaRepository<Item, Long>, JpaSpecificationExecutor<Item> {
    @EntityGraph(attributePaths = "category")
    Page<Item> findAll(Specification<Item> spec, Pageable pageable);

    @Query("""
        SELECT new com.dawid.poradzinski.school.ski_rent_app.addons.ItemAvailabilityDto(
            i.id,
            CASE WHEN EXISTS (
                SELECT 1
                FROM RentalItem ri
                JOIN ri.rental r
                WHERE ri.item.id = i.id
                AND r.rentalStart <= :to
                AND r.rentalEnd >= :from
            ) THEN true ELSE false END
        )
        FROM Item i
        WHERE i.id IN :ids
    """)
    List<ItemAvailabilityDto> checkAvailabilityForItems(
        @Param("ids") Set<Long> ids,
        @Param("from") OffsetDateTime from,
        @Param("to") OffsetDateTime to);

}
