package com.kh.app.feature.hr.store;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface StoreMapper {

    @Insert("""
            INSERT INTO STORE
            (
            STORE_CODE
            , STORE_NAME
            , STORE_ADDRESS
            )
            VALUES
            (
            #{storeCode}
            , #{storeName}
            , #{storeAddress}
            )
            """)
    int insert(StoreVo vo);


    @Select("""
            SELECT
                S.STORE_CODE
                , S.STATUS_CODE
                , S.OWNER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , S.STORE_NAME
                , S.STORE_ADDRESS
                , TO_CHAR(S.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(S.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM STORE S
            LEFT JOIN MEMBER M
                ON S.OWNER_EMP_NO = M.EMP_NO
            ORDER BY S.CREATED_AT ASC
            """)
    List<StoreVo> selectList();



}
