package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.KeyNotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.service.RentalService;

import org.openapitools.model.RequestCreateRental;
import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.ResponseCreateRental;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class RentalController {

    private RentalService rentalService;

    RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }
    
    @PostMapping("itemCheck")
    public ResponseEntity<ResponseItemCheck> ItemCheck(@RequestBody RequestItemCheck request) throws KeyNotFoundException, Exception {
        return ResponseEntity.ok(rentalService.itemCheck(request));
    }
    

    @PostMapping("rentals")
    public ResponseEntity<ResponseCreateRental> createRental(@RequestBody RequestCreateRental request) throws Exception{
        return ResponseEntity.ok(rentalService.createRental(request));
    }
    
}
