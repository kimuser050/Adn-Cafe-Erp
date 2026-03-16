package com.kh.app.feature.hr.position;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PosMapper {

    @Insert("""
            INSERT INTO POSITION
            (
                POS_CODE
                , POS_NAME
                , POS_DESC
                , BASE_SALARY
                , BONUS_RATE
            )
            VALUES
            (
                #{posCode}
                , #{posName}
                , #{posDesc}
                , #{baseSalary}
                , #{bonusRate}
            )
            """)
    int insert(PosVo vo);

    @Select("""
            SELECT
                P.POS_CODE
                , P.POS_NAME
                , P.POS_DESC
                , P.BASE_SALARY
                , P.BONUS_RATE
                , (P.BASE_SALARY + (P.BASE_SALARY * P.BONUS_RATE)) AS EXPECTED_SALARY
                , P.USE_YN
                , TO_CHAR(P.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(P.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM POSITION P
            ORDER BY P.POS_CODE ASC
            """)
    List<PosVo> selectList();

    @Select("""
        SELECT
            POS_CODE
            , POS_NAME
            , POS_DESC
            , BASE_SALARY
            , BONUS_RATE
            , (BASE_SALARY + (BASE_SALARY * BONUS_RATE)) AS EXPECTED_SALARY
            , USE_YN
            , TO_CHAR(CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
            , TO_CHAR(UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
        FROM POSITION
        WHERE POS_NAME LIKE '%' || #{keyword} || '%'
        ORDER BY CREATED_AT ASC
        """)
    List<PosVo> selectListByName(String keyword);

    @Select("""
        SELECT
            POS_CODE
            , POS_NAME
            , POS_DESC
            , BASE_SALARY
            , BONUS_RATE
            , (BASE_SALARY + (BASE_SALARY * BONUS_RATE)) AS EXPECTED_SALARY
            , USE_YN
            , TO_CHAR(CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
            , TO_CHAR(UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
        FROM POSITION
        WHERE USE_YN = #{useYn}
        ORDER BY CREATED_AT ASC
        """)
    List<PosVo> selectListByUseYn(String useYn);

    @Select("""
            SELECT
                P.POS_CODE
                , P.POS_NAME
                , P.POS_DESC
                , P.BASE_SALARY
                , P.BONUS_RATE
                , (P.BASE_SALARY + (P.BASE_SALARY * P.BONUS_RATE)) AS EXPECTED_SALARY
                , P.USE_YN
                , TO_CHAR(P.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(P.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM POSITION P
            WHERE P.POS_CODE = #{posCode}
            """)
    PosVo selectDetail(String posCode);

    @Select("""
            SELECT
                M.EMP_NO
                , M.EMP_NAME
                , D.DEPT_NAME
                , M.EMP_PHONE
                , TO_CHAR(M.HIRE_DATE, 'YYYY-MM-DD') AS HIRE_DATE
            FROM MEMBER M
            LEFT JOIN DEPT D
                ON D.DEPT_CODE = M.DEPT_CODE
            WHERE M.POS_CODE = #{posCode}
              AND NVL(M.QUIT_YN, 'N') = 'N'
            ORDER BY M.EMP_NO ASC
            """)
    List<PosMemberVo> selectMemberList(String posCode);

    @Update("""
            UPDATE POSITION
            SET USE_YN = 'N'
              , UPDATED_AT = SYSTIMESTAMP
            WHERE POS_CODE = #{posCode}
            """)
    int disable(String posCode);

    @Update("""
            UPDATE POSITION
            SET USE_YN = 'Y'
              , UPDATED_AT = SYSTIMESTAMP
            WHERE POS_CODE = #{posCode}
            """)
    int enable(String posCode);

    @Update("""
            UPDATE POSITION
            SET BASE_SALARY = #{baseSalary}
              , UPDATED_AT = SYSTIMESTAMP
            WHERE POS_CODE = #{posCode}
            """)
    int editBaseSalary(@Param("posCode") String posCode,
                       @Param("baseSalary") String baseSalary);

    @Update("""
            UPDATE POSITION
            SET BONUS_RATE = #{bonusRate}
              , UPDATED_AT = SYSTIMESTAMP
            WHERE POS_CODE = #{posCode}
            """)
    int editBonusRate(@Param("posCode") String posCode,
                      @Param("bonusRate") String bonusRate);
}