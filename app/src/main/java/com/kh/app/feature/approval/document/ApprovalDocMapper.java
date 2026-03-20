package com.kh.app.feature.approval.document;

import com.kh.app.feature.util.PageVo;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface ApprovalDocMapper {

//==========================================================================
    @Select("""
    SELECT
        A.DOC_NO
        , A.TITLE
        , A.CONTENT
        , A.WRITER_NO
        , A.APPROVER_NO
        , A.STATUS_CODE
        , DS.STATUS_NAME
        , TO_CHAR(A.SUBMITTED_AT, 'YYYY-MM-DD') AS SUBMITTED_AT
        , TO_CHAR(A.ACTED_AT, 'YYYY-MM-DD') AS ACTED_AT
        , C.CATEGORY_NAME
        , C.CATEGORY_NO
        , MW.EMP_NAME AS WRITER_NAME
        , WD.DEPT_NAME AS WRITER_DEPT
        , PW.POS_NAME AS WRITER_POSITION
        , MA.EMP_NAME AS APPROVER_NAME
        , PA.POS_NAME AS APPROVER_POSITION
        , RD.DEPT_NAME AS REFERENCE_DEPT
        , TO_CHAR(VD.START_DATE, 'YYYY-MM-DD') AS START_DATE
        , TO_CHAR(VD.END_DATE, 'YYYY-MM-DD') AS END_DATE
        , TO_CHAR(OD.WORK_DATE, 'YYYY-MM-DD') AS WORK_DATE
        , OD.WORK_HOUR
        , A.REASON
        , AA.FILE_ORIGIN_NAME AS ATTACHMENT_NAME
    FROM APPROVAL_DOC A
    LEFT JOIN APPROVAL_CATEGORY C ON A.CATEGORY_NO = C.CATEGORY_NO
    LEFT JOIN APPROVAL_DOC_STATUS DS ON A.STATUS_CODE = DS.STATUS_CODE
    LEFT JOIN MEMBER MW ON A.WRITER_NO = MW.EMP_NO
    LEFT JOIN MEMBER MA ON A.APPROVER_NO = MA.EMP_NO
    LEFT JOIN DEPT WD ON MW.DEPT_CODE = WD.DEPT_CODE
    LEFT JOIN DEPT RD ON A.DEPT_CODE = RD.DEPT_CODE
    LEFT JOIN POSITION PW ON MW.POS_CODE = PW.POS_CODE
    LEFT JOIN POSITION PA ON MA.POS_CODE = PA.POS_CODE
    LEFT JOIN VACATION_DOC VD ON A.DOC_NO = VD.DOC_NO
    LEFT JOIN OVERTIME_DOC OD ON A.DOC_NO = OD.DOC_NO
    LEFT JOIN APPROVAL_ATTACHMENT AA ON A.DOC_NO = AA.DOC_NO
    WHERE A.DEL_YN = 'N'
      AND A.DOC_NO = #{docNo}
""")
    ApprovalDocVo selectDocDetail(String docNo);

    @Update("""
    UPDATE APPROVAL_DOC
    SET STATUS_CODE = 2
        , ACTED_AT = SYSDATE
        , APPROVER_COMMENT = #{approverComment}
    WHERE DOC_NO = #{docNo}
      AND DEL_YN = 'N'
      AND APPROVER_NO = #{loginEmpNo}
""")
    int approveDoc(@Param("docNo") String docNo,
                   @Param("approverComment") String approverComment,
                   @Param("loginEmpNo") String loginEmpNo);

    @Update("""
    UPDATE APPROVAL_DOC
    SET STATUS_CODE = 3
        , ACTED_AT = SYSDATE
        , APPROVER_COMMENT = #{approverComment}
    WHERE DOC_NO = #{docNo}
      AND DEL_YN = 'N'
      AND APPROVER_NO = #{loginEmpNo}
""")
    int rejectDoc(@Param("docNo") String docNo,
                  @Param("approverComment") String approverComment,
                  @Param("loginEmpNo") String loginEmpNo);

    @Update("""
    UPDATE APPROVAL_DOC
    SET DEL_YN = 'Y'
    WHERE DOC_NO = #{docNo}
      AND DEL_YN = 'N'
      AND WRITER_NO = #{loginEmpNo}
""")
    int deleteDoc(@Param("docNo") String docNo ,
                  @Param("loginEmpNo") String loginEmpNo);
//    ==============================================================================

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
        AND A.WRITER_NO = #{loginEmpNo}
        ORDER BY A.DOC_NO DESC    
        OFFSET #{pvo.offset} ROWS
        FETCH NEXT #{pvo.boardLimit} ROWS ONLY 
    
    """)
    List<ApprovalDocVo> selectMyDocumentList(PageVo pvo, @Param("loginEmpNo") String loginEmpNo);

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
        AND A.APPROVER_NO = #{loginEmpNo}
        ORDER BY A.DOC_NO DESC   
        OFFSET #{pvo.offset} ROWS
        FETCH NEXT #{pvo.boardLimit} ROWS ONLY  
    
    """)
    List<ApprovalDocVo> selectApproverDocList(PageVo pvo, @Param("loginEmpNo") String loginEmpNo);

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

