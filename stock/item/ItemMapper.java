package com.kh.app.feature.stock.item;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ItemMapper {

    /**
     * 1. 품목 등록
     * 테이블에 DEFAULT SEQ_ITEM.NEXTVAL이 설정되어 있으므로 ITEM_NO 컬럼은 생략합니다.
     * @SelectKey에서도 DB 이름과 똑같이 SEQ_ITEM을 사용해야 합니다.
     */
    @Insert("""
        INSERT INTO ITEM (
            ITEM_NAME,
            UNIT_PRICE,
            STOCK,
            LOCATION,
            ACTIVE_YN,
            CREATED_AT
        ) VALUES (
            #{itemName},
            #{unitPrice},
            #{stock},
            #{location},
            'Y',
            SYSDATE
        )
        """)
    @SelectKey(statement = "SELECT SEQ_ITEM.CURRVAL FROM DUAL",
            keyProperty = "itemNo",
            before = false,
            resultType = String.class)
    int insert(ItemVo vo);

    /**
     * 2. 검색 결과 개수 조회
     */
    @Select("""
        <script>
        SELECT COUNT(ITEM_NO)
        FROM ITEM
        <where>
            <if test="keyword != null and keyword != ''">
                AND ITEM_NAME LIKE '%' || #{keyword} || '%'
            </if>
        </where>
        </script>
        """)
    int selectCount(@Param("keyword") String keyword);

    /**
     * 3. 목록 조회 (페이징 + 검색)
     */
    @Select("""
        <script>
        SELECT
            ITEM_NO,
            ITEM_NAME,
            UNIT_PRICE,
            STOCK,
            LOCATION,
            ACTIVE_YN,
            TO_CHAR(CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT,
            TO_CHAR(UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
        FROM ITEM
        <where>
            <if test="keyword != null and keyword != ''">
                AND ITEM_NAME LIKE '%' || #{keyword} || '%'
            </if>
        </where>
        ORDER BY ITEM_NO DESC
        OFFSET ((#{pvo.currentPage} - 1) * #{pvo.boardLimit}) ROWS
        FETCH NEXT #{pvo.boardLimit} ROWS ONLY
        </script>
        """)
    List<ItemVo> selectList(@Param("pvo") PageVo pvo, @Param("keyword") String keyword);

    /**
     * 4. 상세 조회
     */
    @Select("""
        SELECT
            ITEM_NO,
            ITEM_NAME,
            UNIT_PRICE,
            STOCK,
            LOCATION,
            ACTIVE_YN,
            CREATED_AT,
            UPDATED_AT
        FROM ITEM
        WHERE ITEM_NO = #{itemNo}
        """)
    ItemVo selectOne(String itemNo);

    /**
     * 5. 삭제 (논리 삭제 - 상태값 변경)
     */
    @Update("""
        UPDATE ITEM
        SET
            ACTIVE_YN = 'N',
            UPDATED_AT = SYSDATE
        WHERE ITEM_NO = #{itemNo}
        """)
    int deleteByNo(ItemVo vo);

    /**
     * 6. 수정
     */
    @Update("""
        UPDATE ITEM
        SET
            ITEM_NAME = #{itemName},
            UNIT_PRICE = #{unitPrice},
            STOCK = #{stock},
            LOCATION = #{location},
            ACTIVE_YN = #{activeYn},
            UPDATED_AT = SYSDATE
        WHERE ITEM_NO = #{itemNo}
        """)
    int updateByNo(ItemVo vo);
}