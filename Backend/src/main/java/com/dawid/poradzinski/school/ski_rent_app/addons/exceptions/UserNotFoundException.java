package com.dawid.poradzinski.school.ski_rent_app.addons.exceptions;

public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException() {
        super("User not found: This combination of login/phone and password didnt find anything");
    }
}
