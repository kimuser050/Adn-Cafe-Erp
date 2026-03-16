package com.kh.app.feature.user.qna.question;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

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

    @Select("""
                SELECT COUNT(*)
                FROM QNA_QUESTION
                WHERE DEL_YN = 'N'
            """)
    int selectCount();



    @Select("""
            SELECT
                Q.INQUIRY_NO
                ,Q.WRITER_NO
                ,M.EMP_NAME AS WRITER_NAME
                ,Q.TITLE
                ,Q.CONTENT
                ,Q.TYPE_CODE
                ,Q.SECRET_YN
                ,Q.CREATED_AT
                ,Q.DEL_YN
                ,Q.ANSWER_YN
            FROM QNA_QUESTION Q
            JOIN MEMBER M ON (Q.WRITER_NO = M.EMP_NO)
            WHERE Q.DEL_YN = 'N'
            ORDER BY Q.INQUIRY_NO DESC
            OFFSET #{offset} ROWS FETCH NEXT #{boardLimit} ROWS ONLY
        """)
    List<QuestionVo> selectList(PageVo pvo);
}
