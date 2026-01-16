package com.dawid.poradzinski.school.ski_rent_app.addons.params;

import org.openapitools.model.PlacesEnum;
import org.openapitools.model.RentalStatusTypeEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetRentalsParams extends PaginationParams{
    PlacesEnum place;
    RentalStatusTypeEnum status;
}
