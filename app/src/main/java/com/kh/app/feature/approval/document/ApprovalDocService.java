package com.kh.app.feature.approval.document;

import com.kh.app.feature.hr.att.AttService;
import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ApprovalDocService {

    private final ApprovalDocMapper approvalDocMapper;
    private final AttService attService;


    @Transactional
    public int insert(ApprovalDocVo vo)
    {
        String docNo = approvalDocMapper.getDocNo();
        vo.setDocNo(docNo);

        int result1 = approvalDocMapper.insertApprovalDoc(vo);
        if(result1 != 1){
            throw new IllegalStateException("공통 문서 등록 실패");
        }

        if("1".equals(vo.getCategoryNo())) {
            int result2 = approvalDocMapper.insertVacationDoc(vo);
            if(result2 != 1){
                throw new IllegalStateException("휴가 상세 등록 실패");
            }
        }
        else if("2".equals(vo.getCategoryNo())) {
            int result2 = approvalDocMapper.insertOvertimeDoc(vo);
            if(result2 != 1){
                throw new IllegalStateException("연장근무 상세 등록 실패");
            }
        }

        return 1;
    }
    //내문서함
    public List<ApprovalDocVo> selectMyDocumentList(PageVo pvo, String loginEmpNo) {
        return approvalDocMapper.selectMyDocumentList(pvo, loginEmpNo);
    }

    //결재함
    public List<ApprovalDocVo> selectApproverDocList(PageVo pvo, String loginEmpNo) {
        return approvalDocMapper.selectApproverDocList(pvo, loginEmpNo);
    }

    //문서검색
    public List<ApprovalDocVo> searchMyDoc(Map<String, Object> paramMap , String loginEmpNo) {
        return approvalDocMapper.searchMyDoc(paramMap , loginEmpNo);
    }
    public List<ApprovalDocVo> searchApproverDoc(Map<String, Object> paramMap, String loginEmpNo) {
        return approvalDocMapper.searchApproverDoc(paramMap , loginEmpNo);
    }

    //페이징
    public int selectMyDocListCount() {
        return approvalDocMapper.selectMyDocListCount();
    }
    public int selectApproverDocListCount() {
        return approvalDocMapper.selectApproverDocListCount();
    }

    public int searchMyDocCount(ApprovalDocVo vo , String loginEmpNo) {
        return approvalDocMapper.searchMyDocCount(vo , loginEmpNo);
    }
    public int searchApproverDocCount(ApprovalDocVo vo , String loginEmpNo) {
        return approvalDocMapper.searchApproverDocCount(vo , loginEmpNo);
    }


//    public ApprovalDocVo selectOne(String docNo) {
//        return approvalDocMapper.selectOne(docNo);
//    }

    @Transactional
    public int editDocument(ApprovalDocVo vo) {
        if ("1".equals(vo.getStatusCode())){
            int result = approvalDocMapper.editDocument(vo);
            if(result != 1){
                throw new IllegalStateException("문서 수정 실패");
            }
        }
        return 1;
    }
//    @Transactional
//    public int processApproval(ApprovalDocVo vo) {
//        return approvalDocMapper.processApproval(vo);
//    }

//    @Transactional
//    public int deleteDoc(ApprovalDocVo vo) {
//
//        approvalDocMapper.deleteVacationDoc(vo.getDocNo());
//        approvalDocMapper.deleteOvertimeDoc(vo.getDocNo());
//
//        int result = approvalDocMapper.deleteDoc(vo);
//        if (result != 1) {
//            throw new IllegalStateException("delete document error");
//        }
//        return result;
//    }

    // 상세조회
    public ApprovalDocVo selectDocDetail(String docNo, String loginEmpNo) {
        ApprovalDocVo vo = approvalDocMapper.selectDocDetail(docNo);

        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 문서입니다.");
        }

        boolean isWriter = loginEmpNo.equals(vo.getWriterNo());
        boolean isApprover = loginEmpNo.equals(vo.getApproverNo());
        boolean isWait = "1".equals(vo.getStatusCode());

        vo.setCanEdit(isWriter && isWait);
        vo.setCanApprove(isApprover && isWait);

        return vo;
    }

    // 승인
    @Transactional
    public void approveDoc(String docNo, String approverComment, String loginEmpNo) {
        ApprovalDocVo vo = approvalDocMapper.selectDocDetail(docNo);

        System.out.println("vo = " + vo);
        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 문서입니다.");
        }

        if (!loginEmpNo.equals(vo.getApproverNo())) {
            throw new IllegalArgumentException("승인 권한이 없습니다.");
        }

        if (!"1".equals(vo.getStatusCode())) {
            throw new IllegalArgumentException("대기 상태 문서만 승인할 수 있습니다.");
        }

        int result = approvalDocMapper.approveDoc(docNo, approverComment, loginEmpNo);

        if (result != 1) {
            throw new IllegalStateException("문서 승인 처리 실패");
        }
        attService.applyApproval(docNo);
    }

    // 반려
    @Transactional
    public void rejectDoc(String docNo, String approverComment, String loginEmpNo) {
        ApprovalDocVo vo = approvalDocMapper.selectDocDetail(docNo);

        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 문서입니다.");
        }

        if (!loginEmpNo.equals(vo.getApproverNo())) {
            throw new IllegalArgumentException("반려 권한이 없습니다.");
        }

        if (!"1".equals(vo.getStatusCode())) {
            throw new IllegalArgumentException("대기 상태 문서만 반려할 수 있습니다.");
        }

        int result = approvalDocMapper.rejectDoc(docNo, approverComment, loginEmpNo);

        if (result != 1) {
            throw new IllegalStateException("문서 반려 처리 실패");
        }
    }

    // 삭제
    @Transactional
    public void deleteDoc(String docNo, String loginEmpNo) {
        ApprovalDocVo vo = approvalDocMapper.selectDocDetail(docNo);

        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 문서입니다.");
        }

        if (!loginEmpNo.equals(vo.getWriterNo())) {
            throw new IllegalArgumentException("삭제 권한이 없습니다.");
        }

        if (!"1".equals(vo.getStatusCode())) {
            throw new IllegalArgumentException("대기 상태 문서만 삭제할 수 있습니다.");
        }

        int result = approvalDocMapper.deleteDoc(docNo, loginEmpNo);

        if (result != 1) {
            throw new IllegalStateException("문서 삭제 실패");
        }
    }

}
