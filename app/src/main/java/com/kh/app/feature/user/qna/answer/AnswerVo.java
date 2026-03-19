package com.kh.app.feature.user.qna.answer;

import lombok.Data;

import java.util.List;

@Data
public class AnswerVo {

    private String replyNo;
    private String inquiryNo;
    private String writerNo;
    private String writerName;
    private String questionWriterName;
    private String questionTitle;
    private String response;
    private String responseAt;
    private String updatedAt;
    private String delYn;
    private List<AnswerFileVo> fileList;


}
