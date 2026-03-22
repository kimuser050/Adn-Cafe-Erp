package com.kh.app.feature.hr.hrHome;

import lombok.Data;

import java.util.List;

@Data
public class HrHomeIssueVo {
    private String empNo;
    private String empName;
    private String deptName;
    private String posName;
    private String profileImg;

    private String hisDate;       // 인사이력 날짜
    private String hisEvent;      // 입사 / 퇴사 / 부서이동 / 직급변경
    private String hisContent;    // 상세내용
}
