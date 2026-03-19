package com.kh.app.feature.finance.journal;

import lombok.Data;

@Data
public class JournalVo {

    private String no;
    private String journalNo;
    private String mainAccountNo;
    private String mainAccountName;
    private String subAccountNo;
    private String subAccountName;
    private String accountNo;
    private String accountName;
    private String journalDate;
    private String debit;
    private String credit;
    private String writerNo;
    private String createdAt;
    private String isDeleted;
    private long thisMonth;
    private long preMonth;
}
