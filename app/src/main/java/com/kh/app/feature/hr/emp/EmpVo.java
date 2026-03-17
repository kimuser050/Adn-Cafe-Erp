package com.kh.app.feature.hr.emp;

import lombok.Data;

@Data
public class EmpVo {
    private String empNo;
    private String empPw;
    private String empName;
    private String posCode;
    private String posName;
    private String deptCode;
    private String deptName;
    private String storeName;
    private String orgName;

    //급여관련 기본정보 (직급에서 가져오는 거임)
    private String baseSalary;
    private String bonusRate;
    private String expectedSalary;

    private String empPhone;
    private String empEmail;
    private String empAddress;
    private String profileChangeName;
    private String profileOriginName;
    private String hireDate;
    private String resignDate;
    private String createdAt;
    private String updatedAt;
    private String quitYn;
    private String empStatusNo;
    private String statusName;
}
