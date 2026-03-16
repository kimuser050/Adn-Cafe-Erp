package com.kh.app.feature.stock.Products;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j

public class ProductService {
    private final ProductMapper productMapper;

    @Transactional
    public int selectCount() {
        return productMapper.selectCount();
    }
    @Transactional
    public List<ProductVo> list(PageVo pvo) {
        return productMapper.list(pvo);
    }

    public int insert(ProductVo vo) {
        return productMapper.insert(vo);
    }

    public int updateByNo(ProductVo vo) {
        return productMapper.updateByNo(vo);
    }

    public int deleteByNo(ProductVo vo) {
        return productMapper.deleteByNo(vo);
    }

    public ProductVo selectOne(String productNo) {
        return productMapper.selectOne(productNo);
    }
}
