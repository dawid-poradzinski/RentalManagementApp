package com.dawid.poradzinski.school.ski_rent_app.service;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.openapitools.model.FullRentalEntity;
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
import com.dawid.poradzinski.school.ski_rent_app.repository.RentalRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem;

@Service
public class RentalService {

    private final RentalMapper rentalMapper;
    private final RentalRepository rentalRepository;
    private final BuyerEntityMapper buyerEntityMapper;

    RentalService(RentalRepository rentalRepository, BuyerEntityMapper buyerEntityMapper, RentalMapper rentalMapper) {
        this.rentalRepository = rentalRepository;
        this.buyerEntityMapper = buyerEntityMapper;
        this.rentalMapper = rentalMapper;
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
}
