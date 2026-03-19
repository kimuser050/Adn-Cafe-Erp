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

    // 목록 / 상세조회 화면용
    private String empName;
    private String deptName;
    private String posName;

    private List<PayDetailVo> detailList;
}