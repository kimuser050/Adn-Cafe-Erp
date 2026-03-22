package com.kh.app.feature.hr.payroll;

import org.apache.ibatis.annotations.*;
import com.kh.app.feature.util.PageVo;
import java.util.List;
import java.util.Map;

@Mapper
public interface PayMapper {

    // 1. 중복 체크
    @Select("""
            SELECT COUNT(*)
            FROM PAYROLL_MASTER
            WHERE EMP_NO = #{empNo}
              AND PAY_MONTH = TO_DATE(#{payMonth}, 'YYYY-MM-DD')
              AND DEL_YN = 'N'
            """)
    int checkDuplicate(PayMasterVo vo);

    // 2. 급여 마스터 등록
    @Insert("""
            INSERT INTO PAYROLL_MASTER
            (
                PAY_NO,
                EMP_NO,
                PAY_MONTH,
                TOTAL_EARN_AMOUNT,
                TOTAL_DEDUCT_AMOUNT,
                NET_AMOUNT
            )
            VALUES
            (
                SEQ_PAYROLL_MASTER.NEXTVAL,
                #{empNo},
                TO_DATE(#{payMonth}, 'YYYY-MM-DD'),
                #{totalEarnAmount},
                #{totalDeductAmount},
                #{netAmount}
            )
            """)
    int insertMaster(PayMasterVo vo);

    // 3. 방금 생성된 마스터의 PAY_NO 가져오기
    @Select("""
            SELECT SEQ_PAYROLL_MASTER.CURRVAL
            FROM DUAL
            """)
    String selectCurrentPayNo();

    // 4. 상세 급여 항목 등록
    @Insert("""
            INSERT INTO PAYROLL_DETAIL
            (
                PAY_DETAIL_NO,
                PAY_NO,
                ITEM_CODE,
                AMOUNT,
                PAY_NOTE
            )
            VALUES
            (
                SEQ_PAYROLL_DETAIL.NEXTVAL,
                #{payNo},
                #{itemCode},
                #{amount},
                #{payNote}
            )
            """)
    int insertDetail(PayDetailVo vo);

    // 5. 월별 목록
    @Select("""
            SELECT COUNT(*)
            FROM PAYROLL_MASTER PM
            WHERE PM.DEL_YN = 'N'
              AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
            """)
    int selectCount(@Param("month") String month);

    @Select("""
            SELECT
                PM.PAY_NO
                , PM.EMP_NO
                , M.EMP_NAME
                , P.POS_NAME
                , D.DEPT_NAME
                , TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') AS PAY_MONTH
                , PM.TOTAL_EARN_AMOUNT
                , PM.TOTAL_DEDUCT_AMOUNT
                , PM.NET_AMOUNT
                , PM.CONFIRM_YN
                , PM.DEL_YN
                , TO_CHAR(PM.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(PM.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM PAYROLL_MASTER PM
            LEFT JOIN MEMBER M ON PM.EMP_NO = M.EMP_NO
            LEFT JOIN DEPT D ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P ON M.POS_CODE = P.POS_CODE
            WHERE PM.DEL_YN = 'N'
              AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
            ORDER BY PM.CREATED_AT DESC, PM.PAY_NO DESC
            OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
            """)
    List<PayMasterVo> selectListByPage(@Param("month") String month, @Param("pvo") PageVo pvo);

    // 6. 월별 요약
    @Select("""
            SELECT
                COUNT(*) AS totalCount
                , NVL(SUM(PM.NET_AMOUNT), 0) AS totalNetAmount
                , SUM(CASE WHEN PM.CONFIRM_YN = 'N' THEN 1 ELSE 0 END) AS unconfirmedCount
                , SUM(CASE WHEN PM.CONFIRM_YN = 'Y' THEN 1 ELSE 0 END) AS confirmedCount
            FROM PAYROLL_MASTER PM
            WHERE PM.DEL_YN = 'N'
              AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
            """)
    Map<String, Object> selectSummaryByMonth(String month);

    // 7. 1건 조회
    @Select("""
            SELECT
                PM.PAY_NO
                , PM.EMP_NO
                , M.EMP_NAME
                , P.POS_NAME
                , D.DEPT_NAME
                , TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') AS PAY_MONTH
                , PM.TOTAL_EARN_AMOUNT
                , PM.TOTAL_DEDUCT_AMOUNT
                , PM.NET_AMOUNT
                , PM.CONFIRM_YN
                , PM.DEL_YN
                , TO_CHAR(PM.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(PM.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM PAYROLL_MASTER PM
            LEFT JOIN MEMBER M ON PM.EMP_NO = M.EMP_NO
            LEFT JOIN DEPT D ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P ON M.POS_CODE = P.POS_CODE
            WHERE PM.PAY_NO = #{payNo}
              AND PM.DEL_YN = 'N'
            """)
    PayMasterVo selectOne(String payNo);

