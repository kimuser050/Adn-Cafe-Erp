package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class AttListVo {

    // 사번
    private String empNo;
    // 이름
    private String empName;
    // 부서명
    private String deptName;
    // 직급명
    private String posName;
    // 월간 출근 횟수
    private int attCount;
    // 월간 지각 횟수
    private int lateCount;
    // 월간 결근 횟수
    private int absentCount;
    // 월간 휴가 횟수
    private int vacationCount;
    // 월간 인정 OT 시간 합계
    private int otHours;
}