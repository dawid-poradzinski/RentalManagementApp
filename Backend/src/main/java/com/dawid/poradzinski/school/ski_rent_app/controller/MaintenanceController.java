package com.dawid.poradzinski.school.ski_rent_app.controller;

import org.springframework.web.bind.annotation.RestController;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.NotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetMaintenancesParams;
import com.dawid.poradzinski.school.ski_rent_app.service.MaintenanceService;
import org.openapitools.model.RequestAddMaintenance;
import org.openapitools.model.ResponseGetMultipleMaintenances;
import org.openapitools.model.ResponseGetSingleMaintenance;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@CrossOrigin
@RequestMapping("v1/api")
public class MaintenanceController {

    private MaintenanceService maintenanceService;

    MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping("items/{id}/maintenances")
    public ResponseEntity<ResponseGetSingleMaintenance> addMaintenance(@PathVariable Long id, @RequestBody RequestAddMaintenance request) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.CREATED).body(maintenanceService.addMaintenance(id, request));
    }

    @GetMapping("items/{id}/maintenances")
    public ResponseEntity<ResponseGetMultipleMaintenances> getMaintenancesForItem(@PathVariable Long id, @ParameterObject GetMaintenancesParams params) {
        return ResponseEntity.ok(maintenanceService.getMaintenancesForItem(id, params));
    }

    @GetMapping("maintenances")
    public ResponseEntity<ResponseGetMultipleMaintenances> getMaintenances(@ParameterObject GetMaintenancesParams params){
        return ResponseEntity.ok(maintenanceService.getMaintenances(params));
    }

    @GetMapping("maintenances/{id}")
    public ResponseEntity<ResponseGetSingleMaintenance> getMaintenance(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenance(id));
    }
    
    
    
        
}
