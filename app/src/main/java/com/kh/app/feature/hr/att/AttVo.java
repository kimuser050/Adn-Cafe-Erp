package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class AttVo {

    // 근태 번호 PK
    private String attNo;
    // 상태 코드
    // 1 출근 / 2 지각 / 3 결근 / 4 휴가 / null 미확정
    private String statusCode;
    // 사원 번호
    private String empNo;
    // 근무 날짜
    private String workDate;
    // 출근 시간
    private String checkInAt;
    // 퇴근 시간
    private String checkOutAt;
    // 비고
    private String attNote;
    // 승인된 OT 시간
    private Integer otApprovedHours;
    // 실제 인정된 OT 시간
    private Integer otConfirmedHours;
    // 생성일시
    private String createdAt;
    // 수정일시
    private String updatedAt;
}