package com.kh.app.feature.user.qna.question;

import lombok.Data;

@Data
public class QuestionVo {

    private String inquiryNo;
    private String writerNo;
    private String writerName;
    private String title;
    private String content;
    private String typeCode;
    private String secretYn;
    private String createdAt;
    private String delYn;
    private String answerYn;


}
