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
        LEFT JOIN r.buyer rb
        WHERE (:place IS NULL OR r.place = :place)
            AND (:status IS NULL OR r.status = :status)
            AND (:name IS NULL OR rb.name = :name)
            AND (:surname IS NULL OR rb.surname = :surname)
            AND (:phone IS NULL OR rb.phone = :phone)
        GROUP BY r
    """)
    Page<RentalWithPriceDto> findRentalsWithTotalPrice(
        @Param("place") PlacesEnum place,
        @Param("status") RentalStatusTypeEnum status,
        @Param("name") String name,
        @Param("surname") String surname,
        @Param("phone") String phone,
        Pageable pageable
    );

    @EntityGraph(attributePaths = {"buyer", "items", "items.item"})
    Optional<Rental> findWithItemsById(Long id);

}
