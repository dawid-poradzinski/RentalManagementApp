package com.dawid.poradzinski.school.ski_rent_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem.RentalItemId;

public interface RentalItemRepository extends JpaRepository<RentalItem, RentalItemId>{
    
}
