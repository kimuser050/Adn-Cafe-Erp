package com.kh.app.feature.approval.document;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    public List<ApprovalDocVo> selectMyDocumentList(ApprovalDocVo vo) {
        return approvalDocMapper.selectMyDocumentList(vo);
    }

    public List<ApprovalDocVo> selectApproverDocList(ApprovalDocVo vo) {
        return approvalDocMapper.selectApproverDocList(vo);
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

    @Transactional
    public int deleteDoc(ApprovalDocVo vo) {

        approvalDocMapper.deleteVacationDoc(vo.getDocNo());
        approvalDocMapper.deleteOvertimeDoc(vo.getDocNo());

        int result = approvalDocMapper.deleteDoc(vo);
        if (result != 1) {
            throw new IllegalStateException("delete document error");
        }
        return result;
    }
}
