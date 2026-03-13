package com.kh.app.feature.user.notice;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

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


    @Insert("""
            INSERT INTO NOTICE_FILE
                (
                FILE_NO
                ,NOTICE_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,FILE_PATH
                )
                VALUES
                (
                SEQ_NOTICE_FILE.NEXTVAL
                ,#{noticeNo}
                ,#{originName}
                ,#{changeName}
                ,#{filePath}
                )
            """)
    void insertFile(NoticeFileVo fvo);


    @Update("""
                UPDATE NOTICE
                SET
                    HIT = HIT + 1
                WHERE NOTICE_NO = #{noticeNo}
                AND DEL_YN = 'N'
            """)
    int increaseHit( String noticeNo);

    @Select("""
                SELECT
                    N.NOTICE_NO
                    ,N.WRITER_NO
                    ,M.EMP_NAME AS WRITER_NAME
                    ,N.TITLE
                    ,N.CONTENT
                    ,N.HIT
                    ,N.CREATED_AT
                    ,N.UPDATED_AT
                    ,N.DEL_YN
                FROM NOTICE N
                JOIN MEMBER M ON (N.WRITER_NO = M.EMP_NO)
                WHERE N.NOTICE_NO = #{noticeNo} 
                AND N.DEL_YN = 'N'
            """)
    NoticeVo selectOne(@Param("noticeNo") String noticeNo );



    @Update("""
                UPDATE NOTICE
                SET
                    TITLE = #{title}
                    , CONTENT = #{content}
                    , UPDATED_AT = SYSDATE
                WHERE NOTICE_NO = #{noticeNo}
                AND WRITER_NO = #{writerNo}
                AND DEL_YN = 'N'
            """)
    int updateByNo(NoticeVo vo);
    @Delete("""
        DELETE FROM NOTICE_FILE
        WHERE NOTICE_NO = #{noticeNo}
        """)
    int deleteFile(String noticeNo);


}
