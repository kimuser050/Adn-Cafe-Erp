package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class ApprovedOvertimeVo {
    // 문서번호
    private String docNo;
    // 결재 작성자 = 연장근무 신청 사원번호
    private String writerNo;
    // 연장근무 대상 날짜
    private String workDate;
    // 신청 시간 (2 or 4)
    private String workHour;
}