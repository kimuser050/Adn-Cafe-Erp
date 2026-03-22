package com.kh.app.feature.hr.store;

import com.kh.app.feature.hr.dept.DeptVo;
import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

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
        SELECT COUNT(*)
        FROM STORE
        """)
    int selectCount();

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
        OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
        """)
    List<StoreVo> selectListByPage(@Param("pvo") PageVo pvo);


    @Select("""
        SELECT COUNT(*)
        FROM STORE
        WHERE STORE_NAME LIKE '%' || #{keyword} || '%'
        """)
    int selectCountByName(@Param("keyword") String keyword);

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
        WHERE S.STORE_NAME LIKE '%' || #{keyword} || '%'
        ORDER BY S.CREATED_AT ASC
        OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
        """)
    List<StoreVo> selectListByNameByPage(@Param("keyword") String keyword,
                                         @Param("pvo") PageVo pvo);

    @Select("""
    SELECT COUNT(*)
    FROM STORE S
    LEFT JOIN STORE_STATUS ST
        ON S.STATUS_CODE = ST.STATUS_CODE
    WHERE TRIM(ST.STATUS_NAME) LIKE '%' || TRIM(#{statusName}) || '%'
    """)
    int selectCountByStatusName(@Param("statusName") String statusName);

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
    WHERE TRIM(ST.STATUS_NAME) LIKE '%' || TRIM(#{statusName}) || '%'
    ORDER BY S.CREATED_AT ASC
    OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
    """)
    List<StoreVo> selectListByStatusNameByPage(
            @Param("statusName") String statusName,
            @Param("pvo") PageVo pvo
    );



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
        SELECT 
        EMP_NO 
        , EMP_NAME
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


    //수정 왜 두개로 나눠놓은거지? 합칠수있다면 합치자
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


    @Select("""
        SELECT
            COUNT(*) AS totalCount
            , SUM(CASE WHEN STATUS_CODE = 1 THEN 1 ELSE 0 END) AS enableCount
            , SUM(CASE WHEN STATUS_CODE = 2 THEN 1 ELSE 0 END) AS restCount
            , SUM(CASE WHEN STATUS_CODE = 3 THEN 1 ELSE 0 END) AS disableCount
        FROM STORE
        """)
    Map<String, Object> selectSummary();

    @Select("""
        SELECT
            COUNT(*) AS totalCount
            , SUM(CASE WHEN STATUS_CODE = 1 THEN 1 ELSE 0 END) AS enableCount
            , SUM(CASE WHEN STATUS_CODE = 2 THEN 1 ELSE 0 END) AS restCount
            , SUM(CASE WHEN STATUS_CODE = 3 THEN 1 ELSE 0 END) AS disableCount
        FROM STORE
        WHERE STORE_NAME LIKE '%' || #{keyword} || '%'
        """)
    Map<String, Object> selectSummaryByName(@Param("keyword") String keyword);

    @Select("""
    SELECT
        COUNT(*) AS totalCount
        , SUM(CASE WHEN S.STATUS_CODE = 1 THEN 1 ELSE 0 END) AS enableCount
        , SUM(CASE WHEN S.STATUS_CODE = 2 THEN 1 ELSE 0 END) AS restCount
        , SUM(CASE WHEN S.STATUS_CODE = 3 THEN 1 ELSE 0 END) AS disableCount
    FROM STORE S
    LEFT JOIN STORE_STATUS ST
        ON S.STATUS_CODE = ST.STATUS_CODE
    WHERE TRIM(ST.STATUS_NAME) LIKE '%' || TRIM(#{statusName}) || '%'
    """)
    Map<String, Object> selectSummaryByStatusName(@Param("statusName") String statusName);
}


