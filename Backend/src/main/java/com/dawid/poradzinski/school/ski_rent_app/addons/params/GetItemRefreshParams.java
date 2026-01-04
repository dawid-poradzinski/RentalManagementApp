package com.dawid.poradzinski.school.ski_rent_app.addons.params;

import java.time.OffsetDateTime;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GetItemRefreshParams extends PaginationParams {
    
    List<String> category;
    @NotBlank
    OffsetDateTime from;
    @NotBlank
    OffsetDateTime to;
}
