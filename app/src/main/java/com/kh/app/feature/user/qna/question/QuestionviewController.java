package com.kh.app.feature.user.qna.question;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("qna/question")
@Controller
public class QuestionViewController {

    @GetMapping("insert")
    public String insert(HttpSession session, RedirectAttributes ra) {
        // 1. 세션 체크
        if (session.getAttribute("loginMemberVo") == null) {
            // 2. 일회성 메시지 담기 (이름은 자유, 여기선 alertMsg로 설정)
            ra.addFlashAttribute("alertMsg", "로그인이 필요한 서비스입니다.");
            // 3. 홈 화면으로 리다이렉트
            return "redirect:/";
        }

        return "user/qna/question/insert";
    }

    @GetMapping("list")
    public String list(){
        return "user/qna/question/list";
    }


}
