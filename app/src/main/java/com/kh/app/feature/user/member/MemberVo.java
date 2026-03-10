package com.kh.app.feature.user.member;

import lombok.Data;

@Data
public class MemberVo {
    private String empNo;
    private String empPw;
    private String empName;
    private String posCode;
    private String deptCode;
    private String resdNo;
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
}
