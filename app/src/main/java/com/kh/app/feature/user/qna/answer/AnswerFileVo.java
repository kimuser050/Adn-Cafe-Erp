package com.kh.app.feature.user.qna.answer;

import lombok.Data;

@Data
public class AnswerFileVo {

    private String fileNo;
    private String replyNo;
    private String originName;
    private String changeName;
    private String filePath;
    private String uploadDate;
    private String delYn;
}
