package com.dawid.poradzinski.school.ski_rent_app.addons.mapper;

import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.sql.BuyerEntity;

@Service
public class BuyerEntityMapper {
    
    public BuyerEntity mapEntityToSql(org.openapitools.model.BuyerEntity entity) {
        return new BuyerEntity(null, entity.getPesel(), entity.getPhone(), entity.getName(), entity.getSurname(), null);
    }
    
    public org.openapitools.model.BuyerEntity mapSqlToEntity(BuyerEntity entity) {
        return new org.openapitools.model.BuyerEntity().name(entity.getName()).surname(entity.getSurname()).phone(entity.getPhone()).pesel(entity.getPesel());
    }
}
