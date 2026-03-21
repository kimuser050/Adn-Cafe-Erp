package com.kh.app.feature.stock.Return_Req;

import lombok.Data;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ReqMapper {

        // 1. 반품 신청 (PRODUCT_NAME -> PRODUCTS_NO로 변경)
        @Insert("""
        INSERT INTO RETURN_REQ (
            RETURN_NO,
            PRODUCTS_NO,  -- 컬럼명 수정
            STORE_CODE,
            QUANTITY,
            REASON,
            STATUS,
            CREATED_AT
        ) VALUES (
            SEQ_RETURN_REQ.NEXTVAL,
            #{itemNo},    -- ReqVo의 itemNo 필드값을 PRODUCTS_NO 컬럼에 삽입
            #{storeCode},
            #{quantity},
            #{reason},
            'W',
            SYSDATE
        )
    """)
        int reqinsert(ReqVo vo);

        // 2. 반품 목록 조회 (조인 조건 수정)
        @Select("""
        SELECT 
            R.RETURN_NO, 
            I.ITEM_NAME,  
            S.STORE_NAME, 
            R.QUANTITY, 
            R.REASON, 
            R.STATUS, 
            R.CREATED_AT
        FROM RETURN_REQ R
        JOIN STORE S ON R.STORE_CODE = S.STORE_CODE
        -- 조인 조건을 PRODUCTS_NO로 변경
        JOIN ITEM I ON R.PRODUCTS_NO = I.ITEM_NO 
        ORDER BY R.RETURN_NO DESC
    """)
        List<ReqVo> list(ReqVo vo);

        // 3. 상품 목록 드롭다운용 (기존 유지)
        @Select("SELECT ITEM_NO AS itemNo, ITEM_NAME AS itemName FROM ITEM WHERE ACTIVE_YN = 'Y'")
        List<ReqVo> getItemList();

        // 4. 사번으로 매장 '이름' 조회 (기존 유지)
        @Select("SELECT STORE_NAME FROM STORE WHERE OWNER_EMP_NO = #{empNo}")
        String getStoreNameByEmpNo(String empNo);

        // 5. 사번으로 매장 '코드' 조회 (기존 유지)
        @Select("SELECT STORE_CODE FROM STORE WHERE OWNER_EMP_NO = #{empNo}")
        String getStoreCodeByEmpNo(String empNo);
}