package com.kh.app.feature.hr.hrHome;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

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

    @Select("""
        SELECT
            COUNT(*) AS totalEmpCount
            , NVL(SUM(CASE WHEN STATUS_CODE = 1 THEN 1 ELSE 0 END), 0) AS presentCount
            , NVL(SUM(CASE WHEN STATUS_CODE = 2 THEN 1 ELSE 0 END), 0) AS lateCount
            , NVL(SUM(CASE WHEN STATUS_CODE = 3 THEN 1 ELSE 0 END), 0) AS absentCount
            , NVL(SUM(CASE WHEN STATUS_CODE = 4 THEN 1 ELSE 0 END), 0) AS vacationCount
            , NVL(SUM(CASE WHEN NVL(OT_CONFIRMED_HOURS, 0) > 0 THEN 1 ELSE 0 END), 0) AS overtimeCount
            , NVL(SUM(CASE WHEN STATUS_CODE = 1 THEN 1 ELSE 0 END), 0) AS normalCount
        FROM ATTENDANCE
        WHERE WORK_DATE >= TO_DATE(#{baseDate}, 'YYYY-MM-DD')
          AND WORK_DATE < TO_DATE(#{baseDate}, 'YYYY-MM-DD') + 1
        """)
    HrHomeDayAttSummaryVo selectDayAttSummary(@Param("baseDate") String baseDate);

    @Select("""
            SELECT *
            FROM (
                SELECT
                    EH.EMP_NO AS empNo
                    , M.EMP_NAME AS empName
                    , D.DEPT_NAME AS deptName
                    , P.POS_NAME AS posName
                    , M.PROFILE_CHANGE_NAME AS profileImg
                    , TO_CHAR(EH.HIS_DATE, 'YYYY-MM-DD') AS hisDate
                    , EH.HIS_EVENT AS hisEvent
                    , EH.HIS_CONTENT AS hisContent
                FROM EMP_HISTORY EH
                JOIN MEMBER M
                    ON EH.EMP_NO = M.EMP_NO
                LEFT JOIN DEPT D
                    ON M.DEPT_CODE = D.DEPT_CODE
                LEFT JOIN POSITION P
                    ON M.POS_CODE = P.POS_CODE
                WHERE EH.HIS_EVENT IN ('신규입사', '퇴직', '부서배치', '직급변경')
                ORDER BY EH.HIS_DATE DESC
            )
            WHERE ROWNUM <= 6
            """)
    List<HrHomeIssueVo> selectRecentIssueList();

    @Select("""
        SELECT
            NVL(SUM(NET_AMOUNT), 0) AS totalNetAmount
            , COUNT(*) AS targetCount
            , NVL(SUM(CASE WHEN CONFIRM_YN = 'Y' THEN 1 ELSE 0 END), 0) AS confirmedCount
            , NVL(SUM(CASE WHEN CONFIRM_YN = 'N' THEN 1 ELSE 0 END), 0) AS unconfirmedCount
        FROM PAYROLL_MASTER
        WHERE DEL_YN = 'N'
          AND PAY_MONTH >= TO_DATE(#{payMonth}, 'YYYY-MM')
          AND PAY_MONTH < ADD_MONTHS(TO_DATE(#{payMonth}, 'YYYY-MM'), 1)
        """)
    HrHomePaySummaryVo selectPaySummary(@Param("payMonth") String payMonth);
}