package com.kh.app.feature.user.notice;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface NoticeMappper {


    @Insert("""
                INSERT INTO NOTICE
                (
                    TITLE
                    ,CONTENT
                    ,WRITER_NO
                )
                VALUES
                (
                    #{title}
                    ,#{content}
                    ,#{writerNo}
                )
            """)
    int insert(NoticeVo vo);


}
