package com.dawid.poradzinski.school.ski_rent_app.service;

import java.time.OffsetDateTime;

import org.openapitools.model.MaintenanceTypeEnum;
import org.openapitools.model.RequestAddMaintenance;
import org.openapitools.model.ResponseGetMultipleMaintenances;
import org.openapitools.model.ResponseGetSingleMaintenance;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.NotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.MaintenanceMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetMaintenancesParams;
import com.dawid.poradzinski.school.ski_rent_app.addons.specifications.MaintenanceSpecification;
import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.MaintenanceRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.Maintenance;

@Service
public class MaintenanceService {
    
    private MaintenanceRepository maintenanceRepository;
    private ItemRepository itemRepository;
    private MaintenanceMapper maintenanceMapper;

    MaintenanceService(MaintenanceRepository maintenanceRepository,
                    ItemRepository itemRepository,
                    MaintenanceMapper maintenanceMapper) {
        this.maintenanceRepository = maintenanceRepository;
        this.itemRepository = itemRepository;
        this.maintenanceMapper = maintenanceMapper;
    }

    public ResponseGetSingleMaintenance addMaintenance(Long itemId, RequestAddMaintenance request) throws NotFoundException {
        
        Item item = itemRepository.findById(itemId).get();

        Maintenance maintenance = maintenanceMapper.mapRequestAddMaintenance(request);
        maintenance.setItem(item);

        if(maintenance.getMaintenanceTypeEnum() == MaintenanceTypeEnum.DAMAGE && !item.getDamaged()) {
            item.setDamaged(true);
            itemRepository.save(item);
        } else if (maintenance.getMaintenanceTypeEnum() == MaintenanceTypeEnum.REPAIR && item.getDamaged()) {
            item.setDamaged(false);
            itemRepository.save(item);
        }

        return new ResponseGetSingleMaintenance()
                .timestamp(OffsetDateTime.now())
                .maintenance(maintenanceMapper.mapMaintenanceToMaintenanceEntity(maintenanceRepository.save(maintenance), itemId));
    }

    public ResponseGetMultipleMaintenances getMaintenancesForItem(Long itemId, GetMaintenancesParams params) {
        var page = PageRequest.of(params.getPage(), params.getSize());

        Page<Maintenance> maintenances = maintenanceRepository.findAll(MaintenanceSpecification.filter(params, itemId), page);

        return new ResponseGetMultipleMaintenances()
                .timestamp(OffsetDateTime.now())
                .maintenance(maintenanceMapper.mapMaintenancesToListMaintenanceEntity(maintenances.toList()))
                .pages(maintenanceMapper.mapMaintenancePageToPages(maintenances, params));
    }

    public ResponseGetMultipleMaintenances getMaintenances(GetMaintenancesParams params) {
        var page = PageRequest.of(params.getPage(), params.getSize());

        Page<Maintenance> maintenances = maintenanceRepository.findAll(MaintenanceSpecification.filter(params, null), page);

        return new ResponseGetMultipleMaintenances()
                .timestamp(OffsetDateTime.now())
                .maintenance(maintenanceMapper.mapMaintenancesToListMaintenanceEntity(maintenances.toList()))
                .pages(maintenanceMapper.mapMaintenancePageToPages(maintenances, params));
    }

    public ResponseGetSingleMaintenance getMaintenance(Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id).get();

        return new ResponseGetSingleMaintenance()
                .timestamp(OffsetDateTime.now())
                .maintenance(maintenanceMapper.mapMaintenanceToMaintenanceEntity(maintenance));
    }
}
