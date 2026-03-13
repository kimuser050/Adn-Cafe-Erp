package com.kh.app.feature.user.noticeComment;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

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
}

