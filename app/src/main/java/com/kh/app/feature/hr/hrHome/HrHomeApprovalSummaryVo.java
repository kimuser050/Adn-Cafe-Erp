package com.kh.app.feature.hr.hrHome;

import lombok.Data;

@Data
public class HrHomeApprovalSummaryVo {
    private String baseDate;              // 기준일: 전날
    private int approvedVacationCount;    // 전날 승인된 휴가 건수
    private int approvedOvertimeCount;    // 전날 승인된 연장근무 건수
}
