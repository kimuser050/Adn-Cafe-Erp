package com.kh.app.feature.finance.journal;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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

}
