package com.kh.app.feature.user.notice;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("notice")
@RequiredArgsConstructor
public class NoticeViewController {

    @GetMapping("insert")
    public String insert(HttpSession session) {
        if (session.getAttribute("loginMemberVo") == null) {
            throw new IllegalStateException("login plz..");
        }
        return "user/notice/insert";
    }

    @GetMapping("list")
    public String list(){
        return "user/notice/list";
    }
}
