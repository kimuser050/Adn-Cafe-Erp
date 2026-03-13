package com.kh.app.feature.hr.dept;

import lombok.Data;

@Data
public class DeptVo {

    private String deptCode;
    private String deptName;
    private String deptAddress;
    private String managerEmpNo;
    private String managerName; // MEMBER 조인 조회값
    private String useYn;
    private String createdAt;
    private String updatedAt;
    private int memberCount;      // 상세조회 시 service에서 세팅


}
