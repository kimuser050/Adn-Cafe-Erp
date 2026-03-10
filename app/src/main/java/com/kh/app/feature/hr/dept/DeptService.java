package com.kh.app.feature.hr.dept;

import com.kh.app.feature.finance.Account.AccountMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class DeptService {

    private final DeptMapper deptMapper;
}
