package com.dawid.poradzinski.school.ski_rent_app.service;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.openapitools.model.BuyerEntity;
import org.openapitools.model.FullRentalEntity;
import org.openapitools.model.PlacesEnum;
import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.RequestItemShop;
import org.openapitools.model.ResponseGetId;
import org.openapitools.model.ResponseGetMultipleRentals;
import org.openapitools.model.ResponseGetSingleRental;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.RentalWithPriceDto;
import com.dawid.poradzinski.school.ski_rent_app.addons.caches.CacheEntity;
import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.MultiplePlacesInShop;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.BuyerEntityMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.RentalMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetRentalsParams;
import com.dawid.poradzinski.school.ski_rent_app.controller.UserContextService;
import com.dawid.poradzinski.school.ski_rent_app.repository.BuyerRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.PersonRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.RentalRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.Person;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem;

@Service
public class RentalService {

    private final RentalMapper rentalMapper;
    private final ItemCheckService itemCheckService;
    private final RentalRepository rentalRepository;
    private final BuyerEntityMapper buyerEntityMapper;
    private final ItemRepository itemRepository;
    private final UserContextService userContextService;
    private final BuyerRepository buyerRepository;
    private final PersonRepository personRepository;

    RentalService(ItemCheckService itemCheckService, RentalRepository rentalRepository, BuyerEntityMapper buyerEntityMapper, ItemRepository itemRepository, RentalMapper rentalMapper, UserContextService userContextService, BuyerRepository buyerRepository, PersonRepository personRepository) {
        this.itemCheckService = itemCheckService;
        this.rentalRepository = rentalRepository;
        this.buyerEntityMapper = buyerEntityMapper;
        this.itemRepository = itemRepository;
        this.rentalMapper = rentalMapper;
        this.userContextService = userContextService;
        this.buyerRepository = buyerRepository;
        this.personRepository = personRepository;
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

        List<Item> items = itemRepository.findAllById(request.getItems());

        Set<PlacesEnum> places = items.stream().map(Item::getPlace).collect(Collectors.toSet());

        if (places.size() != 1) {
            throw new MultiplePlacesInShop("Multiple places of items while you can rent for only one place per shop!:" + places.toString());
        }

        Rental rental = new Rental();

        items.forEach(item -> {
            rental.addItem(item);
        });

        Long personId = userContextService.getCurrentPersonId();
        Person person = personRepository.findById(personId).orElseThrow(() -> new RuntimeException("Person not found"));
        BuyerEntity buyerEntity = request.getBuyer();
        if (buyerEntity == null) {
            buyerEntity = buyerEntityMapper.mapPersonToBuyerEntity(person);
        }
        buyerEntity.setPersonId(personId);
        var existingBuyerEntity = buyerRepository.findByPhoneAndNameAndSurnameAndPerson_Id(buyerEntity.getPhone(), buyerEntity.getName(), buyerEntity.getSurname(), buyerEntity.getPersonId());

        if (existingBuyerEntity.isPresent()) {
            rental.setBuyer(existingBuyerEntity.get());
        } else {
            rental.setBuyer(buyerEntityMapper.mapPersonToSqlBuyerEntity(person));
        }

        rental.setPaidCurrency(request.getPaid().getPriceCurrency());
        rental.setPaidPrice(request.getPaid().getPriceAmount());
        rental.setRentalStart(request.getRental().getFrom());
        rental.setRentalEnd(request.getRental().getTo());
        rental.setPlace(places.iterator().next());
        
        var responseRental = rentalRepository.save(rental);

        return new ResponseGetId()
            .timestamp(OffsetDateTime.now())
            .id(responseRental.getId());
    }

    public ResponseGetMultipleRentals getRentals(GetRentalsParams params) {
        var page = PageRequest.of(params.getPage(), params.getSize(), Sort.by("creationDate").descending());

        Page<RentalWithPriceDto> rentals = rentalRepository.findRentalsWithTotalPrice(params.getPlace(), params.getStatus(), page);

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
                .rental(rentalMapper.mapSqlRentalWithPriceToSmalLRentalEntity(rental, items.stream().map(RentalItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add), items.getFirst().getCurrency()))
                .items(rentalMapper.mapSqlRentalItemsToItemsForRental(items))
                .buyer(buyerEntityMapper.mapSqlBuyerEntityToBuyerEntity(rental.getBuyer())));
    }
}
