package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetRentalsParams;
import com.dawid.poradzinski.school.ski_rent_app.service.RentalService;

import org.openapitools.model.RequestReturnRental;
import org.openapitools.model.ResponseGetMultipleRentals;
import org.openapitools.model.ResponseGetSingleRental;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin
@RequestMapping("v1/api/rentals")
public class RentalController {
     
    private final RentalService rentalService;

    RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @GetMapping("{id}")
    public ResponseEntity<ResponseGetSingleRental> getRental(@PathVariable Long id) {
        return ResponseEntity.ok(rentalService.getRental(id));
    }
    
    @GetMapping()
    public ResponseEntity<ResponseGetMultipleRentals> getRentals(@ParameterObject GetRentalsParams params) {
        return ResponseEntity.ok(rentalService.getRentals(params));
    }

    @PostMapping("{id}/return")
    public ResponseEntity<Void> returnRental(@PathVariable Long id, @RequestBody RequestReturnRental body) {
        rentalService.returnRental(id, body);
        return ResponseEntity.ok(null);
    }

    @PostMapping("{id}/pay")
    public ResponseEntity<Void> payRemaining(@PathVariable Long id) {
        rentalService.payRemaining(id);
        return ResponseEntity.ok(null);
    }
    
    @PostMapping("{id}/close")
    public ResponseEntity<Void> closeRental(@PathVariable Long id) {
        rentalService.closeRental(id);;
        return ResponseEntity.ok(null);
    }
        
}
