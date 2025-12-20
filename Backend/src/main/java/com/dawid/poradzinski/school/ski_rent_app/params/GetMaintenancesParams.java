package com.dawid.poradzinski.school.ski_rent_app.params;

import org.openapitools.model.MaintenanceTypeEnum;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GetMaintenancesParams extends PaginationParams {
    
    MaintenanceTypeEnum type;
}
