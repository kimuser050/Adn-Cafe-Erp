package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class AttSummaryVo {

    // 출근 수
    private int attendanceCount;
    // 지각 수
    private int lateCount;
    // 결근 수
    private int absentCount;
    // 휴가 수
    private int vacationCount;
    // 인정 OT 시간 합계
    private int otHours;
}