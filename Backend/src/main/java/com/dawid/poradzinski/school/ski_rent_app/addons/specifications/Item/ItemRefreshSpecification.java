package com.dawid.poradzinski.school.ski_rent_app.addons.specifications.Item;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemRefreshParams;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.ItemCategory;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class ItemRefreshSpecification {
    
    public static Specification<Item> filter(GetItemRefreshParams params) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("damaged"), false));

            if (params.getCategory() != null && !params.getCategory().isEmpty()) {
                Join<Item, ItemCategory> categoryJoin = root.join("category");
                predicates.add(categoryJoin.get("category").in(params.getCategory()));
            }

            if(params.getItemSize() != null) {
                predicates.add(cb.equal(root.get("size"), params.getItemSize()));
            }

            if(params.getPlace() != null) {
                predicates.add(cb.equal(root.get("place"), params.getPlace()));
            }
            
            if (params.getFrom() != null && params.getTo() != null) {

                Subquery<Long> subquery = query.subquery(Long.class);
                Root<RentalItem> ri = subquery.from(RentalItem.class);
                Join<RentalItem, Rental> rental = ri.join("rental");

                subquery.select(ri.get("item").get("id"))
                        .where(
                            cb.equal(ri.get("item").get("id"), root.get("id")),
                            cb.lessThanOrEqualTo(rental.get("rentalStart"), params.getTo()),
                            cb.greaterThanOrEqualTo(rental.get("rentalEnd"), params.getFrom())
                        );
                predicates.add(cb.not(cb.exists(subquery)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
