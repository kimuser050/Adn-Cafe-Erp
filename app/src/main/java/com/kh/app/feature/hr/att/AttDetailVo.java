package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class AttDetailVo {
    private String attNo;
    private String workDate;
    private String statusCode;
    private String statusName;
    private String checkInAt;
    private String checkOutAt;
    private String otApprovedHours;
    private String otConfirmedHours;
    private String attNote;
}