package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class AttSummaryVo {
    private String attendanceCount;
    private String lateCount;
    private String absentCount;
    private String vacationCount;
    private String otHours;
}
