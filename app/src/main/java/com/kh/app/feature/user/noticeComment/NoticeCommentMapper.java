package com.kh.app.feature.user.noticeComment;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface NoticeCommentMapper {


    @Insert("""
            INSERT INTO NOTICE_COMMENT
            (
            COMMENT_CONTENT
            ,NOTICE_NO
            ,WRITER_NO
            )
            VALUES
            (
            #{commentContent}
            ,#{noticeNo}
            ,#{writerNo}
            )
            """)
    int insert(NoticeCommentVo vo);

    @Select("""
            SELECT 
                C.COMMENT_NO
                ,C.COMMENT_CONTENT
                ,C.NOTICE_NO
                ,C.WRITER_NO
                ,M.EMP_NAME WRITER_NAME
                ,C.CREATED_AT
            FROM NOTICE_COMMENT C
            JOIN MEMBER M ON (M.EMP_NO = C.WRITER_NO)
            WHERE C.NOTICE_NO = #{noticeNo}
            AND C.DEL_YN = 'N'
            ORDER BY C.COMMENT_NO DESC
            
            """)
    List<NoticeCommentVo> selectList(String noticeNo);

    @Update("""
                UPDATE NOTICE_COMMENT
                    SET DEL_YN = 'Y'
                WHERE COMMENT_NO = #{commentNo}
                AND WRITER_NO = #{writerNo}
            """)
    int del(NoticeCommentVo vo);

    @Update("""
            UPDATE NOTICE_COMMENT
            SET COMMENT_CONTENT = #{commentContent}
            , UPDATED_AT = SYSDATE
            WHERE COMMENT_NO = #{commentNo}
            AND WRITER_NO = #{writerNo}
            """)
    int update(NoticeCommentVo vo);


}

