package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OderReqMapper {
    /* ==========================================
       1. 발주 신청 (ITEM 테이블 기준)
       ========================================== */

    // 품목 전체 개수 조회
    @Select("""
            SELECT COUNT(*) 
            FROM ITEM 
            WHERE ITEM_NAME LIKE '%' || #{keyword} || '%'
            """)
    int selectCount(@Param("keyword") String keyword);

    // 품목 리스트 조회 (페이징) - OFFSET/FETCH 사용
    @Select("""
            SELECT 
                ITEM_NO, ITEM_NAME, UNIT_PRICE, LOCATION 
            FROM ITEM
            WHERE ITEM_NAME LIKE '%' || #{keyword} || '%'
            ORDER BY ITEM_NO DESC
            OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
            """)
    List<OderReqVo> selectList(@Param("pvo") PageVo pvo, @Param("keyword") String keyword);

    // 발주 신청 실행 (단건 인서트)
    // 서비스에서 루프를 돌려 이 메서드를 반복 호출하게 됩니다.
    @Insert("""
            INSERT INTO ORDER_REQ (
                ORDER_NO, ITEM_NO, QUANTITY, STORE_CODE, STATUS, REQUEST_DATE
            ) VALUES (
                SEQ_ORDER_NO.NEXTVAL, #{itemNo}, #{quantity}, #{storeCode}, 'W', SYSDATE
            )
            """)
    int insertOrder(OderReqVo vo);


    /* ==========================================
       2. 발주 상태/이력 (ORDER_REQ 테이블 기준)
       ========================================== */

    // 발주 이력 전체 개수 조회
    @Select("""
            SELECT COUNT(*) 
            FROM ORDER_REQ O
            JOIN ITEM I ON O.ITEM_NO = I.ITEM_NO
            WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
            """)
    int selectHistoryCount(@Param("keyword") String keyword);

    // 발주 이력 목록 조회 (상태값 포함)
    @Select("""
            SELECT 
                O.ORDER_NO,
                I.ITEM_NAME,
                O.STORE_CODE, 
                O.QUANTITY,
                O.STATUS,
                O.REQUEST_DATE
            FROM ORDER_REQ O
            JOIN ITEM I ON O.ITEM_NO = I.ITEM_NO
            WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
            ORDER BY O.ORDER_NO DESC
            OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
            """)
    List<OderReqVo> selectHistory(@Param("pvo") PageVo pvo, @Param("keyword") String keyword);


    /* ==========================================
       3. 상세 조회 및 상태 변경
       ========================================== */

    // 단건 상세 조회 (ITEM + ORDER_REQ 결합)
    @Select("""
            SELECT
                I.ITEM_NO, I.ITEM_NAME, I.UNIT_PRICE, I.LOCATION,
                O.ORDER_NO, O.QUANTITY, O.STATUS, O.REQUEST_DATE
            FROM ITEM I
            LEFT JOIN ORDER_REQ O ON I.ITEM_NO = O.ITEM_NO
            WHERE O.ORDER_NO = #{orderNo}
            """)
    OderReqVo selectOne(String orderNo);

    // 상태값 업데이트 (W: 대기, C: 취소, F: 완료 등)
    @Update("""
            UPDATE ORDER_REQ
            SET STATUS = #{status}, REQUEST_DATE = SYSDATE 
            WHERE ORDER_NO = #{orderNo}
            """)
    int updateByNo(OderReqVo vo);

    // 입고 완료 시 해당 아이템 재고 증가
    @Update("""
    UPDATE ITEM 
    SET STOCK = STOCK - (SELECT QUANTITY FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
    WHERE ITEM_NO = (SELECT ITEM_NO FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
      AND STOCK >= (SELECT QUANTITY FROM ORDER_REQ WHERE ORDER_NO = #{orderNo}) 
    """)
    int decreaseStock(String orderNo);
}
