package com.kh.app.feature.hr.dept;

import com.kh.app.feature.hr.position.PosVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DeptMapper {

    //0. 신규부서등록하기
    @Insert("""
            INSERT INTO DEPT
            (DEPT_CODE
            , DEPT_NAME
            , DEPT_ADDRESS
            )
            VALUES
            ( #{deptCode}
            , #{deptName}
            , #{deptAddress}
            )
            """)
    int insert(DeptVo vo);


    //1. 부서리스트 가져오기 (MEMBER 랑 DEPT JOIN했음)
    @Select("""
            SELECT
                D.DEPT_CODE
                , D.DEPT_NAME
                , D.DEPT_ADDRESS
                , D.MANAGER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , D.USE_YN
                , TO_CHAR(D.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(D.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM DEPT D
            LEFT JOIN MEMBER M
                ON D.MANAGER_EMP_NO = M.EMP_NO
            ORDER BY D.CREATED_AT ASC
    """)
    List<DeptVo> selectList();

    @Select("""
        SELECT
            D.DEPT_CODE
                , D.DEPT_NAME
                , D.DEPT_ADDRESS
                , D.MANAGER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , D.USE_YN
                , TO_CHAR(D.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(D.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
        FROM DEPT D
        LEFT JOIN MEMBER M
        ON D.MANAGER_EMP_NO = M.EMP_NO
        WHERE DEPT_NAME LIKE '%' || #{keyword} || '%'
        ORDER BY D.CREATED_AT ASC
        """)
    List<DeptVo> selectListByName(String keyword);

    @Select("""
        SELECT
           D.DEPT_CODE
                , D.DEPT_NAME
                , D.DEPT_ADDRESS
                , D.MANAGER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , D.USE_YN
                , TO_CHAR(D.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(D.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
        FROM DEPT D
        LEFT JOIN MEMBER M
        ON D.MANAGER_EMP_NO = M.EMP_NO
        WHERE D.USE_YN = #{useYn}
        ORDER BY D.CREATED_AT ASC
        """)
    List<DeptVo> selectListByUseYn(String useYn);



    //2. 부서 상세조회하기 (MEMBER 랑 DEPT JOIN했음)
    @Select("""
            SELECT
                D.DEPT_CODE
                , D.DEPT_NAME
                , D.DEPT_ADDRESS
                , D.MANAGER_EMP_NO
                , M.EMP_NAME AS MANAGER_NAME
                , D.USE_YN
                , TO_CHAR(D.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(D.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM DEPT D
            LEFT JOIN MEMBER M
                ON D.MANAGER_EMP_NO = M.EMP_NO
            WHERE  D.DEPT_CODE = #{deptCode}
            """)
    DeptVo selectOne(String deptCode);

    //3. 부서 내 소속인원들 가져오기
    @Select("""
        SELECT
        EMP_NO
        , EMP_NAME
        , POS_CODE
        , EMP_PHONE
        , TO_CHAR(HIRE_DATE, 'YYYY-MM-DD') AS HIRE_DATE
        FROM MEMBER
        WHERE DEPT_CODE = #{deptCode}
          AND NVL(QUIT_YN, 'N') = 'N'
        ORDER BY HIRE_DATE ASC
        """)
    List<DeptMemberVo> selectMemberList(String deptCode);


    //4. 부서 비활성화 하기
    @Update("""
            UPDATE DEPT
            SET USE_YN = 'N'
            , UPDATED_AT = SYSTIMESTAMP
            WHERE DEPT_CODE = #{deptCode}
            """)
    int disable(String deptCode);

    //5. 부서 활성화 하기
    @Update("""
            UPDATE DEPT
            SET USE_YN = 'Y'
            , UPDATED_AT = SYSTIMESTAMP
            WHERE DEPT_CODE = #{deptCode}
            """)
    int enable(String deptCode);

    //6. 근무위치 수정하기
    @Update("""
            UPDATE DEPT
            SET DEPT_ADDRESS = #{deptAddress}
            , UPDATED_AT = SYSTIMESTAMP
            WHERE DEPT_CODE = #{deptCode}
            """)
    int editAddress(@Param("deptCode") String deptCode, @Param("deptAddress") String deptAddress);

    //7. 부서 관리자 수정하기
    @Update("""
            UPDATE DEPT
            SET MANAGER_EMP_NO = #{managerEmpNo}
            , UPDATED_AT = SYSTIMESTAMP
            WHERE DEPT_CODE = #{deptCode}
            """)
    int editManager(@Param("deptCode") String deptCode, @Param("managerEmpNo") String managerEmpNo);


}