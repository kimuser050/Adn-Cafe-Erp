package com.kh.app.feature.hr.hrHome;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface HrHomeMapper {

    @Select("""
            SELECT
                M.EMP_NO AS empNo
                , M.EMP_NAME AS empName
                , D.DEPT_NAME AS deptName
                , P.POS_NAME AS posName
                , M.PROFILE_CHANGE_NAME AS profileImg
            FROM MEMBER M
            LEFT JOIN DEPT D
                ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P
                ON M.POS_CODE = P.POS_CODE
            WHERE M.EMP_NO = #{empNo}
              AND M.QUIT_YN = 'N'
            """)
    HrHomeProfileVo selectProfile(@Param("empNo") String empNo);

    // 전날 승인된 결재 건수
    @Select("""
        SELECT COUNT(*)
        FROM APPROVAL_DOC
        WHERE CATEGORY_NO = 1
          AND STATUS_CODE = 2
          AND DEL_YN = 'N'
          AND ACTED_AT IS NOT NULL
          AND TO_CHAR(ACTED_AT, 'YYYY-MM-DD') = #{baseDate}
        """)
    int selectApprovedVacationCount(@Param("baseDate") String baseDate);

    @Select("""
        SELECT COUNT(*)
        FROM APPROVAL_DOC
        WHERE CATEGORY_NO = 2
          AND STATUS_CODE = 2
          AND DEL_YN = 'N'
          AND ACTED_AT IS NOT NULL
          AND TO_CHAR(ACTED_AT, 'YYYY-MM-DD') = #{baseDate}
        """)
    int selectApprovedOvertimeCount(@Param("baseDate") String baseDate);

}