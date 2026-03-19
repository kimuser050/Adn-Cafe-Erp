package com.kh.app.feature.user.qna.question;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("qna/question")
@Controller
public class QuestionViewController {

    @GetMapping("insert")
    public String insert(HttpSession session) {
        // 세션에서 로그인 정보 확인 (대소문자 주의: loginMemberVo 등 설정한 이름과 일치해야 함)
        if (session.getAttribute("loginMemberVo") == null) {
            // 에러를 던지는 대신 리다이렉트를 사용합니다.
            // "/"는 보통 홈 화면(index) 경로입니다.
            return "redirect:/";
        }

        return "user/qna/question/insert";
    }

    @GetMapping("list")
    public String list(){
        return "user/qna/question/list";
    }


}
