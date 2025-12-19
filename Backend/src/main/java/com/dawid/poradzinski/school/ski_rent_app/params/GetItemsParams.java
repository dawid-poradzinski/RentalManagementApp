package com.dawid.poradzinski.school.ski_rent_app.params;

import java.util.List;

import org.openapitools.model.ItemStatusTypeEnum;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GetItemsParams extends PaginationParams{

    List<String> category;
    ItemStatusTypeEnum status;
    Boolean damaged;
    
}
