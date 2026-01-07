package com.dawid.poradzinski.school.ski_rent_app.addons.mapper;

import java.util.List;

import org.openapitools.model.MaintenanceEntity;
import org.openapitools.model.Pages;
import org.openapitools.model.RequestAddMaintenance;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetMaintenancesParams;
import com.dawid.poradzinski.school.ski_rent_app.sql.Maintenance;

@Service
public class MaintenanceMapper {
    
    public Maintenance mapRequestAddMaintenance(RequestAddMaintenance request) {
        Maintenance maintenance = new Maintenance();
        maintenance.setMaintenanceTypeEnum(request.getType());
        maintenance.setNote(request.getNote());
        return maintenance;
    }

    public MaintenanceEntity mapMaintenanceToMaintenanceEntity(Maintenance maintenance) {
        MaintenanceEntity entity = new MaintenanceEntity();
        entity.setId(maintenance.getId());
        entity.setItemName(maintenance.getItem().getName());
        entity.setItemId(maintenance.getItem().getId());
        entity.setItemImage(maintenance.getItem().getImage());
        entity.setDate(maintenance.getDate());
        entity.setType(maintenance.getMaintenanceTypeEnum());
        entity.setNote(maintenance.getNote());
        return entity;
    }

    public List<MaintenanceEntity> mapMaintenancesToListMaintenanceEntity(List<Maintenance> maintenances) {
        return maintenances.stream().map(maintenance -> this.mapMaintenanceToMaintenanceEntity(maintenance)).toList();
    }

    public Pages mapMaintenancePageToPages(Page<Maintenance> page, GetMaintenancesParams params) {
        Pages pages = new Pages();
        pages.setCurrentPage(params.getPage());
        pages.setCurrentSize(params.getSize());
        pages.setMaxPage(page.getTotalPages());

        return pages;
    }
}
