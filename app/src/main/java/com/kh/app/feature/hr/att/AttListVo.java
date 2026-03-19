package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class AttListVo {
    private String empNo;
    private String empName;
    private String posName;
    private String deptName;

    private String attCount;
    private String lateCount;
    private String absentCount;
    private String vacationCount;
    private String otHours;
}
