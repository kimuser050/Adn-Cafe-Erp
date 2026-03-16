package com.kh.app.feature.user.qna.answer;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

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
}

