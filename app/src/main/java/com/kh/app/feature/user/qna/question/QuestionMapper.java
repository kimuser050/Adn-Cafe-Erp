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
}
