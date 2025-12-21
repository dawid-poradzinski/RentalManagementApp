package com.dawid.poradzinski.school.ski_rent_app.service;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;

import org.openapitools.model.Price;
import org.openapitools.model.RequestCreateRental;
import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.ResponseCreateRental;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.KeyNotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.BuyerEntityMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.RentalMapper;
import com.dawid.poradzinski.school.ski_rent_app.repository.RentalItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.RentalRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem.RentalItemId;

@Service
public class RentalService {
    
    private final RentalRepository rentalRepository;
    private final ItemCheckService itemCheckService;
    private final BuyerEntityMapper buyerEntityMapper;
    private final RentalItemRepository rentalItemRepository;
    private final RentalMapper rentalMapper;

    RentalService(RentalRepository rentalRepository,
                ItemCheckService itemCheckService,
                BuyerEntityMapper buyerEntityMapper,
                RentalItemRepository rentalItemRepository,
                RentalMapper rentalMapper) {
        this.rentalRepository = rentalRepository;
        this.itemCheckService = itemCheckService;
        this.buyerEntityMapper = buyerEntityMapper;
        this.rentalItemRepository = rentalItemRepository;
        this.rentalMapper = rentalMapper;
    }

    public ResponseItemCheck itemCheck(RequestItemCheck request) throws KeyNotFoundException, Exception {
        return new ResponseItemCheck(OffsetDateTime.now(), itemCheckService.itemCheck(request));
    }

    public ResponseCreateRental createRental(RequestCreateRental request) throws Exception {
        if (request.getItins().isEmpty()) {
            throw new Exception("no itins on rental");
        }
        List<Item> items = itemCheckService.itemShop(request.getKey(), new HashSet<Long>(request.getItins()));
        Price price = itemCheckService.itemPrice(items);

        Rental rental = new Rental();
        rental.setBuyer(buyerEntityMapper.mapEntityToSql(request.getBuyer()));
        rental.setPaidPrice(request.getPaid().getPriceAmount());
        rental.setPaidCurrency(request.getPaid().getPriceCurrency());
        rental.setPrice(price.getPriceAmount());
        rental.setPriceCurrency(price.getPriceCurrency());

        Rental savedRental = rentalRepository.save(rental);

        List<RentalItem> rentalItems = items.stream()
            .map(item -> {
                return new RentalItem(new RentalItemId(savedRental.getId(), item.getId()), savedRental, item);
            })
            .toList();

        rentalItemRepository.saveAll(rentalItems);
        savedRental.setItems(rentalItems);

        return new ResponseCreateRental(OffsetDateTime.now(), rentalMapper.mapRentalToFullRentalEntity(savedRental));
    
    }
}
