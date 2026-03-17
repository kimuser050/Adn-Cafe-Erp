package com.kh.app.feature.hr.payroll;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class PayService {

    private final PayMapper payMapper;


    public void insert(PayMasterVo vo) {
    }
}
