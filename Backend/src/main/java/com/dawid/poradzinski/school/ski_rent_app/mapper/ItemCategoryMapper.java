package com.dawid.poradzinski.school.ski_rent_app.mapper;

import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.sql.ItemCategory;

@Service
public class ItemCategoryMapper {
    
    public ItemCategory mapCategoryToItemCategory(String category) {
        ItemCategory itemCategory = new ItemCategory();
        itemCategory.setCategory(category);
        return itemCategory;
    }

    public String mapItemCategoryToCategory(ItemCategory itemCategory) {
        return itemCategory.getCategory();
    }
}
