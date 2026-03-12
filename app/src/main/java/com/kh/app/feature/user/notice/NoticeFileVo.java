package com.kh.app.feature.user.notice;

import lombok.Data;

@Data
public class NoticeFileVo {

    private String fileNo;
    private String noticeNo;
    private String originName;
    private String changeName;
    private String filePath;
    private String uploadDate;
    private String delYn;

}
