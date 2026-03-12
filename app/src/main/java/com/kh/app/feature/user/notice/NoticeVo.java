package com.kh.app.feature.user.notice;

import lombok.Data;

@Data
public class NoticeVo {
    private  String noticeNo;
    private  String writerNo;
    private  String title;
    private  String content;
    private  String hit;
    private  String createdAt;
    private  String updatedAt;
    private  String delYn;
}
