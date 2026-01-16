package com.dawid.poradzinski.school.ski_rent_app.addons;

import java.math.BigDecimal;

import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;

public record RentalWithPriceDto(Rental rental, BigDecimal amount, String currency) {
    
}
