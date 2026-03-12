package com.kh.app.feature.user.notice;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

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

    @Select("""
                SELECT COUNT(*)
                FROM NOTICE
                WHERE DEL_YN = 'N'
            """)
    int selectCount();


    @Select("""
            SELECT
                NOTICE_NO
                ,WRITER_NO
                ,TITLE
                ,CONTENT
                ,HIT
                ,CREATED_AT
                ,UPDATED_AT
                ,DEL_YN
            FROM NOTICE
            WHERE DEL_YN = 'N'
            ORDER BY  NOTICE_NO DESC
            OFFSET #{offset} ROWS FETCH NEXT #{boardLimit} ROWS ONLY
            """)
    List<NoticeVo> selectList(PageVo pvo);


}
