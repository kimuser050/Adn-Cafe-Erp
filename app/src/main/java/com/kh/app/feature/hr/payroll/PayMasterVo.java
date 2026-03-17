package com.kh.app.feature.hr.payroll;

import lombok.Data;

import java.util.List;

@Data
public class PayMasterVo {
    private String payNo;
    private String empNo;
    private String payMonth;
    private String totalEarnAmount;
    private String totalDeductAmount;
    private String netAmount;
    private String confirmYn;
    private String delYn;
    private String createdAt;
    private String updatedAt;

    private List<PayHisVo> detailList;
}