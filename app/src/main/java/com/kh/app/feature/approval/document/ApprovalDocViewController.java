package com.kh.app.feature.approval.document;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/approval/document")
@RequiredArgsConstructor
@Slf4j
public class ApprovalDocViewController {
    @GetMapping("write")
    public void insert(){}
}
