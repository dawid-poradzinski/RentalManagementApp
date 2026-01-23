package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.RequestItemShop;
import org.openapitools.model.ResponseGetId;
import org.openapitools.model.ResponseGetMultipleItems;
import org.openapitools.model.ResponseItemCheck;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemRefreshParams;
import com.dawid.poradzinski.school.ski_rent_app.service.ShopService;

@RestController
@RequestMapping("v1/api/shop")
public class ShopController {
    
    private final ShopService shopService;

    ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping("itemRefresh")
    public ResponseEntity<ResponseGetMultipleItems> getItemRefresh(@ParameterObject GetItemRefreshParams params) {
        return ResponseEntity.ok(shopService.getItemRefresh(params));
    }

    @PostMapping("itemCheck")
    public ResponseEntity<ResponseItemCheck> postItemCheck(@RequestBody RequestItemCheck request) {
       return ResponseEntity.ok(shopService.itemCheck(request));
    }

    @PostMapping("itemShop")
    public ResponseEntity<ResponseGetId> postItemShop(@RequestBody RequestItemShop request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shopService.itemShop(request));
    }

}
