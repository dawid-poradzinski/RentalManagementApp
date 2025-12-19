package com.dawid.poradzinski.school.ski_rent_app.mapper;

import java.util.List;

import org.openapitools.model.ItemEntity;
import org.openapitools.model.Pages;
import org.openapitools.model.Price;
import org.openapitools.model.RequestAddItem;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.params.GetItemsParams;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.ItemCategory;

@Service
public class ItemMapper {
    
    public Item mapRequestAddItemToitem(RequestAddItem requestAddItem, ItemCategory itemCategory) {
        Item item = new Item();

        item.setName(requestAddItem.getName());
        item.setCategory(itemCategory);
        item.setPriceAmount(requestAddItem.getPrice().getPriceAmount());
        item.setPriceCurrency(requestAddItem.getPrice().getPriceCurrency());

        return item;
    }

    public ItemEntity mapItemToItemEntity(Item item) {
        ItemEntity itemEntity = new ItemEntity();

        itemEntity.setAddDate(item.getAddDate());
        itemEntity.setCategory(item.getCategory().getCategory());
        itemEntity.setDamaged(item.getDamaged());
        itemEntity.setId(item.getId());
        itemEntity.setLastMaintenance(item.getLastMaintenance());
        itemEntity.setLastRental(item.getLastRental());
        itemEntity.setName(item.getName());
        itemEntity.setPrice(new Price().priceAmount(item.getPriceAmount()).priceCurrency(item.getPriceCurrency()));
        itemEntity.setStatus(item.getStatus());

        return itemEntity;
    }

    public List<ItemEntity> mapItemsToListItemEntityh(List<Item> items) {
        return items.stream().map(this::mapItemToItemEntity).toList();
    }

    public Pages mapItemsToPages(Page<Item> page, GetItemsParams getItemsParams) {
        Pages pages = new Pages();

        pages.setCurrentPage(getItemsParams.getPage());
        pages.setCurrentSize(getItemsParams.getSize());
        pages.setMaxPage(page.getTotalPages());

        return pages;
    }
}
