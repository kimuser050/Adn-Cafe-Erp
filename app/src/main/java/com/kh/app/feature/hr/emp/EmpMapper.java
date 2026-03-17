package com.kh.app.feature.hr.emp;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface EmpMapper {

    // 1. 직원 전체조회
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
              , CS.STATUS_NAME
            FROM MEMBER M
            LEFT JOIN DEPT D
              ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P
              ON M.POS_CODE = P.POS_CODE
            LEFT JOIN STORE S
              ON S.OWNER_EMP_NO = M.EMP_NO
            LEFT JOIN CURRENT_STATUS CS
              ON M.EMP_STATUS_NO = CS.EMP_STATUS_NO 
            ORDER BY M.HIRE_DATE ASC
            """)
    List<EmpVo> selectList();


    // 2. 직원 상세조회
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
              , CS.STATUS_NAME
            FROM MEMBER M
            LEFT JOIN DEPT D
              ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P
              ON M.POS_CODE = P.POS_CODE
            LEFT JOIN STORE S
              ON S.OWNER_EMP_NO = M.EMP_NO
            LEFT JOIN CURRENT_STATUS CS
              ON M.EMP_STATUS_NO = CS.EMP_STATUS_NO
            WHERE M.EMP_NO = #{empNo}
            """)
    EmpVo selectDetail(String empNo);


    // 3. 해당 직원 인사이력 조회
    @Select("""
            SELECT
                EH.HIS_NO
              , EH.EMP_NO
              , M.EMP_NAME
              , TO_CHAR(EH.HIS_DATE, 'YYYY-MM-DD') AS HIS_DATE
              , EH.HIS_EVENT
              , EH.HIS_CONTENT
              , TO_CHAR(EH.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
              , TO_CHAR(EH.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM EMP_HISTORY EH
            LEFT JOIN MEMBER M
              ON EH.EMP_NO = M.EMP_NO
            WHERE EH.EMP_NO = #{empNo}
            ORDER BY EH.HIS_DATE DESC
            """)
    List<EmpHistoryVo> selectEmpHistory(String empNo);


    // 4. 직원 기본정보 수정
    @Update("""
            UPDATE MEMBER
            SET
                POS_CODE = #{posCode}
              , DEPT_CODE = #{deptCode}
              , EMP_STATUS_NO = #{empStatusNo}
              , UPDATED_AT = SYSTIMESTAMP
            WHERE EMP_NO = #{empNo}
            """)
    int edit(EmpVo vo);


    // 5. 인사이력 추가
    @Insert("""
            INSERT INTO EMP_HISTORY
            (
                HIS_NO
              , EMP_NO
              , HIS_DATE
              , HIS_EVENT
              , HIS_CONTENT
            )
            VALUES
            (
                SEQ_EMP_HISTORY.NEXTVAL
              , #{empNo}
              , TO_DATE(#{hisDate}, 'YYYY-MM-DD')
              , #{hisEvent}
              , #{hisContent}
            )
            """)
    int insertEmpHistory(EmpHistoryVo vo);


    // 6. 인사이력 수정
    @Update("""
            UPDATE EMP_HISTORY
            SET
                HIS_DATE = TO_DATE(#{hisDate}, 'YYYY-MM-DD')
              , HIS_EVENT = #{hisEvent}
              , HIS_CONTENT = #{hisContent}
              , UPDATED_AT = SYSTIMESTAMP
            WHERE HIS_NO = #{hisNo}
            """)
    int editEmpHistory(EmpHistoryVo vo);

    //상태 가져오기
    @Select("""
        SELECT
            EMP_STATUS_NO
          , STATUS_NAME
        FROM CURRENT_STATUS
        ORDER BY EMP_STATUS_NO ASC
        """)
    List<CurrentStatusVo> selectStatusList();
}