package com.kh.app.feature.user.qna.answer;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("qna/answer")
@Controller
public class AnswerViewController {

    @GetMapping("insert")
    public String insert(String category, HttpSession session, RedirectAttributes ra) {
        MemberVo loginMember = (MemberVo) session.getAttribute("loginMemberVo");

        if (loginMember == null) {
            ra.addFlashAttribute("alertMsg", "로그인이 필요한 서비스입니다.");
            return "redirect:/";
        }

        String userDept = loginMember.getDeptCode();
        boolean isAuthorized = false;

        // 1. 경영혁신실(마스터) 체크
        if ("310100".equals(userDept)) {
            isAuthorized = true;
        }
        else {
            // 2. 카테고리 코드(숫자)와 부서 코드 매칭 체크
            // "3"이 '인사' 카테고리 코드라면:
            if ("3".equals(category) && "310101".equals(userDept)) isAuthorized = true; // 인사
            else if ("2".equals(category) && "310102".equals(userDept)) isAuthorized = true; // 재무
            else if ("4".equals(category) && "310103".equals(userDept)) isAuthorized = true; // 품질
            else if ("5".equals(category)) isAuthorized = true; // 공통
        }

        if (!isAuthorized) {
            log.info("권한 거부 - 유저부서: {}, 요청카테고리: {}", userDept, category); // 로그로 확인 가능
            ra.addFlashAttribute("alertMsg", "해당 부서의 문의 관리 권한이 없습니다.");
            return "redirect:/qna/question/list";
        }

        return "user/qna/answer/insert";
    }
}
