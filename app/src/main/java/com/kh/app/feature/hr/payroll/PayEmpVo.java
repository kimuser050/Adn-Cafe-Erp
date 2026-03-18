package com.kh.app.feature.hr.payroll;

import lombok.Data;

@Data
public class PayEmpVo {
    private String empNo;
    private String empName;
    private String deptName;
    private String posName;
    private String baseSalary;
    private String bonusRate;
}
