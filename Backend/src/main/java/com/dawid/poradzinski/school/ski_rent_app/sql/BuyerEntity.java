package com.dawid.poradzinski.school.ski_rent_app.sql;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class BuyerEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pesel;

    private String phone;

    private String name;

    private String surname;

    @OneToOne
    @JoinColumn(name = "rental_id")
    private Rental rental;
}
