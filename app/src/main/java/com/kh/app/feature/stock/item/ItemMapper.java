package com.kh.app.feature.stock.item;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

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
            WHERE ITEM_NAME LIKE '%' || #{keyword} || '%'
            """)
    int selectCount(String keyword);
//조회
@Select("""
        <script>
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
        <where>
            <if test="keyword != null and keyword != ''">
                AND ITEM_NAME LIKE '%' || #{keyword} || '%'
            </if>
        </where>
        ORDER BY ITEM_NO DESC
        OFFSET #{pvo.offset} ROWS
        FETCH NEXT #{pvo.boardLimit} ROWS ONLY
        </script>
        """)
// @Param을 붙여서 이름을 명시해줘야 MyBatis가 찾을 수 있습니다.
List<ItemVo> selectList(@Param("pvo") PageVo pvo, @Param("keyword") String keyword);

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
            , ACTIVE_YN = #{activeYn}
            , UPDATED_AT = SYSDATE
        WHERE ITEM_NO = #{itemNo}
    """)
    int updateByNo(ItemVo vo);



}
