package com.dawid.poradzinski.school.ski_rent_app.addons.mapper;

import java.util.List;

import org.openapitools.model.FullRentalEntity;
import org.openapitools.model.Price;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem;

@Service
public class RentalMapper {

    private final BuyerEntityMapper buyerEntityMapper;
    private final ItemMapper itemMapper;

    RentalMapper(BuyerEntityMapper buyerEntityMapper,
                ItemMapper itemMapper) {
        this.buyerEntityMapper = buyerEntityMapper;
        this.itemMapper = itemMapper;
    }
    
    public FullRentalEntity mapRentalToFullRentalEntity(Rental rental) {
        FullRentalEntity entity = new FullRentalEntity();
        entity.setBuyer(buyerEntityMapper.mapSqlToEntity(rental.getBuyer()));
        entity.setId(rental.getId());
        entity.setItems(itemMapper.mapItemsToListItemEntity(mapRentalItemToItem(rental.getItems())));
        entity.setOpen(rental.getOpen());
        entity.setPrice(new Price().priceAmount(rental.getPrice()).priceCurrency(rental.getPriceCurrency()));
        entity.setPaidPrice(new Price().priceAmount(rental.getPaidPrice()).priceCurrency(rental.getPaidCurrency()));
        entity.setRentalDate(rental.getRental_date());
        return entity;
    }

    private List<Item> mapRentalItemToItem(List<RentalItem> rentalItems) {
        return rentalItems.stream().map(rentalItem -> rentalItem.getItem()).toList();
    }
}
