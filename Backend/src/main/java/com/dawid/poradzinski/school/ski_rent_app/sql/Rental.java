package com.dawid.poradzinski.school.ski_rent_app.sql;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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

    @OneToMany(mappedBy = "rental", fetch = FetchType.LAZY)
    private List<RentalItem> items;

    @CreationTimestamp
    private OffsetDateTime rental_date;

    private BigDecimal price;

    private String priceCurrency;

    private BigDecimal paidPrice;

    private String paidCurrency;

    private Boolean open = true;

    @OneToOne
    @JoinColumn(name = "buyer_id")
    @ManyToOne(cascade = CascadeType.ALL)
    private BuyerEntity buyer;
    
}
