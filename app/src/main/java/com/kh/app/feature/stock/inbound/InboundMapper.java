package com.kh.app.feature.stock.inbound;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface InboundMapper {

    /**
     * 입고 내역 총 개수 조회 (검색 조건 포함)
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
     * 입고 내역 목록 조회 (검색 + 페이징)
     * PageVo의 필드명 의존성을 없애기 위해 직접 계산 로직 적용
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