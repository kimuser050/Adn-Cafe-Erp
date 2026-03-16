package com.kh.app.feature.hr.emp;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface EmpMapper {

    @Select("""
            SELECT
            M.EMP_NO
            , M.EMP_PW
            , M.EMP_NAME
            , M.POS_CODE
            , P.POS_NAME
            , M.DEPT_CODE
            , D.DEPT_NAME
            , M.RESD_NO
            , M.EMP_PHONE
            , M.EMP_EMAIL
            , M.EMP_ADDRESS
            , M.PROFILE_CHANGE_NAME
            , M.PROFILE_ORIGIN_NAME
            , M.HIRE_DATE
            , M.RESIGN_DATE
            , TO_CHAR(M.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
            , TO_CHAR(M.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            , M.QUIT_YN
            , M.EMP_STATUS_NO
            FROM MEMBER M
            LEFT JOIN DEPT D
                 ON D.MANAGER_EMP_NO = M.EMP_NO
            LEFT JOIN POSITION P
                 ON M.POS_CODE = P.POS_CODE
            ORDER BY M.CREATED_AT ASC
            """)
    List<EmpVo> selectList();
}
