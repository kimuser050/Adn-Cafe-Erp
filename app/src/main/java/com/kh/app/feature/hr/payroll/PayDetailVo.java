package com.kh.app.feature.hr.payroll;

import lombok.Data;

@Data
public class PayDetailVo {
    private String payDetailNo;
    private String payNo;
    private String itemCode;
    private String amount;
    private String payNote;
    private String createdAt;
    private String updatedAt;

    // 조회용
    private String itemName;
    private String itemType;
    private String isTaxable;
    private String sortOrder;
}