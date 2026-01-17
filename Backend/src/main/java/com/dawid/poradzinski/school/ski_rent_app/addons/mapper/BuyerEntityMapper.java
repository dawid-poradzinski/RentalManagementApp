package com.dawid.poradzinski.school.ski_rent_app.addons.mapper;

import org.openapitools.model.BuyerEntity;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.sql.Person;

@Service
public class BuyerEntityMapper {
    
    public BuyerEntity mapPersonToBuyerEntity(Person personEntity) {
        return new BuyerEntity()
                .name(personEntity.getName())
                .surname(personEntity.getSurname())
                .phone(personEntity.getPhone());
    }

    public com.dawid.poradzinski.school.ski_rent_app.sql.BuyerEntity mapPersonToSqlBuyerEntity(Person person) {
        var returnEntity = new com.dawid.poradzinski.school.ski_rent_app.sql.BuyerEntity();
        returnEntity.setName(person.getName());
        returnEntity.setSurname(person.getSurname());
        returnEntity.setPhone(person.getPhone());
        returnEntity.setPerson(person);
        return returnEntity;
    }
    
    public BuyerEntity mapSqlBuyerEntityToBuyerEntity(com.dawid.poradzinski.school.ski_rent_app.sql.BuyerEntity buyerEntity) {
        return new BuyerEntity()
                .name(buyerEntity.getName())
                .personId(buyerEntity.getPerson().getId())
                .phone(buyerEntity.getPhone())
                .surname(buyerEntity.getPhone());
    }
}
