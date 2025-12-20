package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dawid.poradzinski.school.ski_rent_app.exceptions.exceptions.NotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.params.GetMaintenancesParams;
import com.dawid.poradzinski.school.ski_rent_app.service.MaintenanceService;

import jakarta.websocket.server.PathParam;

import org.openapitools.model.RequestAddMaintenance;
import org.openapitools.model.ResponseGetMultipleMaintenances;
import org.openapitools.model.ResponseGetSingleMaintenance;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class MaintenanceController {

    private MaintenanceService maintenanceService;

    MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping("items/{id}/maintenances")
    public ResponseEntity<ResponseGetSingleMaintenance> addMaintenance(@PathParam("id") Long id, @RequestBody RequestAddMaintenance request) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.addMaintenance(id, request));
    }

    @GetMapping("items/{id}/maintenances")
    public ResponseEntity<ResponseGetMultipleMaintenances> getMaintenancesForItem(@PathParam("id") Long id, @ParameterObject GetMaintenancesParams params) {
        return ResponseEntity.ok(maintenanceService.getMaintenancesForItem(id, params));
    }

    @GetMapping("maintenances")
    public ResponseEntity<ResponseGetMultipleMaintenances> getMaintenances(@ParameterObject GetMaintenancesParams params) {
        return ResponseEntity.ok(maintenanceService.getMaintenances(params));
    }

    @GetMapping("maintenances/{id}")
    public ResponseEntity<ResponseGetSingleMaintenance> getMaintenance(@PathParam("id") Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenance(id));
    }
    
    
    
        
}
