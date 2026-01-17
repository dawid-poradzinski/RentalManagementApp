package com.dawid.poradzinski.school.ski_rent_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dawid.poradzinski.school.ski_rent_app.sql.Person;

public interface PersonRepository extends JpaRepository<Person, Long>{
    Optional<Person> findByLoginAndPhone(String login, String phone);
    Optional<Person> findByLoginOrPhone(String login, String phoner);
}
