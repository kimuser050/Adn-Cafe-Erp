package com.kh.app.feature.finance.Account;

import lombok.Data;

@Data
public class AccountVo {

    private String accountNo;
    private String mainAccountNo;
    private String subAccountNo;
    private String accountName;
    private String useYn;
    private String createdAt;

}
