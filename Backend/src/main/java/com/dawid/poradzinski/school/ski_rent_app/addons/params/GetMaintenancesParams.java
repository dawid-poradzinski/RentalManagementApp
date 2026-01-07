package com.dawid.poradzinski.school.ski_rent_app.addons.params;

import java.util.Set;

import org.openapitools.model.MaintenanceTypeEnum;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GetMaintenancesParams extends PaginationParams {
    
    Set<MaintenanceTypeEnum> types;
}
