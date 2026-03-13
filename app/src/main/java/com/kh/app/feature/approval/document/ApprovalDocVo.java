package com.kh.app.feature.approval.document;

import lombok.Data;

@Data
public class ApprovalDocVo {
    private String docNo;
    private String categoryNo;
    private String writerNo;
    private String deptCode;
    private String title;
    private String reason;
    private String content;
    private String approverNo;
    private String statusCode;
    private String submittedAt;
    private String actedAt;
    private String approverComment;
    private String updatedAt;
    private String delYn;
    private String workDate;
    private String workHour;
    private String startDate;
    private String endDate;
}
