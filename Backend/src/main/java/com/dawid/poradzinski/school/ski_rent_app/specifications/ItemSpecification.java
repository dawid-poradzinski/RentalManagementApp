package com.dawid.poradzinski.school.ski_rent_app.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.dawid.poradzinski.school.ski_rent_app.params.GetItemsParams;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.ItemCategory;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class ItemSpecification {
    
    public static Specification<Item> filter(GetItemsParams params) {
        return (root, query, cb) -> {
            
            List<Predicate> predicates = new ArrayList<>();
            
            if(params.getCategory() != null && !params.getCategory().isEmpty()) {
                Join<Item, ItemCategory> categoryJoin = root.join("category");
                predicates.add(categoryJoin.get("category").in(params.getCategory()));
            }

            if(params.getDamaged() != null) {
                predicates.add(cb.equal(root.get("damaged"), params.getDamaged()));
            }

            if(params.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), params.getStatus()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
