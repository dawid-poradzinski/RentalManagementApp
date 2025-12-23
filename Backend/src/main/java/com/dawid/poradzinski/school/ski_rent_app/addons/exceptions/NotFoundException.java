package com.dawid.poradzinski.school.ski_rent_app.addons.exceptions;

import java.util.NoSuchElementException;

public class NotFoundException extends NoSuchElementException {
    
    public NotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
