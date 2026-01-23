package com.dawid.poradzinski.school.ski_rent_app.configs.converters;

import org.openapitools.model.SizeEnum;
import org.springframework.stereotype.Component;

import org.springframework.core.convert.converter.Converter;

@Component
public class SizesEnumConverter implements Converter<String, SizeEnum> {

    @Override
    public SizeEnum convert(String source) {
        for (SizeEnum size : SizeEnum.values()) {
            if (size.getValue().equalsIgnoreCase(source)) {
                return size;
            }
        }
        throw new IllegalArgumentException("Invalid size: " + source);
    }
}