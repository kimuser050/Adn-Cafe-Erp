package com.kh.app.feature.hr.att;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/hr/att")
@Slf4j
public class AttViewController {

    @GetMapping("/list")
    public String list(HttpSession session, RedirectAttributes ra){

        // 1. 로그인 정보 가져오기
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        // 2. 로그인 안했거나 권한 없는 경우
        if(loginMemberVo == null
                || (!"310100".equals(loginMemberVo.getDeptCode())
                && !"310101".equals(loginMemberVo.getDeptCode()))){

            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        // 3. 정상 접근
        return "hr/att/attList";
    }

}