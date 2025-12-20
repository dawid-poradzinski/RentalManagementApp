package com.dawid.poradzinski.school.ski_rent_app.service;

import java.time.LocalDate;
import java.util.Optional;

import org.openapitools.model.RequestAddItem;
import org.openapitools.model.ResponseGetId;
import org.openapitools.model.ResponseGetMultipleItems;
import org.openapitools.model.ResponseGetSingleItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.specifications.ItemSpecification;
import com.dawid.poradzinski.school.ski_rent_app.exceptions.exceptions.NotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.mapper.ItemCategoryMapper;
import com.dawid.poradzinski.school.ski_rent_app.mapper.ItemMapper;
import com.dawid.poradzinski.school.ski_rent_app.params.GetItemsParams;
import com.dawid.poradzinski.school.ski_rent_app.repository.ItemCategoryRepository;
import com.dawid.poradzinski.school.ski_rent_app.sql.Item;
import com.dawid.poradzinski.school.ski_rent_app.sql.ItemCategory;

@Service
public class ItemService {
    
    private ItemRepository itemRepository;
    private ItemCategoryRepository itemCategoryRepository;
    private ItemCategoryMapper itemCategoryMapper;
    private ItemMapper itemMapper;

    ItemService(ItemRepository itemRepository,
                ItemCategoryRepository itemCategoryRepository,
                ItemCategoryMapper itemCategoryMapper,
                ItemMapper itemMapper) {
        this.itemRepository = itemRepository;
        this.itemCategoryRepository = itemCategoryRepository;
        this.itemCategoryMapper = itemCategoryMapper;
        this.itemMapper = itemMapper;
    }

    public ResponseGetId addItem(RequestAddItem requestItem) {
        
        String requestedCategory = requestItem.getCategory();

        ItemCategory categoryInDb = itemCategoryRepository.findByCategory(requestedCategory).orElse(null);

        if (categoryInDb == null) {
            categoryInDb = itemCategoryRepository.save(itemCategoryMapper.mapCategoryToItemCategory(requestedCategory));
        }

        Item newItem = itemRepository.save(itemMapper.mapRequestAddItemToitem(requestItem, categoryInDb));

        return new ResponseGetId(LocalDate.now(), newItem.getId());
    }

    public ResponseGetMultipleItems getItems(GetItemsParams getItemsParams) {

        var page = PageRequest.of(getItemsParams.getPage(), getItemsParams.getSize());

        Page<Item> items = itemRepository.findAll(ItemSpecification.filter(getItemsParams), page);

        return new ResponseGetMultipleItems(LocalDate.now(), itemMapper.mapItemsToListItemEntity(items.toList()), itemMapper.mapItemsToPages(items, getItemsParams));
        
    }

    public ResponseGetSingleItem getItem(Long id) throws NotFoundException {
        
        Optional<Item> item = itemRepository.findById(id);

        return new ResponseGetSingleItem(LocalDate.now(), itemMapper.mapItemToItemEntity(item.get()));

    }

    public ResponseGetId deleteItem(Long id) throws NotFoundException {
        Item item = itemRepository.findById(id).get();

        itemRepository.delete(item);

        return new ResponseGetId(LocalDate.now(), id);
    }
}
