package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.KeyNotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.service.ItemCheckService;

import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("itemCheck")
public class ItemCheckController {
    
    private final ItemCheckService itemCheckService;

    ItemCheckController(ItemCheckService itemCheckService) {
        this.itemCheckService = itemCheckService;
    }

    @PostMapping()
    public ResponseEntity<ResponseItemCheck> checkItem(@RequestBody RequestItemCheck request) throws KeyNotFoundException, Exception {
        return ResponseEntity.ok(itemCheckService.itemCheck(request));
    }
    
}
