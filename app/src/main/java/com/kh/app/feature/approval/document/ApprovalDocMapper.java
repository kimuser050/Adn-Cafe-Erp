package com.kh.app.feature.approval.document;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ApprovalDocMapper {
    @Insert("""
         INSERT INTO APPROVAL_DOC
             (
                 CATEGORY_NO
                 , WRITER_NO
                 , DEPT_CODE
                 , TITLE
                 , REASON
                 , CONTENT
                 , APPROVER_NO
                 , STATUS_CODE
             )
             VALUES
             (
                 #{categoryNo}
                 ,#{writerNo}
                 ,#{deptCode}
                 ,#{title}
                 ,#{reason}
                 ,#{content}
                 ,#{approverNo}
                 ,#{statusCode}
             )       
    """)
    int write(ApprovalDocVo vo);

    @Select("""
        SELECT
            DOC_NO
            ,CATEGORY_NO
            , WRITER_NO
            , DEPT_CODE
            , TITLE
            , REASON
            , CONTENT
            , APPROVER_NO
            , STATUS_CODE
        FROM APPROVAL_DOC
        WHERE DEL_YN = 'N'
        ORDER BY DOC_NO DESC     
    
    """)
    List<ApprovalDocVo> selectDocList(ApprovalDocVo vo);
}
