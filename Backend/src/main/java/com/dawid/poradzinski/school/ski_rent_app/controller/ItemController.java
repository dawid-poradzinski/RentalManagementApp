package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.NotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemRefreshParams;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemsParams;
import com.dawid.poradzinski.school.ski_rent_app.service.ItemService;

import org.openapitools.model.RequestAddItem;
import org.openapitools.model.ResponseGetId;
import org.openapitools.model.ResponseGetMultipleItems;
import org.openapitools.model.ResponseGetSingleItem;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@CrossOrigin
@RequestMapping("v1/api/items")
public class ItemController {

    private ItemService itemService;

    ItemController(ItemService itemService) {
        this.itemService = itemService;
    }
    
    @PostMapping()
    public ResponseEntity<ResponseGetId> addItem(@RequestBody RequestAddItem request) {    
        return ResponseEntity.ok(itemService.addItem(request));
    }

    @GetMapping()
    public ResponseEntity<ResponseGetMultipleItems> getItems(@ParameterObject GetItemsParams getItemsParams) {
        return ResponseEntity.ok(itemService.getItems(getItemsParams));
    }
    

    @GetMapping("/{id}")
    public ResponseEntity<ResponseGetSingleItem> getItem(@PathVariable Long id) throws NotFoundException {
        return ResponseEntity.ok(itemService.getItem(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseGetId> deleteItem(@PathVariable Long id) throws NotFoundException {
        return ResponseEntity.status(org.springframework.http.HttpStatus.GONE).body(itemService.deleteItem(id));
    }
    
    @GetMapping("/itemRefresh")
    public ResponseEntity<ResponseGetMultipleItems> getItemRefresh(@ParameterObject GetItemRefreshParams params) {
        return ResponseEntity.ok(itemService.getItemRefresh(params));
    }
    
}
