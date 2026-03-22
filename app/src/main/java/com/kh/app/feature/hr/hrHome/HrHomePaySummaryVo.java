package com.kh.app.feature.hr.hrHome;

import lombok.Data;

@Data
public class HrHomePaySummaryVo {
    private String payMonth;          // 예: 2026-03
    private long totalNetAmount;      // 이번 달 총 지급예정액
    private int targetCount;          // 지급대상 인원
    private int confirmedCount;       // 확정 인원
    private int unconfirmedCount;     // 미확정 인원
    private int confirmRate;          // 확정률
}
