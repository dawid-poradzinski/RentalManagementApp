package com.dawid.poradzinski.school.ski_rent_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dawid.poradzinski.school.ski_rent_app.sql.Person;
import com.dawid.poradzinski.school.ski_rent_app.sql.PersonPrivate;

public interface PersonPrivateRepository extends JpaRepository<PersonPrivate, Long> {
    Optional<PersonPrivate> findByPerson(Person person);
}
