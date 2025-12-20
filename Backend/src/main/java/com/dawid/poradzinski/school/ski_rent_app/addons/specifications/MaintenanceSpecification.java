package com.dawid.poradzinski.school.ski_rent_app.addons.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetMaintenancesParams;
import com.dawid.poradzinski.school.ski_rent_app.sql.Maintenance;

import jakarta.persistence.criteria.Predicate;

public class MaintenanceSpecification {
    public static Specification<Maintenance> filter(GetMaintenancesParams params, Long itemId) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();
            
            if(itemId != null) {
                predicates.add(cb.equal(root.get("item").get("id"), itemId));
            }

            if(params.getType() != null) {
                predicates.add(cb.equal(root.get("maintenanceTypeEnum"), params.getType()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