    // 8. 상세항목 조회
    @Select("""
            SELECT
                PD.PAY_DETAIL_NO
                , PD.PAY_NO
                , PD.ITEM_CODE
                , PI.ITEM_NAME
                , PI.ITEM_TYPE
                , PI.IS_TAXABLE
                , PI.SORT_ORDER
                , PD.AMOUNT
                , PD.PAY_NOTE
                , TO_CHAR(PD.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(PD.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM PAYROLL_DETAIL PD
            JOIN PAYROLL_ITEM PI ON PD.ITEM_CODE = PI.ITEM_CODE
            WHERE PD.PAY_NO = #{payNo}
            ORDER BY PI.SORT_ORDER ASC, PD.PAY_DETAIL_NO ASC
            """)
    List<PayDetailVo> selectDetailList(String payNo);

    // 9. 이름 검색
    @Select("""
            SELECT COUNT(*)
            FROM PAYROLL_MASTER PM
            LEFT JOIN MEMBER M ON PM.EMP_NO = M.EMP_NO
            WHERE PM.DEL_YN = 'N'
              AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
              AND M.EMP_NAME LIKE '%' || #{keyword} || '%'
            """)
    int selectCountByName(@Param("month") String month,
                          @Param("keyword") String keyword);

    @Select("""
            SELECT
                PM.PAY_NO
                , PM.EMP_NO
                , M.EMP_NAME
                , P.POS_NAME
                , D.DEPT_NAME
                , TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') AS PAY_MONTH
                , PM.TOTAL_EARN_AMOUNT
                , PM.TOTAL_DEDUCT_AMOUNT
                , PM.NET_AMOUNT
                , PM.CONFIRM_YN
                , PM.DEL_YN
                , TO_CHAR(PM.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(PM.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM PAYROLL_MASTER PM
            LEFT JOIN MEMBER M ON PM.EMP_NO = M.EMP_NO
            LEFT JOIN DEPT D ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P ON M.POS_CODE = P.POS_CODE
            WHERE PM.DEL_YN = 'N'
              AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
              AND M.EMP_NAME LIKE '%' || #{keyword} || '%'
            ORDER BY PM.CREATED_AT DESC, PM.PAY_NO DESC
            OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
            """)
    List<PayMasterVo> selectListByNameByPage(
            @Param("month") String month,
            @Param("keyword") String keyword,
            @Param("pvo") PageVo pvo
    );

    // 10. 확정상태 검색
    @Select("""
            SELECT COUNT(*)
            FROM PAYROLL_MASTER PM
            WHERE PM.DEL_YN = 'N'
              AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
              AND PM.CONFIRM_YN = #{confirmYn}
            """)
    int selectCountByConfirmYn(@Param("month") String month,
                               @Param("confirmYn") String confirmYn);

    @Select("""
            SELECT
                PM.PAY_NO
                , PM.EMP_NO
                , M.EMP_NAME
                , P.POS_NAME
                , D.DEPT_NAME
                , TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') AS PAY_MONTH
                , PM.TOTAL_EARN_AMOUNT
                , PM.TOTAL_DEDUCT_AMOUNT
                , PM.NET_AMOUNT
                , PM.CONFIRM_YN
                , PM.DEL_YN
                , TO_CHAR(PM.CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(PM.UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM PAYROLL_MASTER PM
            LEFT JOIN MEMBER M ON PM.EMP_NO = M.EMP_NO
            LEFT JOIN DEPT D ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P ON M.POS_CODE = P.POS_CODE
            WHERE PM.DEL_YN = 'N'
              AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
              AND PM.CONFIRM_YN = #{confirmYn}
            ORDER BY PM.CREATED_AT DESC, PM.PAY_NO DESC
            OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
            """)
    List<PayMasterVo> selectListByConfirmYnByPage(
            @Param("month") String month,
            @Param("confirmYn") String confirmYn,
            @Param("pvo") PageVo pvo
    );

    // 11. 확정
    @Update("""
            UPDATE PAYROLL_MASTER
            SET CONFIRM_YN = 'Y'
              , UPDATED_AT = SYSTIMESTAMP
            WHERE PAY_NO = #{payNo}
              AND DEL_YN = 'N'
            """)
    int confirmY(String payNo);

    // 12. 확정취소
    @Update("""
            UPDATE PAYROLL_MASTER
            SET CONFIRM_YN = 'N'
              , UPDATED_AT = SYSTIMESTAMP
            WHERE PAY_NO = #{payNo}
              AND DEL_YN = 'N'
            """)
    int confirmN(String payNo);

    // 13. 삭제
    @Update("""
            UPDATE PAYROLL_MASTER
            SET DEL_YN = 'Y'
              , UPDATED_AT = SYSTIMESTAMP
            WHERE PAY_NO = #{payNo}
              AND DEL_YN = 'N'
            """)
    int delete(String payNo);

