package com.kh.app.feature.user.notice;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
    public String list(HttpSession session, RedirectAttributes ra){
        if (session.getAttribute("loginMemberVo") == null) {
            // 일회성 세션 데이터로 메시지 전달 (리다이렉트 시 자동 삭제됨)
            ra.addFlashAttribute("alertMsg", "로그인이 필요한 서비스입니다.");
            return "redirect:/"; // 메인 페이지(/)로 리다이렉트
        }
        return "user/notice/list";
    }

    @GetMapping("detail")
    public String detail() {
        return "user/notice/detail";
    }

}
