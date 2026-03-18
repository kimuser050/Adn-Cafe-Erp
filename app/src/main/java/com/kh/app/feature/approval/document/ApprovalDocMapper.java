package com.kh.app.feature.approval.document;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ApprovalDocMapper {

    @Select("SELECT SEQ_APPROVAL_DOC.NEXTVAL FROM DUAL")
    String getDocNo();

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
           A.DOC_NO
           , C.CATEGORY_NAME
           , MW.EMP_NAME AS WRITER_NAME
           , WD.DEPT_NAME AS WRITER_DEPT
           , RD.DEPT_NAME AS REFERENCE_DEPT
           , A.TITLE
           , MA.EMP_NAME AS APPROVER_NAME
           , A.STATUS_CODE AS STATUS_CODE
           , DS.STATUS_NAME AS STATUS_NAME
           , A.SUBMITTED_AT
           , A.ACTED_AT
        FROM APPROVAL_DOC A 
        LEFT JOIN APPROVAL_CATEGORY C ON (A.CATEGORY_NO = C.CATEGORY_NO)
        LEFT JOIN APPROVAL_DOC_STATUS DS ON (DS.STATUS_CODE = A.STATUS_CODE)
        LEFT JOIN MEMBER MW ON (MW.EMP_NO = A.WRITER_NO)
        LEFT JOIN MEMBER MA ON (MA.EMP_NO = A.APPROVER_NO)
        LEFT JOIN DEPT RD ON (A.DEPT_CODE = RD.DEPT_CODE)
        LEFT JOIN DEPT WD ON (WD.DEPT_CODE = MW.DEPT_CODE)
        WHERE A.DEL_YN = 'N'
        ORDER BY A.DOC_NO DESC     
    
    """)
    List<ApprovalDocVo> selectMyDocumentList(ApprovalDocVo vo);

    @Select("""
        A.DOC_NO
           , C.CATEGORY_NAME
           , MW.EMP_NAME AS WRITER_NAME
           , WD.DEPT_NAME AS WRITER_DEPT
           , RD.DEPT_NAME AS REFERENCE_DEPT
           , A.TITLE
           , MA.EMP_NAME AS APPROVER_NAME
           , A.STATUS_CODE AS STATUS_CODE
           , DS.STATUS_NAME AS STATUS_NAME
           , A.SUBMITTED_AT
           , A.ACTED_AT
        FROM APPROVAL_DOC A 
        LEFT JOIN APPROVAL_CATEGORY C ON (A.CATEGORY_NO = C.CATEGORY_NO)
        LEFT JOIN APPROVAL_DOC_STATUS DS ON (DS.STATUS_CODE = A.STATUS_CODE)
        LEFT JOIN MEMBER MW ON (MW.EMP_NO = A.WRITER_NO)
        LEFT JOIN MEMBER MA ON (MA.EMP_NO = A.APPROVER_NO)
        LEFT JOIN DEPT RD ON (A.DEPT_CODE = RD.DEPT_CODE)
        LEFT JOIN DEPT WD ON (WD.DEPT_CODE = MW.DEPT_CODE)
        WHERE A.DEL_YN = 'N'
        ORDER BY A.DOC_NO DESC     
    
    """)
    List<ApprovalDocVo> selectApproverDocList(ApprovalDocVo vo);

    @Select("""
        SELECT
            A.DOC_NO
            , C.CATEGORY_NAME
            , MW.EMP_NAME AS WRITER_NAME
            , WD.DEPT_NAME AS WRITER_DEPT
            , RD.DEPT_NAME AS REFERENCE_DEPT
            , A.TITLE
            , A.REASON
            , A.CONTENT
            , MA.EMP_NAME AS APPROVER_NAME
            , DS.STATUS_NAME
            , A.SUBMITTED_AT
            , A.ACTED_AT
            , V.START_DATE
            , V.END_DATE
            , O.WORK_DATE
            , O.WORK_HOUR
        FROM APPROVAL_DOC A 
        LEFT JOIN VACATION_DOC V ON (V.DOC_NO = A.DOC_NO)
        LEFT JOIN OVERTIME_DOC O ON (O.DOC_NO = A.DOC_NO)
        LEFT JOIN APPROVAL_CATEGORY C ON (A.CATEGORY_NO = C.CATEGORY_NO)
        LEFT JOIN APPROVAL_DOC_STATUS DS ON (DS.STATUS_CODE = A.STATUS_CODE)
        LEFT JOIN MEMBER MW ON (MW.EMP_NO = A.WRITER_NO)
        LEFT JOIN MEMBER MA ON (MA.EMP_NO = A.APPROVER_NO)
        LEFT JOIN DEPT RD ON (A.DEPT_CODE = RD.DEPT_CODE)
        LEFT JOIN DEPT WD ON (WD.DEPT_CODE = MW.DEPT_CODE)
        WHERE A.DEL_YN = 'N'
        AND A.DOC_NO = #{docNo}
        ORDER BY A.DOC_NO DESC
    """)
    ApprovalDocVo selectOne(String docNo);



    @Update("""
        UPDATE APPROVAL_DOC
            SET
                DEPT_CODE = #{deptCode}
                , TITLE = #{title}
                , REASON = #{reason}
                , CONTENT = #{content}
                , APPROVER_NO = #{approverNo}
                , SUBMITTED_AT = SYSDATE
            WHERE STATUS_CODE = 1
            AND WRITER_NO = #{writerNo}
            AND DEL_YN = 'N'
                
    """)
    int editDocument(ApprovalDocVo vo);

    @Update("""
        UPDATE APPROVAL_DOC
            SET
                STATUS_CODE = #{statusCode}
                ,ACTED_AT = SYSDATE
                ,APPROVER_COMMENT = #{approverComment}
            WHERE DOC_NO = #{docNo}
            AND APPROVER_NO = #{approverNo}
            AND DEL_YN = 'N'
    """)
    int processApproval(ApprovalDocVo vo);

    @Delete("""
        DELETE FROM APPROVAL_DOC
        WHERE WRITER_NO = #{writerNo}
        AND DOC_NO = #{docNo}
    """)
    int deleteDoc(ApprovalDocVo vo);

    @Delete("""
        DELETE FROM VACATION_DOC
        WHERE DOC_NO = #{docNo}
    """)
    int deleteVacationDoc(String docNo);

    @Delete("""
        DELETE FROM OVERTIME_DOC
        WHERE DOC_NO = #{docNo}
    """)
    int deleteOvertimeDoc(String docNo);

    @Select("""
        <script>
        SELECT
           A.DOC_NO
           , C.CATEGORY_NAME
           , MW.EMP_NAME AS WRITER_NAME
           , WD.DEPT_NAME AS WRITER_DEPT
           , RD.DEPT_NAME AS REFERENCE_DEPT
           , A.TITLE
           , MA.EMP_NAME AS APPROVER_NAME
           , A.STATUS_CODE AS STATUS_CODE
           , DS.STATUS_NAME AS STATUS_NAME
           , A.SUBMITTED_AT
           , A.ACTED_AT
        FROM APPROVAL_DOC A 
        LEFT JOIN APPROVAL_CATEGORY C ON (A.CATEGORY_NO = C.CATEGORY_NO)
        LEFT JOIN APPROVAL_DOC_STATUS DS ON (DS.STATUS_CODE = A.STATUS_CODE)
        LEFT JOIN MEMBER MW ON (MW.EMP_NO = A.WRITER_NO)
        LEFT JOIN MEMBER MA ON (MA.EMP_NO = A.APPROVER_NO)
        LEFT JOIN DEPT RD ON (A.DEPT_CODE = RD.DEPT_CODE)
        LEFT JOIN DEPT WD ON (WD.DEPT_CODE = MW.DEPT_CODE)
        WHERE A.DEL_YN = 'N'
        
        <if test="statusCode != null and statusCode != ''">
            AND A.STATUS_CODE = #{statusCode}
        </if>
    
        <if test="categoryNo != null and categoryNo != ''">
            AND A.CATEGORY_NO = #{categoryNo}
        </if>
        
        <if test="docNo != null and docNo != ''">
            AND A.DOC_NO = #{docNo}
        </if>
        
        <if test="startDate != null and startDate != ''">
            AND SUBMITTED_AT >= TO_DATE(#{startDate}, 'YYYY-MM-DD')
        </if>
        
        <if test="endDate != null and endDate != ''">
            AND SUBMITTED_AT &lt;= TO_DATE(#{endDate}, 'YYYY-MM-DD') + 1
        </if>
        
        ORDER BY A.DOC_NO DESC
        </script>
    """)
    List<ApprovalDocVo> searchDoc(ApprovalDocVo vo);
}
