package com.kh.app.feature.hr.position;

import lombok.Data;

@Data
public class PosVo {
    private String posCode;
    private String posName;
    private String posDesc;
    private String baseSalary;
    private String bonusRate;
    private String expectedSalary;
    private String useYn;
    private String createdAt;
    private String updatedAt;
}

