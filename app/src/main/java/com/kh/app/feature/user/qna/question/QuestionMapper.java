package com.kh.app.feature.user.qna.question;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface QuestionMapper {

    @Insert("""
            INSERT INTO QNA_QUESTION
            (
                WRITER_NO
                ,TITLE
                ,CONTENT
                ,TYPE_CODE
            )
            VALUES
            (
                #{writerNo}
                ,#{title}
                ,#{content}
                ,#{typeCode}
            )
            
            """)
    int insert(QuestionVo vo);


    @Insert("""
        INSERT INTO QNA_QUESTION_FILE
        (
            INQUIRY_NO,
            ORIGIN_NAME,
            CHANGE_NAME,
            FILE_PATH
        )
        VALUES
        (
            SEQ_QNA_QUESTION.CURRVAL,
            #{originName},
            #{changeName},
            #{filePath}
        )
        """)
    int insertFile(QuestionFileVo vo);
}
