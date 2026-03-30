package com.kh.app.feature.stock.Products;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProductMapper {
    // 1. 전체 상품 개수 (검색어 조건 추가됨)
    @Select("""
                <script>
                SELECT COUNT(*)
                FROM PRODUCTS
                <where>
                    <if test="keyword != null and keyword != ''">
                        AND PRODUCTS_NAME LIKE '%' || #{keyword} || '%'
                    </if>
                </where>
                </script>
            """)
    int selectCount(@Param("keyword") String keyword);

    // 2. 전체 상품 목록 (Y, N 모두 포함하도록 조건 삭제)
    @Select("""
                <script>
                SELECT
                    PRODUCTS_NO
                    , PRODUCTS_NAME
                    , SALE_PRICE
                    , USE_YN
                    , CREATED_AT
                    , UPDATED_AT
                FROM PRODUCTS
                <where>
                    <if test="keyword != null and keyword != ''">
                        AND PRODUCTS_NAME LIKE '%' || #{keyword} || '%'
                    </if>
                </where>
                ORDER BY PRODUCTS_NO DESC
                OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
                </script>
            """)
    List<ProductVo> list(@Param("pvo") PageVo pvo, @Param("keyword") String keyword);

    // 3. 상품 등록
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

    // 4. 상품 수정
    @Update("""
                UPDATE PRODUCTS
                SET
                    PRODUCTS_NAME = #{productsName}
                    , SALE_PRICE = #{salePrice}
                    , USE_YN = #{useYn}
                    , UPDATED_AT = SYSDATE
                WHERE PRODUCTS_NO = #{productsNo}
            """)
    int updateByNo(ProductVo vo);

    // 5. 상품 상세조회 (상태 조건 삭제 및 타입 체크)
    @Select("""
                SELECT
                    PRODUCTS_NO
                    , PRODUCTS_NAME
                    , SALE_PRICE
                    , USE_YN
                    , CREATED_AT
                    , UPDATED_AT
                FROM PRODUCTS
                WHERE PRODUCTS_NO = #{productsNo}
            """)
    ProductVo selectOne(String productsNo); // String으로 받되 호출 시 숫자인지 확인 필수



}