//    @Update("""
//        UPDATE APPROVAL_DOC
//            SET
//                STATUS_CODE = #{statusCode}
//                ,ACTED_AT = SYSDATE
//                ,APPROVER_COMMENT = #{approverComment}
//            WHERE DOC_NO = #{docNo}
//            AND APPROVER_NO = #{approverNo}
//            AND DEL_YN = 'N'
//    """)
//    int processApproval(ApprovalDocVo vo);

//    @Delete("""
//        DELETE FROM APPROVAL_DOC
//        WHERE WRITER_NO = #{writerNo}
//        AND DOC_NO = #{docNo}
//    """)
//    int deleteDoc(ApprovalDocVo vo);

//    @Delete("""
//        DELETE FROM VACATION_DOC
//        WHERE DOC_NO = #{docNo}
//    """)
//    int deleteVacationDoc(String docNo);
//
//    @Delete("""
//        DELETE FROM OVERTIME_DOC
//        WHERE DOC_NO = #{docNo}
//    """)
//    int deleteOvertimeDoc(String docNo);

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
        AND WRITER_NO = #{loginEmpNo}
        
        <if test="paramMap.vo.statusCode != null and paramMap.vo.statusCode != ''">
            AND A.STATUS_CODE = #{paramMap.vo.statusCode}
        </if>
    
        <if test="paramMap.vo.categoryNo != null and paramMap.vo.categoryNo != ''">
            AND A.CATEGORY_NO = #{paramMap.vo.categoryNo}
        </if>
        
        <if test="paramMap.vo.docNo != null and paramMap.vo.docNo != ''">
            AND A.DOC_NO = #{paramMap.vo.docNo}
        </if>
        
        <if test="paramMap.vo.startDate != null and paramMap.vo.startDate != ''">
            AND SUBMITTED_AT >= TO_DATE(#{paramMap.vo.startDate}, 'YYYY-MM-DD')
        </if>
        
        <if test="paramMap.vo.endDate != null and paramMap.vo.endDate != ''">
            AND SUBMITTED_AT &lt; TO_DATE(#{paramMap.vo.endDate}, 'YYYY-MM-DD') + 1
        </if>
        
        ORDER BY A.DOC_NO DESC
        OFFSET #{paramMap.pvo.offset} ROWS
        FETCH NEXT #{paramMap.pvo.boardLimit} ROWS ONLY 
        
        </script>
    """)
    List<ApprovalDocVo> searchMyDoc(Map<String, Object> paramMap ,@Param("loginEmpNo")String loginEmpNo);

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
        AND APPROVER_NO = #{loginEmpNo}
        
        <if test="paramMap.vo.statusCode != null and paramMap.vo.statusCode != ''">
            AND A.STATUS_CODE = #{paramMap.vo.statusCode}
        </if>
    
        <if test="paramMap.vo.categoryNo != null and paramMap.vo.categoryNo != ''">
            AND A.CATEGORY_NO = #{paramMap.vo.categoryNo}
        </if>
        
        <if test="paramMap.vo.docNo != null and paramMap.vo.docNo != ''">
            AND A.DOC_NO = #{paramMap.vo.docNo}
        </if>
        
        <if test="paramMap.vo.startDate != null and paramMap.vo.startDate != ''">
            AND SUBMITTED_AT >= TO_DATE(#{paramMap.vo.startDate}, 'YYYY-MM-DD')
        </if>
        
        <if test="paramMap.vo.endDate != null and paramMap.vo.endDate != ''">
            AND SUBMITTED_AT &lt; TO_DATE(#{paramMap.vo.endDate}, 'YYYY-MM-DD') + 1
        </if>
        
        ORDER BY A.DOC_NO DESC
        OFFSET #{paramMap.pvo.offset} ROWS
        FETCH NEXT #{paramMap.pvo.boardLimit} ROWS ONLY 
        
        </script>
    """)
    List<ApprovalDocVo> searchApproverDoc(Map<String, Object> paramMap, @Param("loginEmpNo")String loginEmpNo);

    @Select("""
            SELECT COUNT(DOC_NO)
            FROM APPROVAL_DOC
            WHERE DEL_YN = 'N'
            AND WRITER_NO = #{loginEmpNo}
            """)
    int selectMyDocListCount();

    @Select("""
            SELECT COUNT(DOC_NO)
            FROM APPROVAL_DOC
            WHERE DEL_YN = 'N'
            AND APPROVER_NO = #{loginEmpNo}
            """)
    int selectApproverDocListCount();

    @Select("""
            <script>
            SELECT COUNT(DOC_NO)
            FROM APPROVAL_DOC A
            WHERE DEL_YN = 'N'
            AND APPROVER_NO = #{loginEmpNo}
            <if test="vo.statusCode != null and vo.statusCode != ''">
            AND A.STATUS_CODE = #{vo.statusCode}
            </if>
    
            <if test="vo.categoryNo != null and vo.categoryNo != ''">
                AND A.CATEGORY_NO = #{vo.categoryNo}
            </if>
            
            <if test="vo.docNo != null and vo.docNo != ''">
                AND A.DOC_NO = #{vo.docNo}
            </if>
            
            <if test="vo.startDate != null and vo.startDate != ''">
                AND SUBMITTED_AT >= TO_DATE(#{vo.startDate}, 'YYYY-MM-DD')
            </if>
            
            <if test="vo.endDate != null and vo.endDate != ''">
                AND SUBMITTED_AT &lt; TO_DATE(#{vo.endDate}, 'YYYY-MM-DD') + 1
            </if>
            </script>
            """)
    int searchApproverDocCount(ApprovalDocVo vo , @Param("loginEmpNo") String loginEmpNo);

    @Select("""
            <script>
            SELECT COUNT(DOC_NO)
            FROM APPROVAL_DOC A
            WHERE DEL_YN = 'N'
            AND WRITER_NO = #{loginEmpNo}
            <if test="vo.statusCode != null and vo.statusCode != ''">
            AND A.STATUS_CODE = #{vo.statusCode}
            </if>
    
            <if test="vo.categoryNo != null and vo.categoryNo != ''">
                AND A.CATEGORY_NO = #{vo.categoryNo}
            </if>
            
            <if test="vo.docNo != null and vo.docNo != ''">
                AND A.DOC_NO = #{vo.docNo}
            </if>
            
            <if test="vo.startDate != null and vo.startDate != ''">
                AND SUBMITTED_AT >= TO_DATE(#{vo.startDate}, 'YYYY-MM-DD')
            </if>
            
            <if test="vo.endDate != null and vo.endDate != ''">
                AND SUBMITTED_AT &lt; TO_DATE(#{vo.endDate}, 'YYYY-MM-DD') + 1
            </if>
            </script>
            """)
    int searchMyDocCount(ApprovalDocVo vo , @Param("loginEmpNo") String loginEmpNo);


}
