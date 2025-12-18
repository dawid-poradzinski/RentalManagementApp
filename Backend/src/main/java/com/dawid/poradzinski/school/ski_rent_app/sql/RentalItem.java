package com.dawid.poradzinski.school.ski_rent_app.sql;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class RentalItem {

    @EmbeddedId
    private RentalItemId id;

    @ManyToOne
    @MapsId("rentalId")
    @JoinColumn(name = "rental_id")
    private Rental rental;

    @ManyToOne
    @MapsId("itemId")
    @JoinColumn(name = "item_id")
    private Item item;

    @Embeddable
    @EqualsAndHashCode
    public static class RentalItemId implements Serializable {

        private Long rentalId;
        private Long itemId;
    }
}

