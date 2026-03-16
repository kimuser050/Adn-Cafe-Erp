package com.kh.app.feature.stock.item;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface ItemMapper {

//등록
    @Insert("""
        INSERT INTO ITEM
        (
         ITEM_NAME
         ,UNIT_PRICE
         ,LOCATION
        )
        VALUES
        (
         #{itemName}
         ,#{unitPrice}
         ,#{location}
        )
        """)
    int insert(ItemVo vo);


    @Select("""
            SELECT COUNT(ITEM_NO)
            FROM ITEM
            WHERE ACTIVE_YN = 'Y'
            """)
    int selectCount();
//조회
    @Select("""
            SELECT
                ITEM_NO
               ,ITEM_NAME
               ,UNIT_PRICE
               ,STOCK
               ,LOCATION
               ,ACTIVE_YN
               ,CREATED_AT
               ,UPDATED_AT
               ,ORDER_DATE
            FROM ITEM
            WHERE ACTIVE_YN = 'Y'
            ORDER BY ITEM_NO DESC
            OFFSET #{offset} ROWS
            FETCH NEXT #{boardLimit} ROWS ONLY
            """)
    List<ItemVo> selectList(PageVo pvo);

 //상세조회
    @Select("""
            SELECT
                ITEM_NO
                ,ITEM_NAME
                ,UNIT_PRICE
                ,STOCK
                ,LOCATION
                ,ACTIVE_YN
                ,CREATED_AT
                ,UPDATED_AT
                ,ORDER_DATE
            FROM ITEM
            WHERE ITEM_NO = #{itemNo}
            AND ACTIVE_YN = 'Y'
        """)
    ItemVo selectOne(String itemNo);

    //삭제
    @Update("""
        UPDATE ITEM
        SET
            ACTIVE_YN = 'N'
           ,UPDATED_AT = SYSDATE
        WHERE ITEM_NO = #{itemNo}
    """)
    int deleteByNo(ItemVo vo);

    //수정
    @Update("""
        UPDATE ITEM
        SET
            ITEM_NAME = #{itemName}
            , UNIT_PRICE = #{unitPrice}
            , STOCK = #{stock}
            , LOCATION = #{location}
            , UPDATED_AT = SYSDATE
        WHERE ITEM_NO = #{itemNo}
    """)
    int updateByNo(ItemVo vo);


}
