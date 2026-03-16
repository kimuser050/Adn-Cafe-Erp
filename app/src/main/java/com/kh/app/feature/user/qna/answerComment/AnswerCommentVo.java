package com.kh.app.feature.user.qna.answerComment;

import lombok.Data;

@Data
public class AnswerCommentVo {
    private String commentNo;
    private String replyNo;
    private String writerNo;
    private String writerName;
    private String commentContent;
    private String createdAt;
    private String updatedAt;
    private String delYn;


}
