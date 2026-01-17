package com.dawid.poradzinski.school.ski_rent_app.sql;

import java.util.List;

import org.openapitools.model.RankEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phone;

    private String name;

    private String surname;
    
    private String login;

    @Enumerated(EnumType.STRING)
    private RankEnum rankEnum = RankEnum.USER;

    @OneToMany(mappedBy = "person", fetch = FetchType.LAZY)
    private List<BuyerEntity> buyers;
}
