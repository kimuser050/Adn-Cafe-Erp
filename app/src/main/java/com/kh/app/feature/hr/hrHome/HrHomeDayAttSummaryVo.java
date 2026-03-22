package com.kh.app.feature.hr.hrHome;

import lombok.Data;

@Data
public class HrHomeDayAttSummaryVo {
    private String baseDate;          // 예: 2026-03-21
    private int totalEmpCount;        // 전체 직원 수
    private int presentCount;         // 출근
    private int lateCount;            // 지각
    private int absentCount;          // 결근
    private int vacationCount;        // 휴가
    private int overtimeCount;        // 연장근무
    private int normalCount;          // 정상근태 인원 수
    private double normalRate;        // 정상률
}
