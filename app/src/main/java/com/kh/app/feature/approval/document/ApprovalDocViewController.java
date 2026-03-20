package com.kh.app.feature.approval.document;

import jakarta.servlet.http.HttpSession;
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
    public String write(HttpSession session){
        if (session.getAttribute("loginMemberVo") == null) {
            throw new IllegalStateException("login plz..");
        }
        return "approval/document/write";
    }

    @GetMapping("myDocList/{pno}")
    public String myDocList(HttpSession session){
        if (session.getAttribute("loginMemberVo") == null) {
            throw new IllegalStateException("login plz..");
        }
        return "approval/document/myDocList";
    }

    @GetMapping("approverDocList/{pno}")
    public String approvalDocList(HttpSession session){
        if (session.getAttribute("loginMemberVo") == null) {
            throw new IllegalStateException("login plz..");
        }
        return "approval/document/approverDocList";
    }
}
