package com.kh.app.feature.stock.inbound;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface InboundMapper {
    @Select("""
            SELECT COUNT(IN_NO)
            FROM INBOUND
            """)
    int selectCount();

    //입고내역 조회
    @Select("""
            SELECT 
                I.IN_NO,
                T.ITEM_NAME,      -- JOIN: 상품명
                I.UNIT_PRICE,     -- 입고 단가
                I.QUANTITY,       -- 입고 수량
                I.TOTAL_PRICE,    -- 총 금액
                TO_CHAR(I.IN_DATE, 'YYYY-MM-DD') AS IN_DATE, -- 입고일 포맷팅
                I.REASON,         -- 비고
                I.DELETED_YN,
                T.LOCATION,       -- JOIN: 품목코드 (이미지의 A0001 등)
                I.ITEM_NO
            FROM INBOUND I
            JOIN ITEM T ON I.ITEM_NO = T.ITEM_NO
            WHERE I.DELETED_YN = 'N'
            ORDER BY I.IN_NO DESC
            OFFSET #{offset} ROWS
            FETCH NEXT #{boardLimit} ROWS ONLY
            """)
    List<InboundVo> selectList(PageVo pvo);
}
