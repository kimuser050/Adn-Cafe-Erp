package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class ApprovedVacationVo {
    // 문서번호
    private String docNo;
    // 결재 작성자 = 휴가 신청 사원번호
    private String writerNo;
    // 휴가 시작일
    private String startDate;
    // 휴가 종료일
    private String endDate;
}