package com.dawid.poradzinski.school.ski_rent_app.sql;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.openapitools.model.MaintenanceTypeEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Maintenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private MaintenanceTypeEnum maintenanceTypeEnum;

    @ManyToOne(fetch = FetchType.LAZY)
    private Item item;

    @CreationTimestamp
    private OffsetDateTime date;

    private String note;
}
