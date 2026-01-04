package com.dawid.poradzinski.school.ski_rent_app.addons.params;

import java.util.List;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GetItemsParams extends PaginationParams{

    List<String> category;
    Boolean damaged;
    
}
