package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class AttVo {
    private String attNo;
    private String statusCode;
    private String empNo;
    private String workDate;
    private String checkInAt;
    private String checkOutAt;
    private String attNote;
    private String otApprovedHours;
    private String otConfirmedHours;
    private String createdAt;
    private String updatedAt;
}
