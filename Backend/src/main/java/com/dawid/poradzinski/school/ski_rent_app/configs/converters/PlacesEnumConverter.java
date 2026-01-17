package com.dawid.poradzinski.school.ski_rent_app.configs.converters;

import org.openapitools.model.PlacesEnum;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;


@Component
public class PlacesEnumConverter implements Converter<String, PlacesEnum> {

    @Override
    public PlacesEnum convert(String source) {
        for (PlacesEnum place : PlacesEnum.values()) {
            if (place.getValue().equalsIgnoreCase(source)) {
                return place;
            }
        }
        throw new IllegalArgumentException("Invalid place: " + source);
    }
}