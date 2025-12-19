package com.dawid.poradzinski.school.ski_rent_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dawid.poradzinski.school.ski_rent_app.sql.ItemCategory;

public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Long> {

    Optional<ItemCategory> findByCategory(String category);
}