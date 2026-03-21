package com.kh.app.feature.stock.inbound;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface InboundMapper {

    /**
     * 1. 품목 재고 업데이트 (STOCK 컬럼 사용)
     */
    @Update("""
            UPDATE ITEM 
            SET STOCK = STOCK + #{quantity},
                UPDATED_AT = SYSDATE
            WHERE ITEM_NO = #{itemNo}
            """)
    int updateItemStock(@Param("itemNo") String itemNo, @Param("quantity") String quantity);

    /**
     * 2. 입고 이력 남기기
     * 테이블에 DEFAULT SEQ_INBOUND.NEXTVAL이 설정되어 있으므로 IN_NO는 생략합니다.
     * 계산 시 null 방지를 위해 NVL 처리를 추가했습니다.
     */
    @Insert("""
            INSERT INTO INBOUND (
                ITEM_NO, 
                QUANTITY, 
                UNIT_PRICE, 
                TOTAL_PRICE, 
                IN_DATE, 
                REASON, 
                DELETED_YN
            ) VALUES (
                #{itemNo}, 
                #{quantity}, 
                #{unitPrice},
                (NVL(#{quantity}, 0) * NVL(#{unitPrice}, 0)), 
                SYSDATE, 
                #{reason}, 
                'N'
            )
            """)
    int insertInboundLog(InboundVo vo);

    /**
     * 입고 내역 총 개수 조회
     */
    @Select("""
            <script>
            SELECT COUNT(I.IN_NO)
            FROM INBOUND I
            JOIN ITEM T ON I.ITEM_NO = T.ITEM_NO
            WHERE I.DELETED_YN = 'N'
            <if test="keyword != null and keyword != ''">
                AND T.ITEM_NAME LIKE '%' || #{keyword} || '%'
            </if>
            </script>
            """)
    int selectCount(@Param("keyword") String keyword);

    /**
     * 입고 내역 목록 조회
     */
    @Select("""
            <script>
            SELECT 
                I.IN_NO,
                T.ITEM_NAME,
                I.UNIT_PRICE,
                I.QUANTITY,
                I.TOTAL_PRICE,
                TO_CHAR(I.IN_DATE, 'YYYY-MM-DD') AS IN_DATE,
                I.REASON,
                I.DELETED_YN,
                T.LOCATION,
                I.ITEM_NO
            FROM INBOUND I
            JOIN ITEM T ON I.ITEM_NO = T.ITEM_NO
            WHERE I.DELETED_YN = 'N'
            <if test="keyword != null and keyword != ''">
                AND T.ITEM_NAME LIKE '%' || #{keyword} || '%'
            </if>
            ORDER BY I.IN_NO DESC
            OFFSET ((#{pvo.currentPage} - 1) * #{pvo.boardLimit}) ROWS
            FETCH NEXT #{pvo.boardLimit} ROWS ONLY
            </script>
            """)
    List<InboundVo> selectList(@Param("pvo") PageVo pvo, @Param("keyword") String keyword);
}