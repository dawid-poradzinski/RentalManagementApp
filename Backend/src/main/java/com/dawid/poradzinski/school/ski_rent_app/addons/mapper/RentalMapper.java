package com.dawid.poradzinski.school.ski_rent_app.addons.mapper;

import java.math.BigDecimal;
import java.util.List;

import org.openapitools.model.ItemForRental;
import org.openapitools.model.ItemMinimalInfo;
import org.openapitools.model.Pages;
import org.openapitools.model.Price;
import org.openapitools.model.RentalDate;
import org.openapitools.model.SmallRentalEntity;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.RentalWithPriceDto;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetRentalsParams;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.Rental;
import com.dawid.poradzinski.school.ski_rent_app.sql.RentalItem;

@Service
public class RentalMapper {

    private final BuyerEntityMapper buyerEntityMapper;

    RentalMapper(BuyerEntityMapper buyerEntityMapper) {
        this.buyerEntityMapper = buyerEntityMapper;
    }

    public SmallRentalEntity mapSqlRentalWithPriceToSmallRentalEntity(RentalWithPriceDto dto) {
        return new SmallRentalEntity()
            .id(dto.rental().getId())
            .price(new Price()
                .priceAmount(dto.amount())
                .priceCurrency(dto.currency()))
            .rentalStatus(dto.rental().getStatus())
            .rentalPlace(dto.rental().getPlace())
            .rentalDate(new RentalDate()
                .from(dto.rental().getRentalStart())
                .to(dto.rental().getRentalEnd()));
    }

    public List<SmallRentalEntity> mapSqlRentalsWithPriceToSmallRentalEntities(Page<RentalWithPriceDto> dtos) {
        return dtos.stream().map(this::mapSqlRentalWithPriceToSmallRentalEntity).toList();
    }

    public Pages mapRentalsTopages(Page<RentalWithPriceDto> page, GetRentalsParams params) {
        Pages pages = new Pages();

        pages.setCurrentPage(params.getPage());
        pages.setCurrentSize(params.getSize());
        pages.setNumberOfPages(page.getTotalPages());

        return pages;
    }

    public SmallRentalEntity mapSqlRentalWithPriceToSmalLRentalEntity(Rental rental, BigDecimal amount, String currency) {
        return new SmallRentalEntity()
            .id(rental.getId())
            .price(new Price()
                .priceAmount(amount)
                .priceCurrency(currency))
            .rentalDate(new RentalDate()
                .from(rental.getRentalStart())
                .to(rental.getRentalEnd()))
            .rentalPlace(rental.getPlace())
            .rentalStatus(rental.getStatus());
    }

    public ItemMinimalInfo mapSqlItemToItemMinimalInfo(Item item) {
        return new ItemMinimalInfo()
            .id(item.getId())
            .image(item.getImage())
            .name(item.getName());
    }

    public ItemForRental mapSqlRentalItemToItemForRental(RentalItem dto) {
        return new ItemForRental()
            .item(mapSqlItemToItemMinimalInfo(dto.getItem()))
            .price(new Price()
                .priceAmount(dto.getPrice())
                .priceCurrency(dto.getCurrency()));
    }

    public List<ItemForRental> mapSqlRentalItemsToItemsForRental(List<RentalItem> dto) {
        return dto.stream().map(this::mapSqlRentalItemToItemForRental).toList();
    }

}
