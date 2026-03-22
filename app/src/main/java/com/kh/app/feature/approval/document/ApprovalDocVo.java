package com.kh.app.feature.approval.document;

import lombok.Data;

@Data
public class ApprovalDocVo {
    private String docNo;
    private String categoryNo;
    private String writerNo;
    private String deptCode;
    private String title;
    private String content;
    private String approverNo;
    private String statusCode;
    private String submittedAt;
    private String actedAt;
    private String approverComment;
    private String updatedAt;
    private String delYn;
    // 조회 전용 필드
    private String workDate;
    private String workHour;
    private String startDate;
    private String endDate;
    private String categoryName;
    private String writerName;
    private String approverName;
    private String referenceDept;
    private String writerDept;
    private String statusName;
    // 상세조회 전용 필드
    private String writerPosition;
    private String approverPosition;
    private String attachmentName;
    private boolean canEdit;
    private boolean canApprove;
}
