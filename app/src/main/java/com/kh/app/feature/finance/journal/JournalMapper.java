package com.kh.app.feature.finance.journal;

import com.kh.app.feature.finance.account.AccountVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface JournalMapper {

    @Select("SELECT SEQ_JOURNAL_NO.NEXTVAL FROM DUAL")
    String getJournalNo();

    @Insert("""
            INSERT INTO JOURNAL
            (
                JOURNAL_NO
                , ACCOUNT_NO
                , JOURNAL_DATE
                , DEBIT
                , CREDIT
                , WRITER_NO
            )
            VALUES
            (
                #{journalNo}
                , #{accountNo}
                , #{journalDate}
                , #{debit}
                , #{credit}
                , #{writerNo}
            )
            """)
    int insertJournal(JournalVo vo);

    @Update("""
            UPDATE JOURNAL
            SET
                IS_DELETED = 'Y'
            WHERE JOURNAL_NO = #{journalNo}
            AND IS_DELETED = 'N'
            """)
    int delJournal(String journalNo);


    @Delete("""
            DELETE FROM JOURNAL
            WHERE JOURNAL_NO = #{sharedNo}
            """)
    void delJournalNo(String sharedNo);


    @Select("""
            SELECT
                J.JOURNAL_NO
                , J.JOURNAL_DATE
                , A.ACCOUNT_NAME
                , J.DEBIT
                , J.CREDIT
                , M.EMP_NAME AS writerName
            FROM JOURNAL J
            JOIN ACCOUNT A ON J.ACCOUNT_NO = A.ACCOUNT_NO
            JOIN MEMBER M ON M.EMP_NO = J.WRITER_NO
            WHERE J.IS_DELETED = 'N'
            AND J.JOURNAL_DATE = TO_DATE(#{journalDate}, 'YY/MM/DD')
            ORDER BY JOURNAL_NO DESC, DEBIT DESC
            """)
    List<JournalVo> selectJournal(String journalDate);


    @Select("""
            SELECT
                ACCOUNT_NO
                , ACCOUNT_NAME
            FROM ACCOUNT
            ORDER BY ACCOUNT_NO ASC
            """)
    List<AccountVo> getAccountList();

    @Select("""
            SELECT
                A.ACCOUNT_NAME
                ,TO_CHAR(J.JOURNAL_DATE, 'YY/MM/DD') AS journalDate
                ,J.CREDIT
                ,J.DEBIT
            FROM JOURNAL J
            JOIN ACCOUNT A ON J.ACCOUNT_NO = A.ACCOUNT_NO
            WHERE J.ACCOUNT_NO = #{accountNo}
            ORDER BY J.JOURNAL_DATE DESC
            """)
    List<JournalVo> totalList(String accountNo);

    @Select("""
            SELECT
                NVL(A.ACCOUNT_NAME, '총 합계') AS accountName
                ,SUM(J.CREDIT) AS credit
                ,SUM(J.DEBIT) AS debit
            FROM JOURNAL J
            JOIN ACCOUNT A ON J.ACCOUNT_NO = A.ACCOUNT_NO
            WHERE TO_CHAR(J.JOURNAL_DATE,'YYYY-MM') = #{journalDate}
            GROUP BY ROLLUP((A.ACCOUNT_NO , A.ACCOUNT_NAME))
            ORDER BY A.ACCOUNT_NO ASC NULLS LAST
            """)
    List<JournalVo> monthList(String journalDate);


    @Select("""
            SELECT
                NVL(A.ACCOUNT_NAME, '총 합계') AS accountName
                ,SUM(J.CREDIT) AS credit
                ,SUM(J.DEBIT) AS debit
            FROM JOURNAL J
            JOIN ACCOUNT A ON J.ACCOUNT_NO = A.ACCOUNT_NO
            WHERE TO_CHAR(J.JOURNAL_DATE,'YYYY-MM-DD') = #{journalDate}
            GROUP BY ROLLUP((A.ACCOUNT_NO , A.ACCOUNT_NAME))
            ORDER BY A.ACCOUNT_NO ASC NULLS LAST
            """)
    List<JournalVo> dailyList(String journalDate);

    @Select("""
            SELECT
                M.NAME AS mainAccountName
                ,S.NAME AS subAccountName
                ,A.ACCOUNT_NO AS accountNo
                ,A.ACCOUNT_NAME AS accountName
                ,CASE
                WHEN A.ACCOUNT_NO < 2000 THEN SUM(NVL(J.DEBIT,0)-NVL(J.CREDIT,0))
                ELSE SUM(NVL(J.CREDIT,0) - NVL(J.DEBIT,0))
                END AS thisMonth
            FROM ACCOUNT A
            JOIN JOURNAL J ON A.ACCOUNT_NO = J.ACCOUNT_NO
            JOIN MAIN_ACCOUNT M ON M.MAIN_ACCOUNT_NO = A.MAIN_ACCOUNT_NO
            LEFT JOIN SUB_ACCOUNT S ON S.SUB_ACCOUNT_NO = A.SUB_ACCOUNT_NO
            WHERE J.JOURNAL_DATE <= TO_DATE(#{journalDate}, 'YYYY-MM-DD')
            GROUP BY M.NAME, S.NAME, A.ACCOUNT_NO, A.ACCOUNT_NAME, S.SUB_ACCOUNT_NO
            ORDER BY S.SUB_ACCOUNT_NO, A.ACCOUNT_NO
            """)
    List<JournalVo> journalState(@Param("journalDate") String journalDate);


    @Select("""
            SELECT
                A.ACCOUNT_NAME AS accountName
                ,SUM(CASE
                WHEN TO_CHAR(J.JOURNAL_DATE,'YYYY-MM') = #{journalDate}
                THEN (NVL(J.CREDIT,0)-NVL(J.DEBIT,0)) ELSE 0
                END) AS thisMonth
                ,SUM(CASE
                WHEN TO_CHAR(J.JOURNAL_DATE,'YYYY-MM') = TO_CHAR(ADD_MONTHS(TO_DATE(#{journalDate}, 'YYYY-MM'),-1),'YYYY-MM')
                THEN (NVL(J.CREDIT,0)-NVL(J.DEBIT,0)) ELSE 0
                END) AS preMonth
            FROM ACCOUNT A
            LEFT JOIN JOURNAL J ON A.ACCOUNT_NO = J.ACCOUNT_NO
            JOIN MAIN_ACCOUNT M ON M.MAIN_ACCOUNT_NO = A.MAIN_ACCOUNT_NO
            WHERE M.MAIN_ACCOUNT_NO IN (4000,5000)
            GROUP BY A.ACCOUNT_NO, A.ACCOUNT_NAME
            ORDER BY A.ACCOUNT_NO
            """)
    List<JournalVo> incomeState(@Param("journalDate") String journalDate);

}