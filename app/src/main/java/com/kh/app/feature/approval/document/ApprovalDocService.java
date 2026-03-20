package com.kh.app.feature.approval.document;

import com.kh.app.feature.util.PageVo;
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

    public List<ApprovalDocVo> selectMyDocumentList(PageVo pvo) {
        return approvalDocMapper.selectMyDocumentList(pvo);
    }

    public List<ApprovalDocVo> selectApproverDocList(PageVo pvo) {
        return approvalDocMapper.selectApproverDocList(pvo);
    }

    public List<ApprovalDocVo> searchDoc(Map<String, Object> paramMap) {
        return approvalDocMapper.searchDoc(paramMap);
    }

    public int selectMyDocListCount() {
        return approvalDocMapper.selectMyDocListCount();
    }

    public int selectSearchDocCount(ApprovalDocVo vo) {
        return approvalDocMapper.selectSearchDocCount(vo);
    }

    public int selectApproverDocListCount() {
        return approvalDocMapper.selectApproverDocListCount();
    }

    public ApprovalDocVo selectOne(String docNo) {
        return approvalDocMapper.selectOne(docNo);
    }

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
    @Transactional
    public int processApproval(ApprovalDocVo vo) {
        return approvalDocMapper.processApproval(vo);
    }

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
    public ApprovalDocVo selectDocDetail(String docNo) {
        ApprovalDocVo vo = approvalDocMapper.selectDocDetail(docNo);

        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 문서입니다.");
        }

//        boolean isWriter = loginEmpNo.equals(vo.getWriterNo());
//        boolean isApprover = loginEmpNo.equals(vo.getApproverNo());
        boolean isWait = "1".equals(vo.getStatusCode());

//        vo.setCanEdit(isWriter && isWait);
//        vo.setCanApprove(isApprover && isWait);

        return vo;
    }

    // 승인
    public void approveDoc(String docNo, String approverComment) {
        ApprovalDocVo vo = approvalDocMapper.selectDocDetail(docNo);

        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 문서입니다.");
        }

//        if (!loginEmpNo.equals(vo.getApproverNo())) {
//            throw new IllegalArgumentException("승인 권한이 없습니다.");
//        }

        if (!"1".equals(vo.getStatusCode())) {
            throw new IllegalArgumentException("대기 상태 문서만 승인할 수 있습니다.");
        }

        int result = approvalDocMapper.approveDoc(docNo, approverComment);

        if (result != 1) {
            throw new IllegalStateException("문서 승인 처리 실패");


        }
    }

    // 반려
    public void rejectDoc(String docNo, String approverComment) {
        ApprovalDocVo vo = approvalDocMapper.selectDocDetail(docNo);

        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 문서입니다.");
        }

//        if (!loginEmpNo.equals(vo.getApproverNo())) {
//            throw new IllegalArgumentException("반려 권한이 없습니다.");
//        }

        if (!"1".equals(vo.getStatusCode())) {
            throw new IllegalArgumentException("대기 상태 문서만 반려할 수 있습니다.");
        }

        int result = approvalDocMapper.rejectDoc(docNo, approverComment);

        if (result != 1) {
            throw new IllegalStateException("문서 반려 처리 실패");
        }
    }

    // 삭제
    public void deleteDoc(String docNo) {
        ApprovalDocVo vo = approvalDocMapper.selectDocDetail(docNo);

        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 문서입니다.");
        }

//        if (!loginEmpNo.equals(vo.getWriterNo())) {
//            throw new IllegalArgumentException("삭제 권한이 없습니다.");
//        }

        if (!"1".equals(vo.getStatusCode())) {
            throw new IllegalArgumentException("대기 상태 문서만 삭제할 수 있습니다.");
        }

        int result = approvalDocMapper.deleteDoc(docNo);

        if (result != 1) {
            throw new IllegalStateException("문서 삭제 실패");
        }
    }
}
