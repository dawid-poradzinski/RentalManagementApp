package com.dawid.poradzinski.school.ski_rent_app.params;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaginationParams {
    
    @Min(0)
    private int page = 0;
    @Min(1)
    @Max(100)
    private int size = 1;
}
