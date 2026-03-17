package com.kh.app.feature.hr.payroll;

import lombok.Data;

@Data
public class PayHisVo {
    private String payDetailNo;
    private String payNo;
    private String itemCode;
    private String amount;
    private String payNote;
    private String createdAt;
    private String updatedAt;
}