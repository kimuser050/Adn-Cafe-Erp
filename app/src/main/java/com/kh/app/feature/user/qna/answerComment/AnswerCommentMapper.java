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
                    C.COMMENT_NO,
                    C.REPLY_NO,
                    C.WRITER_NO,
                    M.EMP_NAME AS writerName,  -- 이름을 가져오기 위해 JOIN 추가
                    C.COMMENT_CONTENT,
                    C.CREATED_AT,
                    C.UPDATED_AT,
                    C.DEL_YN
                FROM QNA_ANSWER_COMMENT C
                JOIN MEMBER M ON C.WRITER_NO = M.EMP_NO  -- 작성자 정보 조인
                WHERE C.REPLY_NO = #{replyNo}
                  AND C.DEL_YN = 'N'
                ORDER BY C.CREATED_AT ASC
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
