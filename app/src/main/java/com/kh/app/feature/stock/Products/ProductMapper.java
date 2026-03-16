package com.kh.app.feature.stock.Products;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface ProductMapper {

    // 판매상품 개수
    @Select("""
        SELECT COUNT(*)
        FROM PRODUCTS
        WHERE USE_YN = 'Y'
    """)
    int selectCount();

    // 판매상품 목록
    @Select("""
        SELECT
            PRODUCTS_NO
            , PRODUCTS_NAME
            , SALE_PRICE
            , USE_YN
            , CREATED_AT
            , UPDATED_AT
        FROM PRODUCTS
       WHERE USE_YN = 'Y'
        ORDER BY PRODUCTS_NO DESC
        OFFSET #{offset} ROWS FETCH NEXT #{boardLimit} ROWS ONLY
    """)
    List<ProductVo> list(PageVo pvo);

    // 상품 등록
    @Insert("""
        INSERT INTO PRODUCTS(
            PRODUCTS_NO
            , PRODUCTS_NAME
            , SALE_PRICE
            , USE_YN
            , CREATED_AT
        )
        VALUES(
            SEQ_PRODUCTS.NEXTVAL
            , #{productsName}
            , #{salePrice}
            , 'Y'
            , SYSDATE
        )
    """)
    int insert(ProductVo vo);

    // 상품 수정
    @Update("""
        UPDATE PRODUCTS
        SET
            PRODUCTS_NAME = #{productsName}
            , SALE_PRICE = #{salePrice}
            , UPDATED_AT = SYSDATE
        WHERE PRODUCTS_NO = #{productsNo}
        AND USE_YN = 'Y'
    """)
    int updateByNo(ProductVo vo);

    // 상품 삭제 (소프트 삭제)
    @Update("""
        UPDATE PRODUCTS
        SET
            USE_YN = 'N'
            , UPDATED_AT = SYSDATE
        WHERE PRODUCTS_NO = #{productsNo}
    """)
    int deleteByNo(ProductVo vo);

    // 상품 상세조회
    @Select("""
        SELECT
            PRODUCTS_NO
            , PRODUCTS_NAME
            , SALE_PRICE
            , USE_YN
            , CREATED_AT
            , UPDATED_AT
        FROM PRODUCTS
        WHERE PRODUCTS_NO = #{productNo}
        AND USE_YN = 'Y'
    """)
    ProductVo selectOne(String productNo);
}
