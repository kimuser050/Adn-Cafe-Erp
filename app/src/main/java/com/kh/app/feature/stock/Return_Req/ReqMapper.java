package com.kh.app.feature.stock.Return_Req;

import lombok.Data;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ReqMapper {
    // [반품 신청] 기본값이 설정된 컬럼은 제외하고 인서트
    @Insert("""
            INSERT INTO RETURN_REQ (
                PRODUCT_NAME, 
                QUANTITY, 
                REASON, 
                STORE_CODE, 
                STATUS
            ) VALUES (
                #{productName}, 
                #{quantity}, 
                #{reason}, 
                #{storeCode}, 
                NVL(#{status}, 'W')
            )
            """)
    int reqinsert(ReqVo vo);

    // [반품 조회] STORE 테이블과 JOIN하여 매장 이름 가져오기
    @Select("""
            SELECT 
                R.RETURN_NO, 
                R.PRODUCT_NAME, 
                S.STORE_NAME, 
                R.QUANTITY, 
                R.REASON, 
                R.STATUS, 
                R.CREATED_AT
            FROM RETURN_REQ R
            JOIN STORE S ON R.STORE_CODE = S.STORE_CODE
            ORDER BY R.RETURN_NO DESC
            """)
    List<ReqVo> list(ReqVo vo);

}
