package com.dawid.poradzinski.school.ski_rent_app.repository;

import java.util.Optional;

import org.openapitools.model.PlacesEnum;
import org.openapitools.model.RentalStatusTypeEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.dawid.poradzinski.school.ski_rent_app.addons.RentalWithPriceDto;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;

public interface RentalRepository extends JpaRepository<Rental, Long>, JpaSpecificationExecutor<Rental> {
    
        @Query("""
        SELECT new com.dawid.poradzinski.school.ski_rent_app.addons.RentalWithPriceDto(
            r,
            COALESCE(SUM(ri.price), 0),
            MAX(ri.currency)
        )
        FROM Rental r
        LEFT JOIN r.items ri
        WHERE (:place IS NULL OR r.place = :place)
            AND (:status IS NULL OR r.status = :status)
        GROUP BY r
    """)
    Page<RentalWithPriceDto> findRentalsWithTotalPrice(
        @Param("place") PlacesEnum place,
        @Param("status") RentalStatusTypeEnum status,
        Pageable pageable
    );

    @EntityGraph(attributePaths = {"buyer", "items", "items.item"})
    Optional<Rental> findWithItemsById(Long id);

}
