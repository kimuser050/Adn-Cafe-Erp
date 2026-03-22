package com.kh.app.feature.hr.emp;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/hr/emp")
@Slf4j
public class EmpViewController {

    @GetMapping("/list")
    public String list(HttpSession session, RedirectAttributes ra) {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if (loginMemberVo == null
                || (!"310100".equals(loginMemberVo.getDeptCode())
                && !"310101".equals(loginMemberVo.getDeptCode()))) {
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        return "hr/emp/empList";
    }
}