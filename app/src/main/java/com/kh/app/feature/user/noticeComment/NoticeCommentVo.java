package com.kh.app.feature.user.noticeComment;

import lombok.Data;

@Data
public class NoticeCommentVo {

    private String commentNo;
    private String noticeNo;
    private String writerNo;
    private String writerName;
    private String commentContent;
    private String createdAt;
    private String updatedAt;
    private String delYn;



}

