package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface OderReqMapper {

    /* [발주 신청] 개수 조회 */
    @Select("SELECT COUNT(*) FROM ITEM WHERE ITEM_NAME LIKE '%' || #{keyword} || '%'")
    int selectCount(@Param("keyword") String keyword);

    /* [발주 신청] 목록 조회 */
    @Select("""
    SELECT 
        I.ITEM_NO, I.ITEM_NAME, I.UNIT_PRICE, I.LOCATION,
        NVL((SELECT STORE_NAME FROM STORE WHERE TO_CHAR(OWNER_EMP_NO) = #{empNo}), '본사') AS STORE_NAME
    FROM ITEM I
    WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
    ORDER BY I.ITEM_NO DESC
    OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
    """)
    List<OderReqVo> selectList(@Param("pvo") PageVo pvo, @Param("keyword") String keyword, @Param("empNo") String empNo);

    /* [발주 실행] 등록 */
    @Insert("""
    INSERT INTO ORDER_REQ (
        ORDER_NO, ITEM_NO, QUANTITY, STORE_CODE, STATUS, REQUEST_DATE
    ) VALUES (
        SEQ_ORDER_REQ.NEXTVAL, #{itemNo}, #{quantity}, 
        /* 사번으로 매장코드를 찾고, 없으면 본사(기본값)로 등록 */
        NVL((SELECT STORE_CODE FROM STORE WHERE TO_CHAR(OWNER_EMP_NO) = #{empNo}), '310103'), 
        'W', SYSDATE
    )
    """)
    int insertOrder(OderReqVo vo);

    /* [발주 상태] 이력 개수 조회 - storeCode 파라미터 제거 */
    @Select("""
    <script>
    SELECT COUNT(*) 
    FROM ORDER_REQ O
    JOIN ITEM I ON O.ITEM_NO = I.ITEM_NO
    WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
      /* 사번으로 매장 관리자 여부 확인 후 필터링 */
      AND (
          NOT EXISTS (SELECT 1 FROM STORE WHERE TO_CHAR(OWNER_EMP_NO) = #{empNo})
          OR 
          TRIM(O.STORE_CODE) = (SELECT TRIM(STORE_CODE) FROM STORE WHERE TO_CHAR(OWNER_EMP_NO) = #{empNo})
      )
    </script>
    """)
    int selectHistoryCount(@Param("keyword") String keyword, @Param("empNo") String empNo);

    /* [발주 상태] 이력 목록 조회 - storeCode 파라미터 제거 */
    @Select("""
    <script>
    SELECT 
        O.ORDER_NO, I.ITEM_NAME, O.STORE_CODE, 
        NVL((SELECT STORE_NAME FROM STORE S WHERE TRIM(S.STORE_CODE) = TRIM(O.STORE_CODE)), '본사') AS STORE_NAME,
        O.QUANTITY, O.STATUS, O.REQUEST_DATE
    FROM ORDER_REQ O
    JOIN ITEM I ON O.ITEM_NO = I.ITEM_NO
    WHERE I.ITEM_NAME LIKE '%' || #{keyword} || '%'
      AND (
          NOT EXISTS (SELECT 1 FROM STORE WHERE TO_CHAR(OWNER_EMP_NO) = #{empNo})
          OR 
          TRIM(O.STORE_CODE) = (SELECT TRIM(STORE_CODE) FROM STORE WHERE TO_CHAR(OWNER_EMP_NO) = #{empNo})
      )
    ORDER BY TO_NUMBER(O.ORDER_NO) DESC
    OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
    </script>
    """)
    List<OderReqVo> selectHistory(@Param("pvo") PageVo pvo, @Param("keyword") String keyword, @Param("empNo") String empNo);

    /* [상세 조회] */
    @Select("""
    SELECT I.ITEM_NO, I.ITEM_NAME, I.UNIT_PRICE, I.LOCATION, O.ORDER_NO, O.QUANTITY, O.STATUS, O.REQUEST_DATE, O.STORE_CODE,
           NVL((SELECT STORE_NAME FROM STORE S WHERE TRIM(S.STORE_CODE) = TRIM(O.STORE_CODE)), '본사') AS STORE_NAME
    FROM ITEM I JOIN ORDER_REQ O ON I.ITEM_NO = O.ITEM_NO
    WHERE O.ORDER_NO = #{orderNo}
    """)
    OderReqVo selectOne(@Param("orderNo") String orderNo);

    /* [상태 변경] */
    @Update("UPDATE ORDER_REQ SET STATUS = #{status}, REQUEST_DATE = SYSDATE WHERE ORDER_NO = #{orderNo}")
    int updateByNo(OderReqVo vo);

    /* [재고 차감] */
    @Update("""
    UPDATE ITEM SET STOCK = STOCK - (SELECT QUANTITY FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
    WHERE ITEM_NO = (SELECT ITEM_NO FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
      AND STOCK >= (SELECT QUANTITY FROM ORDER_REQ WHERE ORDER_NO = #{orderNo})
    """)
    int decreaseStock(@Param("orderNo") String orderNo);
}