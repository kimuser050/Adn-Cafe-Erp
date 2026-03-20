package com.kh.app.feature.hr.att;

import lombok.Data;

@Data
public class AttDetailVo {

    // 근태 번호
    private String attNo;
    // 날짜
    private String workDate;
    // 상태코드
    private String statusCode;
    // 상태명
    // ex) 출근, 지각, 결근, 휴가
    // statusCode가 null이면 statusName도 null 가능
    private String statusName;
    // 출근시간
    private String checkInAt;
    // 퇴근시간
    private String checkOutAt;
    // 신청 OT 시간
    private Integer otApprovedHours;
    // 인정 OT 시간
    private Integer otConfirmedHours;
    // 비고
    private String attNote;
}