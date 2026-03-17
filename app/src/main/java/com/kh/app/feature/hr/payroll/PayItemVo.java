package com.kh.app.feature.hr.payroll;

import lombok.Data;

@Data
public class PayItemVo {
    private String itemCode;
    private String itemName;
    private String itemType;
    private String isTaxable;
    private String sortOrder;
    private String useYn;
    private String createdAt;
    private String updatedAt;
}
