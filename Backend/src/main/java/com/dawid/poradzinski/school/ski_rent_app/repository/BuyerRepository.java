package com.dawid.poradzinski.school.ski_rent_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dawid.poradzinski.school.ski_rent_app.sql.BuyerEntity;

public interface BuyerRepository extends JpaRepository<BuyerEntity, Long>{

}
