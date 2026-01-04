package com.dawid.poradzinski.school.ski_rent_app.service;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.RequestItemShop;
import org.openapitools.model.ResponseGetId;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.caches.CacheEntity;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.BuyerEntityMapper;
import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.RentalRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;

@Service
public class RentalService {
    
    private final ItemCheckService itemCheckService;
    private final RentalRepository rentalRepository;
    private final BuyerEntityMapper buyerEntityMapper;
    private final ItemRepository itemRepository;

    RentalService(ItemCheckService itemCheckService, RentalRepository rentalRepository, BuyerEntityMapper buyerEntityMapper, ItemRepository itemRepository) {
        this.itemCheckService = itemCheckService;
        this.rentalRepository = rentalRepository;
        this.buyerEntityMapper = buyerEntityMapper;
        this.itemRepository = itemRepository;
    }

    private void validateDates(OffsetDateTime from, OffsetDateTime to) {
        if (!to.isAfter(from)) {
            throw new RuntimeException("Date range is invalid: from-to: " + from.toString() + " " + to.toString());
        }
    }

    public ResponseItemCheck itemCheck(RequestItemCheck request) {
        
        validateDates(request.getRental().getFrom(), request.getRental().getTo());

        UUID token = request.getToken() == null ? UUID.randomUUID() : request.getToken();

        CacheEntity currentCacheEntity = new CacheEntity(request.getRental().getFrom(), request.getRental().getTo(), token);

        return itemCheckService.itemCheck(request.getItems(), currentCacheEntity).timestamp(OffsetDateTime.now()).token(token);
    }

    public ResponseGetId itemShop(RequestItemShop request) {

        validateDates(request.getRental().getFrom(), request.getRental().getTo());
        
        // shop token validation

        var existing = itemCheckService.checkCacheForIdsForSpecificToken(request.getItems(), request.getToken());

        CacheEntity currentCacheEntity = new CacheEntity(request.getRental().getFrom(), request.getRental().getTo(), request.getToken());

        existing.forEach((string, entity) -> {
            if (!entity.equals(currentCacheEntity)) {
                throw new RuntimeException(entity.toString() + ":" + currentCacheEntity.toString());
            }
        });

        Rental rental = new Rental();

        rental.setPaidCurrency(request.getPaid().getPriceCurrency());
        rental.setPaidPrice(request.getPaid().getPriceAmount());
        rental.setRentalStart(request.getRental().getFrom());
        rental.setRentalEnd(request.getRental().getTo());
        rental.setBuyer(buyerEntityMapper.mapEntityToSql(request.getBuyer()));

        List<Item> items = itemRepository.findAllById(request.getItems());

        items.forEach(item -> {
            rental.addItem(item);
        });
        
        var responseRental = rentalRepository.save(rental);

        return new ResponseGetId()
            .timestamp(OffsetDateTime.now())
            .id(responseRental.getId());
    }

    
}
