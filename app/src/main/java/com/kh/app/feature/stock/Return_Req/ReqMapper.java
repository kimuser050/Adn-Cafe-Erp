package com.kh.app.feature.stock.Return_Req;

import lombok.Data;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ReqMapper {
   @Insert("""
    INSERT INTO RETURN_REQ
            (
                    PRODUCT_NAME
                    , QUANTITY
                    , REASON
                    , STORE_CODE
                    )
    VALUES
            (
            #{productName}
            , #{quantity}
            , #{reason}
            , #{storeCode}
        )
    """)
    int reqinsert(ReqVo vo);

    @Select("""
   SELECT
           RETURN_NO,
           PRODUCT_NAME,
           QUANTITY,
           REASON,
           STATUS,
    TO_CHAR(CREATED_AT, 'YYYY-MM-DD') AS createdAt,
    STORE_CODE
    FROM RETURN_REQ
    ORDER BY RETURN_NO DESC
    """)
    List<ReqVo> list(ReqVo vo);

    @Data
    class ReqVo {
        private String returnNo;
        private String productName;
        private String quantity;
        private String reason;
        private String status;
        private String createdAt;
        private String storeCode;
    }
}
