package com.kh.app.feature.user.qna.answerComment;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AnswerCommentMapper {

    @Insert("""
        INSERT INTO QNA_ANSWER_COMMENT
        (
            REPLY_NO,
            WRITER_NO,
            COMMENT_CONTENT
        )
        VALUES
        (
            #{replyNo},
            #{writerNo},
            #{commentContent}
        )
    """)
    int insert(AnswerCommentVo vo);

    @Select("""
        SELECT
            COMMENT_NO,
            REPLY_NO,
            WRITER_NO,
            COMMENT_CONTENT,
            CREATED_AT,
            UPDATED_AT,
            DEL_YN
        FROM QNA_ANSWER_COMMENT
        WHERE REPLY_NO = #{replyNo}
          AND DEL_YN = 'N'
        ORDER BY CREATED_AT ASC
    """)
    List<AnswerCommentVo> selectList(@Param("replyNo") String replyNo);

    @Update("""
        UPDATE QNA_ANSWER_COMMENT
        SET DEL_YN = 'Y',
            UPDATED_AT = SYSDATE
        WHERE COMMENT_NO = #{commentNo}
          AND WRITER_NO = #{writerNo}
          AND DEL_YN = 'N'
    """)
    int delete(AnswerCommentVo vo);

    @Update("""
        UPDATE QNA_ANSWER_COMMENT
        SET COMMENT_CONTENT = #{commentContent},
            UPDATED_AT = SYSDATE
        WHERE COMMENT_NO = #{commentNo}
          AND WRITER_NO = #{writerNo}
          AND DEL_YN = 'N'
    """)
    int update(AnswerCommentVo vo);
}
