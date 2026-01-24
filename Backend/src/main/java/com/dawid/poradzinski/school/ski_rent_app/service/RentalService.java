package com.dawid.poradzinski.school.ski_rent_app.service;
import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.openapitools.model.FullRentalEntity;
import org.openapitools.model.MaintenanceTypeEnum;
import org.openapitools.model.RentalStatusTypeEnum;
import org.openapitools.model.RequestAddMaintenance;
import org.openapitools.model.RequestReturnRental;
import org.openapitools.model.ResponseGetMultipleRentals;
import org.openapitools.model.ResponseGetSingleRental;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.RentalWithPriceDto;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.BuyerEntityMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.RentalMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetRentalsParams;
import com.dawid.poradzinski.school.ski_rent_app.repository.RentalItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.RentalRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem;

import jakarta.transaction.Transactional;

@Service
public class RentalService {

    private final RentalMapper rentalMapper;
    private final RentalRepository rentalRepository;
    private final BuyerEntityMapper buyerEntityMapper;
    private final MaintenanceService maintenanceService;
    private final RentalItemRepository rentalItemRepository;

    RentalService(RentalRepository rentalRepository, BuyerEntityMapper buyerEntityMapper, RentalMapper rentalMapper, MaintenanceService maintenanceService, RentalItemRepository rentalItemRepository) {
        this.rentalRepository = rentalRepository;
        this.buyerEntityMapper = buyerEntityMapper;
        this.rentalMapper = rentalMapper;
        this.maintenanceService = maintenanceService;
        this.rentalItemRepository = rentalItemRepository;
    }

    
    public ResponseGetMultipleRentals getRentals(GetRentalsParams params) {
        var page = PageRequest.of(params.getPage(), params.getSize(), Sort.by("creationDate").descending());

        Page<RentalWithPriceDto> rentals = rentalRepository.findRentalsWithTotalPrice(params.getPlace(), params.getStatus(), params.getName(), params.getSurname(), params.getPhone(), page);

        return new ResponseGetMultipleRentals()
                .timestamp(OffsetDateTime.now())
                .rentals(rentalMapper.mapSqlRentalsWithPriceToSmallRentalEntities(rentals))
                .pages(rentalMapper.mapRentalsTopages(rentals, params));
    }

    public ResponseGetSingleRental getRental(Long id) {
        
        Rental rental = rentalRepository.findWithItemsById(id)
            .orElseThrow(() -> new RuntimeException("Rental not found:Rental not ofund"));

        List<RentalItem> items = rental.getItems();

        return new ResponseGetSingleRental()
            .timestamp(OffsetDateTime.now())
            .rental(new FullRentalEntity()
                .rental(rentalMapper.mapSqlRentalWithPriceToSmallRentalEntity(new RentalWithPriceDto(rental, items.stream().map(RentalItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add), items.getFirst().getCurrency())))
                .items(rentalMapper.mapSqlRentalItemsToItemsForRental(items))
                .buyer(buyerEntityMapper.mapSqlBuyerEntityToBuyerEntity(rental.getBuyer())));
    }

    public void closeRental(Long id) {
        Optional<Rental> optional = rentalRepository.findById(id);

        if (optional.isEmpty()) {
           throw new RuntimeException("Wrong id for rental: Specific id doesnt exist on rental"); 
        }
        Rental rental = optional.get();
        if (rental.getStatus() != RentalStatusTypeEnum.RETURNING) {
            throw new RuntimeException("Rental is not returning: Rental is in other state than returning");
        }
        if (rental.getPaidPrice().compareTo(rental.getItems().stream().map(RentalItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add)) < 0) {
            throw new RuntimeException("Rental not payed!:Rental must be payed fully first");
        }
        rental.setStatus(RentalStatusTypeEnum.FINISHED);
        rentalRepository.save(rental);
    }

    @Transactional
    public void returnRental(Long id, RequestReturnRental body) {

        Optional<Rental> optional = rentalRepository.findById(id);

        if (optional.isEmpty()) {
           throw new RuntimeException("Wrong id for rental: Specific id doesnt exist on rental"); 
        }
        Rental rental = optional.get();
        if (rental.getStatus() != RentalStatusTypeEnum.RESERVED) {
            throw new RuntimeException("Rental is not reserver: Rental is in other state than reserved");
        }
        
        rental.setRentalReturn(OffsetDateTime.now());
        List<RentalItem> rentalItems = rental.getItems();

        Set<Long> idsToAddMaintenance = body.getMaintenances().stream().map(maintenance -> maintenance.getId()).collect(Collectors.toCollection(HashSet::new));

        if(!idsToAddMaintenance.isEmpty()) {

            long itemsCount = rentalItems.stream()
                .filter(rl -> idsToAddMaintenance.contains(rl.getId().getItemId()))
                .count();

            if (itemsCount != idsToAddMaintenance.size()) {
                throw new RuntimeException("Wrong number of maintenances: Number of maintenances doesn't match items in rental");
            }

            body.getMaintenances().forEach(maintenance -> {
                if (maintenance.getType() == MaintenanceTypeEnum.DAMAGE) {
                    rentalItems.stream()
                        .filter(ri -> ri.getId().getItemId() == maintenance.getId())
                        .forEach(ri -> ri.setPrice(ri.getPrice().add(BigDecimal.valueOf(20))));
                }
                maintenanceService.addMaintenance(maintenance.getId(), new RequestAddMaintenance(maintenance.getType(), maintenance.getNote()));
            });
        }

        if (rental.getRentalEnd().isBefore(rental.getRentalReturn())) {
            double minutes = Duration.between(rental.getRentalEnd(), rental.getRentalReturn()).toMinutes();
            double numberOfHalfOfHours  = Math.ceil(minutes / 30L);

            rentalItems.stream().forEach(
                ri -> ri.setPrice(
                    ri.getPrice()
                    .add(ri.getItem().getPriceAmount()
                        .multiply(BigDecimal.valueOf(numberOfHalfOfHours))).setScale(2, RoundingMode.HALF_UP)
                    ));
        }

        rentalItemRepository.saveAll(rentalItems);
        rental.setStatus(RentalStatusTypeEnum.RETURNING);
        rental.setItems(rentalItems);
        rentalRepository.save(rental);
    }

    public void payRemaining(Long id) {
        Optional<Rental> optional = rentalRepository.findById(id);
        if (optional.isEmpty()) {
           throw new RuntimeException("Wrong id for rental: Specific id doesnt exist on rental"); 
        }
        Rental rental = optional.get();
        BigDecimal totalPrice = rental.getItems().stream()
        .map(RentalItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (rental.getPaidPrice().compareTo(totalPrice) != 0) {
            rental.setPaidPrice(totalPrice);
            rentalRepository.save(rental);
        }
    }
}
