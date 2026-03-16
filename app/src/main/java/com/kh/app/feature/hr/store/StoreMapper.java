package com.kh.app.feature.hr.store;

import com.kh.app.feature.hr.dept.DeptVo;
import com.kh.app.feature.user.member.MemberVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

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
                , ST.STATUS_NAME
                , S.OWNER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , S.STORE_NAME
                , S.STORE_ADDRESS
                , TO_CHAR(S.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(S.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM STORE S
            LEFT JOIN MEMBER M
                ON S.OWNER_EMP_NO = M.EMP_NO
            LEFT JOIN STORE_STATUS ST
                ON S.STATUS_CODE = ST.STATUS_CODE
            ORDER BY S.CREATED_AT ASC
            """)
    List<StoreVo> selectList();

    @Select("""
        SELECT
           S.STORE_CODE
                , S.STATUS_CODE
                , ST.STATUS_NAME
                , S.OWNER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , S.STORE_NAME
                , S.STORE_ADDRESS
                , TO_CHAR(S.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(S.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM STORE S
            LEFT JOIN MEMBER M
                ON S.OWNER_EMP_NO = M.EMP_NO
            LEFT JOIN STORE_STATUS ST
                ON S.STATUS_CODE = ST.STATUS_CODE
        WHERE STORE_NAME LIKE '%' || #{keyword} || '%'
        ORDER BY S.CREATED_AT ASC
        """)
    List<StoreVo> selectListByName(String keyword);

    @Select("""
        SELECT
          S.STORE_CODE
                , S.STATUS_CODE
                , ST.STATUS_NAME
                , S.OWNER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , S.STORE_NAME
                , S.STORE_ADDRESS
                , TO_CHAR(S.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(S.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM STORE S
            LEFT JOIN MEMBER M
                ON S.OWNER_EMP_NO = M.EMP_NO
            LEFT JOIN STORE_STATUS ST
                ON S.STATUS_CODE = ST.STATUS_CODE
        WHERE ST.STATUS_NAME = #{statusName}
        ORDER BY S.CREATED_AT ASC
        """)
    List<StoreVo> selectListByStatusName(String statusName);



    @Select("""
            SELECT
                S.STORE_CODE
                , S.STATUS_CODE
                , ST.STATUS_NAME
                , S.OWNER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , S.STORE_NAME
                , S.STORE_ADDRESS
                , TO_CHAR(S.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(S.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM STORE S
            LEFT JOIN MEMBER M
                ON S.OWNER_EMP_NO = M.EMP_NO
            LEFT JOIN STORE_STATUS ST
                ON S.STATUS_CODE = ST.STATUS_CODE
            WHERE S.STORE_CODE = #{storeCode}
            """)
    StoreVo selectDetail(String storeCode);

    @Select("""
        SELECT EMP_NO , EMP_NAME
        FROM MEMBER
        WHERE POS_CODE = '100011'
        AND QUIT_YN = 'N'
        """)
    List<MemberVo> selectManagerList();

    @Update("""
            UPDATE STORE
            SET STATUS_CODE = #{statusCode}
                , UPDATED_AT = SYSTIMESTAMP
            WHERE STORE_CODE = #{storeCode}
            """)
    int updateStatus(@Param("storeCode") String storeCode,
                     @Param("statusCode") int statusCode);

    @Update("""
        UPDATE STORE
        SET STORE_ADDRESS = #{storeAddress}
            , UPDATED_AT = SYSTIMESTAMP
        WHERE STORE_CODE = #{storeCode}
        """)
    int editAddress(@Param("storeCode") String storeCode,
                    @Param("storeAddress") String storeAddress);

    @Update("""
        UPDATE STORE
        SET OWNER_EMP_NO = #{ownerEmpNo}
            , UPDATED_AT = SYSTIMESTAMP
        WHERE STORE_CODE = #{storeCode}
        """)
    int editManager(@Param("storeCode") String storeCode,
                    @Param("ownerEmpNo") String ownerEmpNo);
}