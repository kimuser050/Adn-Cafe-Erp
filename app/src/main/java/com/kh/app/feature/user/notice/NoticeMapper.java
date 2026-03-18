package com.kh.app.feature.user.notice;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoticeMapper {


    @Insert("""
                INSERT INTO NOTICE
                (
                    TITLE
                    ,CONTENT
                    ,WRITER_NO
                    ,CATEGORY
                )
                VALUES
                (
                    #{title}
                    ,#{content}
                    ,#{writerNo}
                    ,#{category}
                )
            """)
    int insert(NoticeVo vo);


    @Select("""
            <script>
            SELECT COUNT(*)
            FROM NOTICE N
            JOIN MEMBER M ON (N.WRITER_NO = M.EMP_NO)
            WHERE N.DEL_YN = 'N'
            
            <if test="searchValue != null and searchValue != ''">
                <choose>
                    <when test="searchType == 'title'">
                        AND N.TITLE LIKE '%' || #{searchValue} || '%'
                    </when>
                    <when test="searchType == 'writer'">
                        AND M.EMP_NAME LIKE '%' || #{searchValue} || '%'
                    </when>
                </choose>
            </if>
            
            </script>
            """)
    int selectCount(@Param("searchType") String searchType,
                    @Param("searchValue") String searchValue);


    @Select("""
            <script>
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
                ,N.CATEGORY
            FROM NOTICE N
            JOIN MEMBER M ON (N.WRITER_NO = M.EMP_NO)
            WHERE N.DEL_YN = 'N'
            
            <if test="searchValue != null and searchValue != ''">
                <choose>
                    <when test="searchType == 'title'">
                        AND N.TITLE LIKE '%' || #{searchValue} || '%'
                    </when>
                    <when test="searchType == 'writer'">
                        AND M.EMP_NAME LIKE '%' || #{searchValue} || '%'
                    </when>
                </choose>
            </if>
            
            ORDER BY N.NOTICE_NO DESC
            OFFSET #{pvo.offset} ROWS FETCH NEXT #{pvo.boardLimit} ROWS ONLY
            
            </script>
            """)
    List<NoticeVo> selectList(@Param("pvo") PageVo pvo,
                              @Param("searchType") String searchType,
                              @Param("searchValue") String searchValue);


    @Update("""
                UPDATE NOTICE
                SET
                    HIT = HIT + 1
                WHERE NOTICE_NO = #{noticeNo}
                AND DEL_YN = 'N'
            """)
    int increaseHit(String noticeNo);

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
                ,N.CATEGORY
            FROM NOTICE N
            JOIN MEMBER M ON (N.WRITER_NO = M.EMP_NO)
            WHERE N.NOTICE_NO = #{noticeNo}
            AND N.DEL_YN = 'N'
            """)
    NoticeVo selectOne(@Param("noticeNo") String noticeNo);


    @Insert("""
            INSERT INTO NOTICE_FILE
                (
                NOTICE_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,FILE_PATH
                )
                VALUES
                (
                SEQ_NOTICE.CURRVAL 
                ,#{originName}
                ,#{changeName}
                ,#{filePath}
                )
            """)
    void insertFile(NoticeFileVo fvo);

    @Update("""
                UPDATE NOTICE
                        SET
                          TITLE = #{title}
                          , CONTENT = #{content}
                          , CATEGORY = #{category}
                          , UPDATED_AT = SYSDATE
                WHERE NOTICE_NO = #{noticeNo}
                AND WRITER_NO = #{writerNo}
                AND DEL_YN = 'N'
            """)
    int updateByNo(NoticeVo vo);

    @Update("""
                UPDATE NOTICE_FILE
                SET DEL_YN = 'Y'
                WHERE NOTICE_NO = #{noticeNo}
            """)
    int deleteFile(String noticeNo);


    @Update("""
            UPDATE NOTICE
            SET DEL_YN = 'Y'
            WHERE NOTICE_NO = #{noticeNo}
            AND WRITER_NO = #{writerNo}
            """)
    int deleteNotice(NoticeVo vo);


    @Select("""
            SELECT
                FILE_NO
                ,NOTICE_NO
                ,ORIGIN_NAME
                ,CHANGE_NAME
                ,FILE_PATH
            FROM NOTICE_FILE
            WHERE NOTICE_NO = #{noticeNo}
            AND DEL_YN = 'N'
            """)
    List<NoticeFileVo> selectFileListByNoticeNo(String noticeNo);

}
