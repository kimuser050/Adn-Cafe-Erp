package com.kh.app.feature.approval.document;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ApprovalDocMapper {
    @Insert("""
         INSERT INTO APPROVAL_DOC
             (
                 DOC_NO
                 , CATEGORY_NO
                 , WRITER_NO
                 , DEPT_CODE
                 , TITLE
                 , REASON
                 , CONTENT
                 , APPROVER_NO
             )
             VALUES
             (
                 #{docNo}
                 ,#{categoryNo}
                 ,#{writerNo}
                 ,#{deptCode}
                 ,#{title}
                 ,#{reason}
                 ,#{content}
                 ,#{approverNo}
             )       
    """)
    int insertApprovalDoc(ApprovalDocVo vo);

    @Insert("""
         INSERT INTO VACATION_DOC
             (
                 DOC_NO
                 , START_DATE
                 , END_DATE
             )
             VALUES
             (
                 #{docNo}
                 ,#{startDate}
                 ,#{endDate}
             )
    """)
    int insertVacationDoc(ApprovalDocVo vo);

    @Insert("""
         INSERT INTO OVERTIME_DOC
             (
                 DOC_NO
                 , WORK_DATE
                 , WORK_HOUR
             )
             VALUES
             (  
                 #{docNo}
                 ,#{workDate}
                 ,#{workHour}
             )
    """)
    int insertOvertimeDoc(ApprovalDocVo vo);
    @Select("""
        SELECT
            DOC_NO
            , CATEGORY_NO
            , WRITER_NO
            , DEPT_CODE
            , TITLE
            , REASON
            , CONTENT
            , APPROVER_NO
            , STATUS_CODE
            , SUBMITTED_AT
            , ACTED_AT
        FROM APPROVAL_DOC
        WHERE DEL_YN = 'N'
        ORDER BY DOC_NO DESC     
    
    """)
    List<ApprovalDocVo> selectDocList(ApprovalDocVo vo);

    @Select("""
        SELECT
            A.DOC_NO
            ,A.CATEGORY_NO
            , A.WRITER_NO
            , A.DEPT_CODE
            , A.TITLE
            , A.REASON
            , A.CONTENT
            , A.APPROVER_NO
            , A.STATUS_CODE
            , A.SUBMITTED_AT
            , A.ACTED_AT
            , V.START_DATE
            , V.END_DATE
            , O.WORK_DATE
            , O.WORK_HOUR
        FROM APPROVAL_DOC A  
        LEFT JOIN VACATION_DOC V ON (V.DOC_NO = A.DOC_NO)
        LEFT JOIN OVERTIME_DOC O ON (O.DOC_NO = A.DOC_NO)
        WHERE A.DOC_NO = #{docNo} 
        AND A.DEL_YN = 'N'
    
    """)
    ApprovalDocVo selectOne(String docNo);


    @Select("SELECT SEQ_APPROVAL_DOC.NEXTVAL FROM DUAL")
    String getDocNo();
}
