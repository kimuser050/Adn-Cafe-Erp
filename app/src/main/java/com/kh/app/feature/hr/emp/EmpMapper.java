package com.kh.app.feature.hr.emp;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface EmpMapper {

    @Select("""
            SELECT
                M.EMP_NO
                , M.EMP_NAME
                , M.POS_CODE
                , P.POS_NAME
                , M.DEPT_CODE
                , D.DEPT_NAME
                , S.STORE_NAME
                , CASE
                    WHEN S.STORE_NAME IS NOT NULL THEN S.STORE_NAME
                    ELSE D.DEPT_NAME
                  END AS ORG_NAME
                , M.RESD_NO
                , M.EMP_PHONE
                , M.EMP_EMAIL
                , M.EMP_ADDRESS
                , M.PROFILE_CHANGE_NAME
                , M.PROFILE_ORIGIN_NAME
                , TO_CHAR(M.HIRE_DATE, 'YYYY-MM-DD') AS HIRE_DATE
                , TO_CHAR(M.RESIGN_DATE, 'YYYY-MM-DD') AS RESIGN_DATE
                , TO_CHAR(M.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(M.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
                , M.QUIT_YN
                , M.EMP_STATUS_NO
            FROM MEMBER M
            LEFT JOIN DEPT D
                ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P
                ON M.POS_CODE = P.POS_CODE
            LEFT JOIN STORE S
                ON S.OWNER_EMP_NO = M.EMP_NO
            ORDER BY M.CREATED_AT ASC
            """)
    List<EmpVo> selectList();




    @Select("""
            SELECT
                M.EMP_NO
                , M.EMP_NAME
                , M.POS_CODE
                , P.POS_NAME
                , M.DEPT_CODE
                , D.DEPT_NAME
                , S.STORE_NAME
                , CASE
                    WHEN S.STORE_NAME IS NOT NULL THEN S.STORE_NAME
                    ELSE D.DEPT_NAME
                  END AS ORG_NAME
                , P.BASE_SALARY
                , P.BONUS_RATE
                , (P.BASE_SALARY + (P.BASE_SALARY * P.BONUS_RATE)) AS EXPECTED_SALARY
                , M.RESD_NO
                , M.EMP_PHONE
                , M.EMP_EMAIL
                , M.EMP_ADDRESS
                , M.PROFILE_CHANGE_NAME
                , M.PROFILE_ORIGIN_NAME
                , TO_CHAR(M.HIRE_DATE, 'YYYY-MM-DD') AS HIRE_DATE
                , TO_CHAR(M.RESIGN_DATE, 'YYYY-MM-DD') AS RESIGN_DATE
                , TO_CHAR(M.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(M.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
                , M.QUIT_YN
                , M.EMP_STATUS_NO
            FROM MEMBER M
            LEFT JOIN DEPT D
                ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P
                ON M.POS_CODE = P.POS_CODE
            LEFT JOIN STORE S
                ON S.OWNER_EMP_NO = M.EMP_NO
            ORDER BY M.CREATED_AT ASC
            """)
    List<EmpVo> selectDetail();

}
