package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dawid.poradzinski.school.ski_rent_app.service.RentalService;

import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.RequestItemShop;
import org.openapitools.model.ResponseGetId;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@CrossOrigin
@RequestMapping("v1/api")
public class RentalController {
     
    private final RentalService rentalService;

    RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping("rental/itemCheck")
    public ResponseEntity<ResponseItemCheck> postItemCheck(@RequestBody RequestItemCheck request) {
       return ResponseEntity.ok(rentalService.itemCheck(request));
    }

    @PostMapping("rental/itemShop")
    public ResponseEntity<ResponseGetId> postItemShop(@RequestBody RequestItemShop request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rentalService.itemShop(request));
    }

    @GetMapping("rental/{id}")
    public String getMethodName(@RequestParam String param) {
        return new String();
    }
    
    
}
