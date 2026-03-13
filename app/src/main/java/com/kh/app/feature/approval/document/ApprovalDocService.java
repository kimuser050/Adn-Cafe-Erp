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


    public int write(ApprovalDocVo vo) {
        return approvalDocMapper.write(vo);
    }

    public List<ApprovalDocVo> selectDocList(ApprovalDocVo vo) {
        return approvalDocMapper.selectDocList(vo);
    }
}
