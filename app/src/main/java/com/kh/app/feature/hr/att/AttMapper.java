package com.kh.app.feature.hr.att;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AttMapper {

    // =========================================================
    // 1. 일일 기본 row 생성용
    // =========================================================
    // 1.1 특정 날짜에 근태 row가 아직 없는 재직자 사번 목록 조회
    @Select("""
            SELECT M.EMP_NO
            FROM MEMBER M
            WHERE M.QUIT_YN = 'N'
            AND NOT EXISTS
            (
            SELECT 1
            FROM ATTENDANCE A
            WHERE A.EMP_NO = M.EMP_NO
            AND A.WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            )
            ORDER BY M.EMP_NO
            """)
    List<String> selectEmpNoListForDailyInit(@Param("workDate") String workDate);

    // 1.2 특정 직원의 특정 날짜 기본 근태 row 생성
    @Insert("""
                INSERT INTO ATTENDANCE
                (
                    ATT_NO,
                    STATUS_CODE,
                    EMP_NO,
                    WORK_DATE,
                    CHECK_IN_AT,
                    CHECK_OUT_AT,
                    ATT_NOTE,
                    CREATED_AT,
                    UPDATED_AT,
                    OT_APPROVED_HOURS,
                    OT_CONFIRMED_HOURS
                )
                VALUES
                (
                    SEQ_ATTENDANCE.NEXTVAL,
                    NULL,
                    #{empNo},
                    TO_DATE(#{workDate}, 'YYYY-MM-DD'),
                    NULL,
                    NULL,
                    NULL,
                    SYSTIMESTAMP,
                    SYSTIMESTAMP,
                    NULL,
                    NULL
                )
            """)
    int insertDailyAttendanceRow(@Param("empNo") String empNo, @Param("workDate") String workDate);


    // =========================================================
    // 2. 월별 전체조회용
    // =========================================================
    // 2-1. month 기준 전체 요약 조회
    //      - 출근 수
    //      - 지각 수
    //      - 결근 수
    //      - 휴가 수
    //      - 인정 OT 합계
    @Select("""
            SELECT
            NVL(SUM(CASE WHEN STATUS_CODE = 1 THEN 1 ELSE 0 END), 0) AS attendanceCount,
            NVL(SUM(CASE WHEN STATUS_CODE = 2 THEN 1 ELSE 0 END), 0) AS lateCount,
            NVL(SUM(CASE WHEN STATUS_CODE = 3 THEN 1 ELSE 0 END), 0) AS absentCount,
            NVL(SUM(CASE WHEN STATUS_CODE = 4 THEN 1 ELSE 0 END), 0) AS vacationCount,
            NVL(SUM(OT_CONFIRMED_HOURS), 0) AS otHours
            FROM ATTENDANCE
            WHERE TO_CHAR(WORK_DATE, 'YYYY-MM') = #{month}
            """)
    AttSummaryVo selectMonthSummary(@Param("month") String month);

    // 2-2. month 기준 직원별 월간 리스트 조회
    @Select("""
            SELECT
            M.EMP_NO AS empNo,
            M.EMP_NAME AS empName,
            D.DEPT_NAME AS deptName,
            P.POS_NAME AS posName,
            NVL(SUM(CASE WHEN A.STATUS_CODE = 1 THEN 1 ELSE 0 END), 0) AS attCount,
            NVL(SUM(CASE WHEN A.STATUS_CODE = 2 THEN 1 ELSE 0 END), 0) AS lateCount,
            NVL(SUM(CASE WHEN A.STATUS_CODE = 3 THEN 1 ELSE 0 END), 0) AS absentCount,
            NVL(SUM(CASE WHEN A.STATUS_CODE = 4 THEN 1 ELSE 0 END), 0) AS vacationCount,
            NVL(SUM(A.OT_CONFIRMED_HOURS), 0) AS otHours
            FROM MEMBER M
            JOIN DEPT D
              ON M.DEPT_CODE = D.DEPT_CODE
            JOIN POSITION P
              ON M.POS_CODE = P.POS_CODE
            LEFT JOIN ATTENDANCE A
              ON M.EMP_NO = A.EMP_NO
             AND TO_CHAR(A.WORK_DATE, 'YYYY-MM') = #{month}
            WHERE M.QUIT_YN = 'N'
            GROUP BY
            M.EMP_NO,
            M.EMP_NAME,
            D.DEPT_NAME,
            P.POS_NAME
            ORDER BY M.EMP_NO
            """)
    List<AttListVo> selectMonthList(@Param("month") String month);


    // =========================================================
    // 3. 상세조회용
    // =========================================================
    // 3-1. empNo 기준 사원 선택하고 해당 사원 기본정보 조회
    @Select("""
            SELECT
            M.EMP_NO AS empNo,
            M.EMP_NAME AS empName,
            D.DEPT_NAME AS deptName,
            P.POS_NAME AS posName
            FROM MEMBER M
            JOIN DEPT D
            ON M.DEPT_CODE = D.DEPT_CODE
            JOIN POSITION P
            ON M.POS_CODE = P.POS_CODE
            WHERE M.EMP_NO = #{empNo}
            """)
    AttListVo selectMemberInfo(@Param("empNo") String empNo);

    // 3-2. 해당 사원의 선택 month 기준 요약 조회
    @Select("""
            SELECT
            NVL(SUM(CASE WHEN STATUS_CODE = 1 THEN 1 ELSE 0 END), 0) AS attendanceCount,
            NVL(SUM(CASE WHEN STATUS_CODE = 2 THEN 1 ELSE 0 END), 0) AS lateCount,
            NVL(SUM(CASE WHEN STATUS_CODE = 3 THEN 1 ELSE 0 END), 0) AS absentCount,
            NVL(SUM(CASE WHEN STATUS_CODE = 4 THEN 1 ELSE 0 END), 0) AS vacationCount,
            NVL(SUM(OT_CONFIRMED_HOURS), 0) AS otHours
            FROM ATTENDANCE
            WHERE EMP_NO = #{empNo}
            AND TO_CHAR(WORK_DATE, 'YYYY-MM') = #{month}
            """)
    AttSummaryVo selectEmpMonthSummary(@Param("empNo") String empNo, @Param("month") String month);

    // 3-3. 해당사원의 + 선택한 달 기준 일별 상세이력 조회
    @Select("""
            SELECT
            A.ATT_NO AS attNo,
            TO_CHAR(A.WORK_DATE, 'YYYY-MM-DD') AS workDate,
            A.STATUS_CODE AS statusCode,
            S.STATUS_NAME AS statusName,
            TO_CHAR(A.CHECK_IN_AT, 'HH24:MI') AS checkInAt,
            TO_CHAR(A.CHECK_OUT_AT, 'HH24:MI') AS checkOutAt,
            A.OT_APPROVED_HOURS AS otApprovedHours,
            A.OT_CONFIRMED_HOURS AS otConfirmedHours,
            A.ATT_NOTE AS attNote
            FROM ATTENDANCE A
            LEFT JOIN ATT_STATUS S
            ON A.STATUS_CODE = S.STATUS_CODE
            WHERE A.EMP_NO = #{empNo}
            AND TO_CHAR(A.WORK_DATE, 'YYYY-MM') = #{month}
            ORDER BY A.WORK_DATE
            """)
    List<AttDetailVo> selectEmpMonthHistory(@Param("empNo") String empNo, @Param("month") String month);


    // =========================================================
    // 4. 수정용
    // =========================================================
    // 4-1. attNo 기준 근태 단건 수정

    @Update("""
            UPDATE ATTENDANCE
            SET STATUS_CODE = #{statusCode},
            
            CHECK_IN_AT =
            CASE WHEN #{checkInAt} IS NULL OR #{checkInAt} = ''
            THEN NULL
            ELSE TO_TIMESTAMP(#{checkInAt}, 'YYYY-MM-DD HH24:MI:SS')
            END,
            
            CHECK_OUT_AT =
            CASE WHEN #{checkOutAt} IS NULL OR #{checkOutAt} = ''
            THEN NULL
            ELSE TO_TIMESTAMP(#{checkOutAt}, 'YYYY-MM-DD HH24:MI:SS')
            END,
            
            ATT_NOTE = #{attNote},
            OT_APPROVED_HOURS = #{otApprovedHours},
            OT_CONFIRMED_HOURS = #{otConfirmedHours},
            UPDATED_AT = SYSTIMESTAMP
            WHERE ATT_NO = #{attNo}
            """)
    int updateAttendance(AttVo vo);


    // =========================================================
    // 5. 출근/퇴근용
    // =========================================================
    // 5-1. empNo + workDate 기준 근태 row 조회
    @Select("""
                SELECT
                    ATT_NO,
                    STATUS_CODE,
                    EMP_NO,
                    TO_CHAR(WORK_DATE, 'YYYY-MM-DD') AS WORK_DATE,
                    TO_CHAR(CHECK_IN_AT, 'YYYY-MM-DD HH24:MI:SS') AS CHECK_IN_AT,
                    TO_CHAR(CHECK_OUT_AT, 'YYYY-MM-DD HH24:MI:SS') AS CHECK_OUT_AT,
                    ATT_NOTE,
                    CREATED_AT,
                    UPDATED_AT,
                    OT_APPROVED_HOURS,
                    OT_CONFIRMED_HOURS
                FROM ATTENDANCE
                WHERE EMP_NO = #{empNo}
                  AND WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            """)
    AttVo selectAttendanceByEmpNoAndDate(@Param("empNo") String empNo, @Param("workDate") String workDate);

    // 5-2. 오늘 출근 처리 update
    @Update("""
            UPDATE ATTENDANCE
            SET STATUS_CODE = #{statusCode},
            CHECK_IN_AT = SYSTIMESTAMP,
            UPDATED_AT = SYSTIMESTAMP
            WHERE EMP_NO = #{empNo}
            AND WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            """)
    int updateCheckIn(@Param("empNo") String empNo, @Param("workDate") String workDate, @Param("statusCode") int statusCode);

    // 5-3. 오늘 퇴근 처리 update
    @Update("""
            UPDATE ATTENDANCE
            SET CHECK_OUT_AT = SYSTIMESTAMP,
            OT_CONFIRMED_HOURS = #{confirmedHours},
            UPDATED_AT = SYSTIMESTAMP
            WHERE EMP_NO = #{empNo}
            AND WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            """)
    int updateCheckOut(@Param("empNo") String empNo, @Param("workDate") String workDate, @Param("confirmedHours") int confirmedHours
    );

    // =========================================================
    // 8. 결근 마감용
    // =========================================================
    // 8-1. 특정 날짜 결근 처리 대상 사번 찾기 (근태상태 빈값 & 출근 시간 빈값)
    @Select("""
            SELECT EMP_NO
            FROM ATTENDANCE
            WHERE WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            AND STATUS_CODE IS NULL
            AND CHECK_IN_AT IS NULL
            ORDER BY EMP_NO
            """)
    List<String> selectAbsentTargetEmpNoList(@Param("workDate") String workDate);

    // 8-2. 특정 직원의 특정 날짜 근태를 결근으로 처리
    @Update("""
            UPDATE ATTENDANCE
            SET STATUS_CODE = 3,
            UPDATED_AT = SYSTIMESTAMP
            WHERE EMP_NO = #{empNo}
            AND WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            AND STATUS_CODE IS NULL
            AND CHECK_IN_AT IS NULL
            """)
    int updateAbsentAttendance(@Param("empNo") String empNo, @Param("workDate") String workDate);





    //------------전자결재 처리
    // 카테고리 확인 ->
    // 0. 이 문서 휴가 혹은 연장근무 뭔지?
    @Select("""
            SELECT CATEGORY_NO
            FROM APPROVAL_DOC
            WHERE DOC_NO = #{docNo}
            AND STATUS_CODE = 2
            AND DEL_YN = 'N'
            """)
    String selectApprovalCategoryByDocNo(@Param("docNo") String docNo);



    //1. 이 문서의 정보를 가져온다 (휴가)
    @Select("""
            SELECT
            A.DOC_NO AS docNo,
            A.WRITER_NO AS writerNo,
            TO_CHAR(V.START_DATE, 'YYYY-MM-DD') AS startDate,
            TO_CHAR(V.END_DATE, 'YYYY-MM-DD') AS endDate
            FROM APPROVAL_DOC A
            JOIN VACATION_DOC V
            ON A.DOC_NO = V.DOC_NO
            WHERE A.DOC_NO = #{docNo}
            AND A.CATEGORY_NO = 1
            AND A.STATUS_CODE = 2
            AND A.DEL_YN = 'N'
            """)
    ApprovedVacationVo selectApprovedVacationByDocNo(@Param("docNo") String docNo);

    //2. 이 문서의 정보를 가져온다 (연장근무)
    @Select("""
            SELECT
            A.DOC_NO AS docNo,
            A.WRITER_NO AS writerNo,
            TO_CHAR(O.WORK_DATE, 'YYYY-MM-DD') AS workDate,
            O.WORK_HOUR AS workHour
            FROM APPROVAL_DOC A
            JOIN OVERTIME_DOC O
            ON A.DOC_NO = O.DOC_NO
            WHERE A.DOC_NO = #{docNo}
            AND A.CATEGORY_NO = 2
            AND A.STATUS_CODE = 2
            AND A.DEL_YN = 'N'
            """)
    ApprovedOvertimeVo selectApprovedOvertimeByDocNo(@Param("docNo") String docNo);

    //3. 신청자 근태가 생성되어있나?
    @Select("""
            SELECT COUNT(*)
            FROM ATTENDANCE
            WHERE EMP_NO = #{empNo}
            AND WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            """)
    int checkAttendanceExists(@Param("empNo") String empNo, @Param("workDate") String workDate);


    //4. 휴가를 넣을 해당날짜 근태 테이블을 만들기
    @Insert("""
            INSERT INTO ATTENDANCE
            (
            ATT_NO,
            STATUS_CODE,
            EMP_NO,
            WORK_DATE,
            CHECK_IN_AT,
            CHECK_OUT_AT,
            ATT_NOTE,
            CREATED_AT,
            UPDATED_AT,
            OT_APPROVED_HOURS,
            OT_CONFIRMED_HOURS
            )
            VALUES
            (
            SEQ_ATTENDANCE.NEXTVAL,
            4,
            #{empNo},
            TO_DATE(#{workDate}, 'YYYY-MM-DD'),
            NULL,
            NULL,
            '휴가 승인 반영',
            SYSTIMESTAMP,
            SYSTIMESTAMP,
            NULL,
            NULL
            )
            """)
    int insertVacationAttendance(@Param("empNo") String empNo, @Param("workDate") String workDate);

    //5. 휴가에 내한 내용을 만들어진 근태 테이블을 넣기
    @Update("""
            UPDATE ATTENDANCE
            SET STATUS_CODE = 4,
            CHECK_IN_AT = NULL,
            CHECK_OUT_AT = NULL,
            ATT_NOTE = '휴가 승인 반영',
            UPDATED_AT = SYSTIMESTAMP
            WHERE EMP_NO = #{empNo}
            AND WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            """)
    int updateVacationAttendance(@Param("empNo") String empNo, @Param("workDate") String workDate);


    //6. 연장근무 넣을 해당날짜 근태 테이블 만들기
    @Insert("""
            INSERT INTO ATTENDANCE
            (
            ATT_NO,
            STATUS_CODE,
            EMP_NO,
            WORK_DATE,
            CHECK_IN_AT,
            CHECK_OUT_AT,
            ATT_NOTE,
            CREATED_AT,
            UPDATED_AT,
            OT_APPROVED_HOURS,
            OT_CONFIRMED_HOURS
            )
            VALUES
            (
            SEQ_ATTENDANCE.NEXTVAL,
            NULL,
            #{empNo},
            TO_DATE(#{workDate}, 'YYYY-MM-DD'),
            NULL,
            NULL,
            '연장근무 승인 반영',
            SYSTIMESTAMP,
            SYSTIMESTAMP,
            #{approvedHours},
            NULL
            )
            """)
    int insertOvertimeAttendance(@Param("empNo") String empNo, @Param("workDate") String workDate, @Param("approvedHours") int approvedHours);

    //7. 만든 테이블에 연장근무 내용 넣기
    @Update("""
            UPDATE ATTENDANCE
            SET OT_APPROVED_HOURS = #{approvedHours},
            ATT_NOTE = '연장근무 승인 반영',
            UPDATED_AT = SYSTIMESTAMP
            WHERE EMP_NO = #{empNo}
            AND WORK_DATE = TO_DATE(#{workDate}, 'YYYY-MM-DD')
            """)
    int updateOvertimeAttendance(@Param("empNo") String empNo, @Param("workDate") String workDate, @Param("approvedHours") int approvedHours);

}