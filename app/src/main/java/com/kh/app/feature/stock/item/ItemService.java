package com.kh.app.feature.stock.item;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ItemService {

    private final ItemMapper itemMapper;
    public List<ItemVo> selectList(ItemVo vo) {
        return itemMapper.selectList(vo);
    }
}
