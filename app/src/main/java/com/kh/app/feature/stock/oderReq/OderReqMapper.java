package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OderReqMapper {

   /* ==========================================
       1. 발주 신청 (ITEM 테이블 기준)
       ========================================== */

    // [발주 신청] 품목 전체 개수 조회 (삭제되지 않은 품목만)
    @Select("SELECT COUNT(*) FROM ITEM WHERE ITEM_NAME LIKE '%' || #{keyword} || '%'")
    int selectCount(@Param("keyword") String keyword);

    // [발주 신청] 품목 리스트 조회 (페이징)
    // SYSDATE를 요청일로, '미정' 혹은 '본사'를 가상 컬럼으로 넣어 JS 처리를 돕습니다.
    @Select("""
    SELECT 
        I.ITEM_NO, 
        I.ITEM_NAME, 
        I.UNIT_PRICE, 
        I.LOCATION,
        (SELECT STORE_NAME FROM STORE WHERE OWNER_EMP_NO = #{empNo}) AS STORE_NAME
    FROM ITEM I
    WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
    ORDER BY I.ITEM_NO DESC
    OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
    """)
    List<OderReqVo> selectList(@Param("pvo") PageVo pvo, @Param("keyword") String keyword, @Param("empNo") String empNo);
    // [발주 실행] 실제 주문 저장
    @Insert("""
            INSERT INTO ORDER_REQ (
                ORDER_NO, 
                ITEM_NO, 
                QUANTITY, 
                STORE_CODE, 
                STATUS, 
                REQUEST_DATE
            ) VALUES (
                SEQ_ORDER_REQ.NEXTVAL, 
                #{itemNo}, 
                #{quantity}, 
                #{storeCode}, 
                'W', 
                SYSDATE
            )
            """)
    int insertOrder(OderReqVo vo);


    /* ==========================================
       2. 발주 상태/이력 (ORDER_REQ 테이블 기준)
       ========================================== */

    // [발주 상태] 발주 이력 전체 개수 조회
    @Select("""
            SELECT COUNT(*) 
            FROM ORDER_REQ O
            JOIN ITEM I ON O.ITEM_NO = I.ITEM_NO
            WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
            """)
    int selectHistoryCount(@Param("keyword") String keyword);

    // [발주 상태] 발주 이력 목록 조회 (최신순 정렬)
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
            ORDER BY TO_NUMBER(O.ORDER_NO) DESC
            OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
            """)
    List<OderReqVo> selectHistory(@Param("pvo") PageVo pvo, @Param("keyword") String keyword);


    /* ==========================================
       3. 상세 조회 및 상태 변경
       ========================================== */

    // [상세 조회] 단건 상세 조회
    @Select("""
            SELECT
                I.ITEM_NO, 
                I.ITEM_NAME, 
                I.UNIT_PRICE, 
                I.LOCATION,
                O.ORDER_NO, 
                O.QUANTITY, 
                O.STATUS, 
                O.REQUEST_DATE,
                O.STORE_CODE
            FROM ITEM I
            JOIN ORDER_REQ O ON I.ITEM_NO = O.ITEM_NO
            WHERE O.ORDER_NO = #{orderNo}
            """)
    OderReqVo selectOne(@Param("orderNo") String orderNo);

    // [상태 수정] 상태값 업데이트
    @Update("""
            UPDATE ORDER_REQ
            SET STATUS = #{status}, REQUEST_DATE = SYSDATE 
            WHERE ORDER_NO = #{orderNo}
            """)
    int updateByNo(OderReqVo vo);

    // [재고 차감] 상태 'F'(완료) 시 ITEM 테이블 재고 반영
    @Update("""
            UPDATE ITEM 
            SET STOCK = STOCK - (SELECT QUANTITY FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
            WHERE ITEM_NO = (SELECT ITEM_NO FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
              AND STOCK >= (SELECT QUANTITY FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
            """)
    int decreaseStock(@Param("orderNo") String orderNo);
}