package com.dawid.poradzinski.school.ski_rent_app.service;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.openapitools.model.RequestAddItem;
import org.openapitools.model.ResponseGetId;
import org.openapitools.model.ResponseGetMultipleItems;
import org.openapitools.model.ResponseGetSingleItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.dawid.poradzinski.school.ski_rent_app.repository.ItemRepository;
import com.dawid.poradzinski.school.ski_rent_app.addons.exceptions.NotFoundException;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.ItemCategoryMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.mapper.ItemMapper;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemRefreshParams;
import com.dawid.poradzinski.school.ski_rent_app.addons.params.GetItemsParams;
import com.dawid.poradzinski.school.ski_rent_app.addons.specifications.Item.BasicItemSpecification;
import com.dawid.poradzinski.school.ski_rent_app.addons.specifications.Item.ItemRefreshSpecification;
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

        return new ResponseGetId().id(newItem.getId()).timestamp(OffsetDateTime.now());
    }

    public ResponseGetMultipleItems getItems(GetItemsParams getItemsParams) {

        var page = PageRequest.of(getItemsParams.getPage(), getItemsParams.getSize());

        Page<Item> items = itemRepository.findAll(BasicItemSpecification.filter(getItemsParams), page);

        return new ResponseGetMultipleItems()
                .timestamp(OffsetDateTime.now())
                .items(itemMapper.mapItemsToListItemEntity(items.toList()))
                .pages(itemMapper.mapItemsToPages(items, getItemsParams)); 
    }

    public ResponseGetSingleItem getItem(Long id) {
        
        Optional<Item> item = itemRepository.findById(id);

        if(item.isEmpty()) {
            throw new NotFoundException("Id in request is invalid:" + id );
        }

        return new ResponseGetSingleItem()
                .timestamp(OffsetDateTime.now())
                .item(itemMapper.mapItemToItemEntity(item.get()));
    }

    public ResponseGetId deleteItem(Long id) {
        Optional<Item> item = itemRepository.findById(id);

        if(item.isEmpty()) {
            throw new NotFoundException("Id in request is invalid:" + id );
        }

        itemRepository.delete(item.get());

        return new ResponseGetId()
                .timestamp(OffsetDateTime.now())
                .id(id);
    }

    public ResponseGetMultipleItems getItemRefresh(GetItemRefreshParams params) {
        
        var page = PageRequest.of(params.getPage(), params.getSize());

        Page<Item> items = itemRepository.findAll(ItemRefreshSpecification.filter(params), page);

        return new ResponseGetMultipleItems()
                .timestamp(OffsetDateTime.now())
                .items(itemMapper.mapItemsToListItemEntity(items.toList()))
                .pages(itemMapper.mapItemsToPages(items, params)); 
    }
}
