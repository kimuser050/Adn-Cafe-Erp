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

    // 1. 전체 상품 개수 (검색어 포함)
    @Transactional(readOnly = true)
    public int selectCount(String keyword) {
        return productMapper.selectCount(keyword);
    }

    // 2. 상품 목록 조회 (검색어와 페이징 정보 포함)
    @Transactional(readOnly = true)
    public List<ProductVo> list(PageVo pvo, String keyword) {
        return productMapper.list(pvo, keyword);
    }

    // 3. 상품 상세 조회
    @Transactional(readOnly = true)
    public ProductVo selectOne(String productsNo) {
        return productMapper.selectOne(productsNo);
    }

    // 4. 신규 상품 등록
    public int insert(ProductVo vo) {
        return productMapper.insert(vo);
    }

    // 5. 상품 정보 수정 (이름, 가격, 사용여부 등)
    public int updateByNo(ProductVo vo) {
        return productMapper.updateByNo(vo);
    }


}
