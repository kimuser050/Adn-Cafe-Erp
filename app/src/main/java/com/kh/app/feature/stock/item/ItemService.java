package com.kh.app.feature.stock.item;

import com.kh.app.feature.util.PageVo;
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

    public int deleteByNo(ItemVo vo) {
        return itemMapper.deleteByNo(vo);
    }

    public int insert(ItemVo vo) {
        return itemMapper.insert(vo);
    }

    @Transactional
    public int selectCount(String keyword) {
        return itemMapper.selectCount(keyword);
    }
    @Transactional
    public List<ItemVo> selectList(PageVo pvo, String keyword) {
        return itemMapper.selectList(pvo, keyword);
    }


    public ItemVo selectOne(String no) {
        return itemMapper.selectOne(no);
    }

    public int updateByNo(ItemVo vo) {
        System.out.println("service = "+ vo);
        return itemMapper.updateByNo(vo);
    }


}
