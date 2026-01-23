package com.dawid.poradzinski.school.ski_rent_app.sql;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.openapitools.model.PlacesEnum;
import org.openapitools.model.RentalStatusTypeEnum;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rental {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "rental", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RentalItem> items = new ArrayList<>();

    @CreationTimestamp
    private OffsetDateTime creationDate;

    private OffsetDateTime rentalStart;

    private OffsetDateTime rentalEnd;

    private BigDecimal paidPrice;

    private String paidCurrency;

    @Enumerated(EnumType.STRING)
    private PlacesEnum place;
    
    @Enumerated(EnumType.STRING)
    private RentalStatusTypeEnum status = RentalStatusTypeEnum.RESERVED;

    @JoinColumn(name = "buyer_id")
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private BuyerEntity buyer;

    public void addItem(Item item, BigDecimal priceModifier) {
        RentalItem rentalItem = new RentalItem();

        rentalItem.setId(new RentalItem.RentalItemId());

        rentalItem.setRental(this);
        rentalItem.setItem(item);
        rentalItem.setPrice(item.getPriceAmount().multiply(priceModifier));
        rentalItem.setCurrency(item.getPriceCurrency());

        this.items.add(rentalItem);
    }
    
}
