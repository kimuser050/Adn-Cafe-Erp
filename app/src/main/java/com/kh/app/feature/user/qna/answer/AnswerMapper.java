package com.kh.app.feature.user.qna.answer;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface AnswerMapper {



    @Insert("""
            INSERT INTO QNA_ANSWER
            (
                INQUIRY_NO
                ,WRITER_NO
                ,RESPONSE
            )
            VALUES
            (
                #{inquiryNo}
                ,#{writerNo}
                ,#{response}
            )
            """)
    int insert(AnswerVo vo);

    @Insert("""
        INSERT INTO QNA_ANSWER_FILE
        (
            ANSWER_NO
            ,ORIGIN_NAME
            ,CHANGE_NAME
            ,FILE_PATH
        )
        VALUES
        (
            SEQ_QNA_ANSWER.CURRVAL
            ,#{originName}
            ,#{changeName}
            ,#{filePath}
        )
        """)
    int insertFile(AnswerFileVo vo);


    @Update("""
            UPDATE QNA_QUESTION
                SET ANSWER_YN ='Y'
            WHERE INQUIRY_NO = #{inquiryNo}
            """)
    int updateAnswerYn(String inquiryNo);

    @Select("""
                SELECT COUNT(*)
                FROM QNA_ANSWER
                WHERE DEL_YN = 'N'
            """)
    int selectCount();

    @Select("""
    SELECT
        A.INQUIRY_NO,
        Q.TITLE AS questionTitle,                  -- 문의 제목
        QM.EMP_NAME AS questionWriterName,        -- 문의 작성자 이름
        A.WRITER_NO ,
        AM.EMP_NAME AS writerName,          -- 답변 작성자 이름
        A.RESPONSE,
        A.RESPONSE_AT,
        A.UPDATED_AT
    FROM QNA_ANSWER A
    JOIN QNA_QUESTION Q ON A.INQUIRY_NO = Q.INQUIRY_NO
    JOIN MEMBER QM ON Q.WRITER_NO = QM.EMP_NO   -- 문의 작성자
    JOIN MEMBER AM ON A.WRITER_NO = AM.EMP_NO  -- 답변 작성자
    WHERE A.DEL_YN = 'N'
    ORDER BY A.INQUIRY_NO DESC
    OFFSET #{offset} ROWS FETCH NEXT #{boardLimit} ROWS ONLY
""")
    List<AnswerVo> selectList(PageVo pvo);

    @Select("""
        SELECT
            A.INQUIRY_NO,
            Q.TITLE AS questionTitle,
            QM.EMP_NAME AS questionWriterName,
            A.WRITER_NO,
            AM.EMP_NAME AS writerName,
            A.RESPONSE,
            A.RESPONSE_AT,
            A.UPDATED_AT,
            A.DEL_YN
        FROM QNA_ANSWER A
        JOIN QNA_QUESTION Q ON A.INQUIRY_NO = Q.INQUIRY_NO
        JOIN MEMBER QM ON Q.WRITER_NO = QM.EMP_NO
        JOIN MEMBER AM ON A.WRITER_NO = AM.EMP_NO
        WHERE A.INQUIRY_NO = #{inquiryNo}
          AND A.DEL_YN = 'N'
    """)
    AnswerVo selectOne(String inquiryNo);

    // 해당 답변 첨부파일 목록 조회
    @Select("""
        SELECT
            FILE_NO,
            REPLY_NO,
            ORIGIN_NAME,
            CHANGE_NAME,
            FILE_PATH
        FROM QNA_ANSWER_FILE
        WHERE REPLY_NO = #{replyNo}
          AND DEL_YN = 'N'
        ORDER BY FILE_NO ASC
    """)
    List<AnswerFileVo> selectFileList(String inquiryNo);

    // 답변 수정
    @Update("""
        UPDATE QNA_ANSWER
        SET RESPONSE = #{response},
            UPDATED_AT = SYSDATE
        WHERE REPLY_NO = #{replyNo}
          AND WRITER_NO = #{writerNo}
          AND DEL_YN = 'N'
    """)
    int updateByNo(AnswerVo vo);

    // 기존 파일 삭제
    @Update("""
        UPDATE QNA_ANSWER_FILE
        SET DEL_YN = 'Y'
        WHERE REPLY_NO = #{replyNo}
    """)
    int deleteFile(String replyNo);

    // 답변 삭제
    @Update("""
        UPDATE QNA_ANSWER
        SET DEL_YN = 'Y'
        WHERE REPLY_NO = #{replyNo}
          AND WRITER_NO = #{writerNo}
          AND DEL_YN = 'N'
    """)
    int deleteByNo(AnswerVo vo);

}

