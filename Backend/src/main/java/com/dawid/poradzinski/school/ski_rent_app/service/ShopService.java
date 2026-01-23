package com.dawid.poradzinski.school.ski_rent_app.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.openapitools.model.BuyerEntity;
import org.openapitools.model.PlacesEnum;
import org.openapitools.model.RequestItemCheck;
import org.openapitools.model.RequestItemShop;
import org.openapitools.model.ResponseGetId;
import org.openapitools.model.ResponseGetMultipleItems;
import org.openapitools.model.ResponseItemCheck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.caches.CacheEntity;
import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.MultiplePlacesInShop;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.BuyerEntityMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.ItemMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemRefreshParams;
import com.dawid.poradzinski.school.ski_rent_app.addons.specifications.Item.ItemRefreshSpecification;
import com.dawid.poradzinski.school.ski_rent_app.controller.UserContextService;
import com.dawid.poradzinski.school.ski_rent_app.repository.BuyerRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.PersonRepository;
import com.dawid.poradzinski.school.ski_rent_app.repository.RentalRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.Person;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;

@Service
public class ShopService {

    
    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;
    private final ItemCheckService itemCheckService;
    private final BuyerEntityMapper buyerEntityMapper;
    private final BuyerRepository buyerRepository;
    private final RentalRepository rentalRepository;
    private final PersonRepository personRepository;
    private final UserContextService userContextService;


    ShopService(ItemMapper itemMapper,ItemRepository itemRepository, ItemCheckService itemCheckService, BuyerEntityMapper buyerEntityMapper, BuyerRepository buyerRepository, RentalRepository rentalRepository, PersonRepository personRepository, UserContextService userContextService) {
        this.itemMapper = itemMapper;
        this.itemRepository = itemRepository;
        this.itemCheckService = itemCheckService;
        this.buyerEntityMapper = buyerEntityMapper;
        this.buyerRepository = buyerRepository;
        this.rentalRepository = rentalRepository;
        this.personRepository = personRepository;
        this.userContextService = userContextService;
    }

    private void validateDates(OffsetDateTime from, OffsetDateTime to) {
        if (!to.isAfter(from)) {
            throw new RuntimeException("Date range is invalid: from-to: " + from.toString() + " " + to.toString());
        }
    }

    private BigDecimal calculatePriceWithDiscount(OffsetDateTime from, OffsetDateTime to) {

        double minutes = Duration.between(from, to).toMinutes();
        double numberOfHalfOfHours  = Math.ceil(minutes / 30L);
        double discount = numberOfHalfOfHours < 8 ? 1 : numberOfHalfOfHours < 24 ? 0.45 : 0.15;
        return BigDecimal.valueOf(numberOfHalfOfHours*discount).setScale(2, RoundingMode.HALF_UP);
    }

    public ResponseGetMultipleItems getItemRefresh(GetItemRefreshParams params) {
        
        validateDates(params.getFrom(), params.getTo());
        
        var page = PageRequest.of(params.getPage(), params.getSize(), Sort.by("addDate").descending());

        BigDecimal priceModifier = calculatePriceWithDiscount(params.getFrom(), params.getTo());

        Page<Item> items = itemRepository.findAll(ItemRefreshSpecification.filter(params), page);

        items.stream().peek(item -> {
            item.setPriceAmount(item.getPriceAmount().multiply(priceModifier));
        }).collect(Collectors.toList());

        return new ResponseGetMultipleItems()
                .timestamp(OffsetDateTime.now())
                .items(itemMapper.mapItemsToListItemEntity(items.toList()))
                .pages(itemMapper.mapItemsToPages(items, params)); 
    }

    public ResponseItemCheck itemCheck(RequestItemCheck request) {
        
        validateDates(request.getRental().getFrom(), request.getRental().getTo());

        UUID token = request.getToken() == null ? UUID.randomUUID() : request.getToken();

        CacheEntity currentCacheEntity = new CacheEntity(request.getRental().getFrom(), request.getRental().getTo(), token);

        BigDecimal priceModifier = calculatePriceWithDiscount(request.getRental().getFrom(), request.getRental().getTo());

        return itemCheckService.itemCheck(request.getItems(), currentCacheEntity, priceModifier).timestamp(OffsetDateTime.now()).token(token);
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

        BigDecimal priceModifier = calculatePriceWithDiscount(request.getRental().getFrom(), request.getRental().getTo());

        BigDecimal totalPrice = items.stream().map(Item::getPriceAmount).reduce(BigDecimal.ZERO, BigDecimal::add).multiply(priceModifier);

        if (request.getPaid().getPriceAmount().compareTo(totalPrice) >= 0) {
            throw new RuntimeException("Cannot pay more than items are worth:Payed more than items are worth!");
        }

        Rental rental = new Rental();

        items.forEach(item -> {
            rental.addItem(item, priceModifier);
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
}
