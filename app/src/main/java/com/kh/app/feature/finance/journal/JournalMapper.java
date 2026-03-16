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
                ACCOUNT_NO = #{accountNo}
                , DEBIT = #{debit}
                , CREDIT = #{credit}
            WHERE JOURNAL_NO = #{journalNo}
            AND IS_DELETED = 'N'
        """)
    int updateJournal(JournalVo vo);

    @Update("""
            UPDATE JOURNAL
            SET
                IS_DELETED = 'Y'
            WHERE JOURNAL_NO = #{journalNo}
            AND WRITER_NO = #{writerNo}
            AND IS_DELETED = 'N'
            """)
    int delJournal(JournalVo vo);


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
                , J.WRITER_NO
            FROM JOURNAL J
            JOIN ACCOUNT A ON J.ACCOUNT_NO = A.ACCOUNT_NO
            WHERE J.IS_DELETED = 'N'
            AND J.JOURNAL_DATE = TO_DATE(#{journalDate}, 'YY/MM/DD')
            ORDER BY J.JOURNAL_DATE DESC, J.JOURNAL_NO DESC
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
}
