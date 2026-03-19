package com.kh.app.feature.user.qna.question;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

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
            <script>
            SELECT COUNT(*)
            FROM QNA_QUESTION Q
            JOIN MEMBER M ON (Q.WRITER_NO = M.EMP_NO)
            WHERE Q.DEL_YN = 'N'
            <if test="searchType == 'title'">
                AND Q.TITLE LIKE '%' || #{searchKeyword} || '%'
            </if>
            <if test="searchType == 'writer'">
                AND M.EMP_NAME LIKE '%' || #{searchKeyword} || '%'
            </if>
            </script>
        """)
    int selectCount(@Param("searchType") String searchType, @Param("searchKeyword") String searchKeyword);



    @Select("""
        <script>
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
        <if test="searchType == 'title'">
            AND Q.TITLE LIKE '%' || #{searchKeyword} || '%'
        </if>
        <if test="searchType == 'writer'">
            AND M.EMP_NAME LIKE '%' || #{searchKeyword} || '%'
        </if>
        ORDER BY Q.INQUIRY_NO DESC
        OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
        </script>
    """)
    List<QuestionVo> selectList(@Param("pvo") PageVo pvo, @Param("searchType") String searchType, @Param("searchKeyword") String searchKeyword);




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
        ,Q.ANSWER_YN
    FROM QNA_QUESTION Q
    JOIN MEMBER M ON (Q.WRITER_NO = M.EMP_NO)
    WHERE Q.INQUIRY_NO = #{no}
    AND Q.DEL_YN = 'N'
""")
    QuestionVo selectOne(String no);


    @Select("""
    SELECT
        FILE_NO
        ,INQUIRY_NO
        ,ORIGIN_NAME
        ,CHANGE_NAME
        ,FILE_PATH
    FROM QNA_QUESTION_FILE
    WHERE INQUIRY_NO = #{no}
    AND DEL_YN = 'N'
    """)
    List<QuestionFileVo> selectFileList(String no);




    @Update("""
            UPDATE QNA_QUESTION
                    SET DEL_YN = 'Y'
                    WHERE INQUIRY_NO = #{inquiryNo}
                    AND WRITER_NO = #{writerNo}
            """)
    int deleteByNo(QuestionVo vo);


    @Update("""
             UPDATE QNA_QUESTION_FILE
                    SET DEL_YN = 'Y'
                    WHERE INQUIRY_NO = #{inquiryNo}
            """)
    void deleteFile(String inquiryNo);
}



