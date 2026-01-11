package com.dawid.poradzinski.school.ski_rent_app.addons.specifications.Item;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemsParams;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.ItemCategory;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;

public class BasicItemSpecification {
    
    public static Specification<Item> filter(GetItemsParams params) {
        return (root, query, cb) -> {
            
            List<Predicate> predicates = new ArrayList<>();
                
            if(params.getCategory() != null && !params.getCategory().isEmpty()) {
                Join<Item, ItemCategory> categoryJoin = root.join("category");
                predicates.add(categoryJoin.get("category").in(params.getCategory()));
            }

            if(params.getItemSize() != null) {
                predicates.add(cb.equal(root.get("size"), params.getItemSize()));
            }

            if(params.getPlace() != null) {
                predicates.add(cb.equal(root.get("place"), params.getPlace()));
            }

            if(params.getDamaged() != null) {
                predicates.add(cb.equal(root.get("damaged"), params.getDamaged()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
