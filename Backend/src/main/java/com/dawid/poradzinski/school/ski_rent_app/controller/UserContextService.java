package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.openapitools.model.PersonEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserContextService {

    public PersonEntity getCurrentPerson() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return (PersonEntity) auth.getPrincipal();
    }

    public Long getCurrentPersonId() {
        var person = getCurrentPerson();
        return person != null ? person.getId() : null;
    }
}
