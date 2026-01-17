package com.dawid.poradzinski.school.ski_rent_app.addons.mapper;

import org.openapitools.model.PersonEntity;
import org.openapitools.model.RankEnum;
import org.openapitools.model.RequestRegister;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.sql.Person;

@Service
public class PersonMapper {
    
    public PersonEntity mapSqlPeronToPersonEntity(Person person) {
        return new PersonEntity()
                .id(person.getId())
                .name(person.getName())
                .phone(person.getPhone())
                .surname(person.getSurname())
                .rank(person.getRankEnum());
    }

    public Person mapRequestRegisterToperson(RequestRegister body) {
        return new Person(null, body.getPhone(), body.getName(), body.getSurname(), body.getLogin().toLowerCase(), RankEnum.USER, null);
    }
}
