package com.dawid.poradzinski.school.ski_rent_app.addons.mapper;

import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;

import org.openapitools.model.ItemEntity;
import org.openapitools.model.Pages;
import org.openapitools.model.Price;
import org.openapitools.model.RequestAddItem;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemRefreshParams;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemsParams;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.ItemCategory;

@Service
public class ItemMapper {
    
    public Item mapRequestAddItemToitem(RequestAddItem requestAddItem, ItemCategory itemCategory) {
        Item item = new Item();

        item.setName(requestAddItem.getName());
        item.setCategory(itemCategory);
        item.setPriceAmount(requestAddItem.getPrice().getPriceAmount().setScale(2, RoundingMode.HALF_UP));
        item.setPriceCurrency(requestAddItem.getPrice().getPriceCurrency());
        item.setSize(requestAddItem.getSize());
        item.setPlace(requestAddItem.getPlace());
        item.setLastMaintenance(OffsetDateTime.now());

        return item;
    }

    public ItemEntity mapItemToItemEntity(Item item) {
        ItemEntity itemEntity = new ItemEntity();

        itemEntity.setAddDate(item.getAddDate());
        itemEntity.setCategory(item.getCategory().getCategory());
        itemEntity.setDamaged(item.getDamaged());
        itemEntity.setImage(item.getImage());
        itemEntity.setId(item.getId());
        itemEntity.setLastMaintenance(item.getLastMaintenance());
        itemEntity.setName(item.getName());
        itemEntity.setPrice(new Price().priceAmount(item.getPriceAmount().setScale(2, RoundingMode.HALF_UP)).priceCurrency(item.getPriceCurrency()));
        itemEntity.setSize(item.getSize());
        itemEntity.setPlace(item.getPlace());
        
        return itemEntity;
    }

    public List<ItemEntity> mapItemsToListItemEntity(List<Item> items) {
        return items.stream().map(this::mapItemToItemEntity).toList();
    }

    public Pages mapItemsToPages(Page<Item> page, GetItemsParams getItemsParams) {
        Pages pages = new Pages();

        pages.setCurrentPage(getItemsParams.getPage());
        pages.setCurrentSize(getItemsParams.getSize());
        pages.setNumberOfPages(page.getTotalPages());

        return pages;
    }

    public Pages mapItemsToPages(Page<Item> page, GetItemRefreshParams getItemsParams) {
        Pages pages = new Pages();

        pages.setCurrentPage(getItemsParams.getPage());
        pages.setCurrentSize(getItemsParams.getSize());
        pages.setNumberOfPages(page.getTotalPages());

        return pages;
    }
}
