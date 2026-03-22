package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

import java.util.List;


@Mapper
public interface OderReqMapper {

   /* ==========================================
       1. 발주 신청 (ITEM 테이블 기준)
       ========================================== */

    // [발주 신청] 품목 전체 개수 조회
    @Select("SELECT COUNT(*) FROM ITEM WHERE ITEM_NAME LIKE '%' || #{keyword} || '%'")
    int selectCount(@Param("keyword") String keyword);

    // [발주 신청] 품목 리스트 조회 (사번으로 매장 관리자 여부 확인하여 매장명 매칭)
    @Select("""
    SELECT 
        I.ITEM_NO, 
        I.ITEM_NAME, 
        I.UNIT_PRICE, 
        I.LOCATION,
        NVL((SELECT STORE_NAME FROM STORE WHERE OWNER_EMP_NO = #{empNo}), '본사') AS STORE_NAME
    FROM ITEM I
    WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
    ORDER BY I.ITEM_NO DESC
    OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
    """)
    List<OderReqVo> selectList(@Param("pvo") PageVo pvo, @Param("keyword") String keyword, @Param("empNo") String empNo);

    /**
     * [발주 실행] 실제 주문 저장
     * 수정 포인트: #{storeCode}에 부서번호(310104)가 들어오더라도,
     * 해당 사번이 관리하는 '진짜 매장코드(200115)'를 서브쿼리로 찾아와서 저장합니다.
     */
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
                /* 만약 storeCode가 부서코드라면, STORE 테이블에서 사번으로 진짜 코드를 조회해 넣음 */
                NVL((SELECT STORE_CODE FROM STORE WHERE OWNER_EMP_NO = #{empNo}), #{storeCode}), 
                'W', 
                SYSDATE
            )
            """)
    int insertOrder(OderReqVo vo);


    /* ==========================================
       2. 발주 상태/이력 (ORDER_REQ 테이블 기준)
       ========================================== */

    @Select("""
            SELECT COUNT(*) 
            FROM ORDER_REQ O
            JOIN ITEM I ON O.ITEM_NO = I.ITEM_NO
            WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
            """)
    int selectHistoryCount(@Param("keyword") String keyword);

    // [발주 상태] 발주 이력 목록 조회
    // [발주 상태] 발주 이력 목록 조회
    @Select("""
            SELECT 
                O.ORDER_NO, 
                I.ITEM_NAME, 
                O.STORE_CODE, 
                NVL(
                    (SELECT STORE_NAME FROM STORE S WHERE TRIM(S.STORE_CODE) = TRIM(O.STORE_CODE)),
                    NVL((SELECT DEPT_NAME FROM DEPT D WHERE TRIM(D.DEPT_CODE) = TRIM(O.STORE_CODE)), '본사')
                ) AS STORE_NAME,
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
                O.STORE_CODE,
                NVL(
                    (SELECT STORE_NAME FROM STORE S WHERE TRIM(S.STORE_CODE) = TRIM(O.STORE_CODE)),
                    '본사'
                ) AS STORE_NAME
            FROM ITEM I
            JOIN ORDER_REQ O ON I.ITEM_NO = O.ITEM_NO
            WHERE O.ORDER_NO = #{orderNo}
            """)
    OderReqVo selectOne(@Param("orderNo") String orderNo);

    @Update("""
            UPDATE ORDER_REQ
            SET STATUS = #{status}, REQUEST_DATE = SYSDATE 
            WHERE ORDER_NO = #{orderNo}
            """)
    int updateByNo(OderReqVo vo);

    @Update("""
            UPDATE ITEM 
            SET STOCK = STOCK - (SELECT QUANTITY FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
            WHERE ITEM_NO = (SELECT ITEM_NO FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
              AND STOCK >= (SELECT QUANTITY FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
            """)
    int decreaseStock(@Param("orderNo") String orderNo);
}