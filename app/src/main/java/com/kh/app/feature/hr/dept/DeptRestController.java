package com.kh.app.feature.hr.dept;

import com.kh.app.feature.finance.Account.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/dept")
@RestController
public class DeptRestController {

    private final DeptService deptService;
}
