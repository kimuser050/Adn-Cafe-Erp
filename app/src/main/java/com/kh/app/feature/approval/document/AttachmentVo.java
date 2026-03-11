package com.kh.app.feature.approval.document;

import lombok.Data;

@Data
public class AttachmentVo {
    private String attachNo;
    private String docNo;
    private String fileOriginName;
    private String fileChangeName;
    private String filePath;
}
