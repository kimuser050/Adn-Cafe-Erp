package com.kh.app.feature.stock.request;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

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
}
