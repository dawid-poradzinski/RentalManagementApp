package com.dawid.poradzinski.school.ski_rent_app.sql;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.openapitools.model.ItemStatusTypeEnum;

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
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ItemCategory category;

    @CreationTimestamp
    private LocalDate addDate;

    private LocalDate lastMaintenance;

    private LocalDate lastRental;

    @OneToMany(mappedBy = "item", fetch = FetchType.LAZY)
    private List<Maintenance> maintenances;

    @OneToMany(mappedBy = "item", fetch = FetchType.LAZY)
    private List<RentalItem> rentals;

    @Enumerated(EnumType.STRING)
    private ItemStatusTypeEnum status;
    
    private Boolean damaged = false;

    private BigDecimal priceAmount;

    private String priceCurrency = "PLN";
}