    // 14. 마스터 수정
    @Update("""
            UPDATE PAYROLL_MASTER
            SET TOTAL_EARN_AMOUNT = #{totalEarnAmount}
              , TOTAL_DEDUCT_AMOUNT = #{totalDeductAmount}
              , NET_AMOUNT = #{netAmount}
              , UPDATED_AT = SYSTIMESTAMP
            WHERE PAY_NO = #{payNo}
              AND DEL_YN = 'N'
            """)
    int updateMaster(PayMasterVo vo);

    // 15. 상세 삭제
    @Delete("""
            DELETE FROM PAYROLL_DETAIL
            WHERE PAY_NO = #{payNo}
            """)
    int deleteDetailByPayNo(String payNo);

    // 16. 등록/수정용 급여항목 목록
    @Select("""
            SELECT
                ITEM_CODE
                , ITEM_NAME
                , ITEM_TYPE
                , IS_TAXABLE
                , SORT_ORDER
                , USE_YN
                , TO_CHAR(CREATED_AT, 'YYYY-MM-DD') AS CREATED_AT
                , TO_CHAR(UPDATED_AT, 'YYYY-MM-DD') AS UPDATED_AT
            FROM PAYROLL_ITEM
            WHERE USE_YN = 'Y'
            ORDER BY SORT_ORDER ASC
            """)
    List<PayItemVo> selectItemList();

    // 17. 등록용 사원 검색
    @Select("""
            SELECT
                M.EMP_NO
                , M.EMP_NAME
                , D.DEPT_NAME
                , P.POS_NAME
                , P.BASE_SALARY
                , P.BONUS_RATE
            FROM MEMBER M
            LEFT JOIN DEPT D ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P ON M.POS_CODE = P.POS_CODE
            WHERE M.EMP_NAME LIKE '%' || #{keyword} || '%'
               OR TO_CHAR(M.EMP_NO) LIKE '%' || #{keyword} || '%'
            ORDER BY M.EMP_NAME ASC
            """)
    List<PayEmpVo> searchEmp(String keyword);

    // 18. 사원 1명 조회
    @Select("""
            SELECT
                M.EMP_NO
                , M.EMP_NAME
                , D.DEPT_NAME
                , P.POS_NAME
                , P.BASE_SALARY
                , P.BONUS_RATE
            FROM MEMBER M
            LEFT JOIN DEPT D ON M.DEPT_CODE = D.DEPT_CODE
            LEFT JOIN POSITION P ON M.POS_CODE = P.POS_CODE
            WHERE M.EMP_NO = #{empNo}
            """)
    PayEmpVo selectEmpOne(String empNo);

//

    @Select("""
            SELECT NVL(SUM(OT_CONFIRMED_HOURS), 0)
            FROM ATTENDANCE
            WHERE EMP_NO = #{empNo}
              AND TO_CHAR(WORK_DATE, 'YYYY-MM') = #{month}
            """)
    int selectConfirmedOtHoursByMonth(@Param("empNo") String empNo, @Param("month") String month);


    @Select("""
            SELECT
                COUNT(*) AS totalCount
                , NVL(SUM(PM.NET_AMOUNT), 0) AS totalNetAmount
                , SUM(CASE WHEN PM.CONFIRM_YN = 'N' THEN 1 ELSE 0 END) AS unconfirmedCount
                , SUM(CASE WHEN PM.CONFIRM_YN = 'Y' THEN 1 ELSE 0 END) AS confirmedCount
            FROM PAYROLL_MASTER PM
            LEFT JOIN MEMBER M ON PM.EMP_NO = M.EMP_NO
            WHERE PM.DEL_YN = 'N'
              AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
              AND M.EMP_NAME LIKE '%' || #{keyword} || '%'
            """)
    Map<String, Object> selectSummaryByName(@Param("month") String month,
                                            @Param("keyword") String keyword);


    @Select("""
        SELECT
            COUNT(*) AS totalCount
            , NVL(SUM(PM.NET_AMOUNT), 0) AS totalNetAmount
            , SUM(CASE WHEN PM.CONFIRM_YN = 'N' THEN 1 ELSE 0 END) AS unconfirmedCount
            , SUM(CASE WHEN PM.CONFIRM_YN = 'Y' THEN 1 ELSE 0 END) AS confirmedCount
        FROM PAYROLL_MASTER PM
        WHERE PM.DEL_YN = 'N'
          AND TO_CHAR(PM.PAY_MONTH, 'YYYY-MM') = #{month}
          AND PM.CONFIRM_YN = #{confirmYn}
        """)
    Map<String, Object> selectSummaryByConfirmYn(@Param("month") String month,
                                                 @Param("confirmYn") String confirmYn);
}