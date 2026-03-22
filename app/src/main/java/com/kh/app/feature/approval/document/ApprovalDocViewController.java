package com.kh.app.feature.approval.document;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/approval/document")
@RequiredArgsConstructor
@Slf4j
public class ApprovalDocViewController {
    @GetMapping("write")
    public String write(HttpSession session , RedirectAttributes ra){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            ra.addFlashAttribute("alertMsg", "로그인이 필요한 서비스입니다.");
            return "redirect:/";
        }
        return "approval/document/write";
    }

    @GetMapping("myDocList")
    public String myDocList(HttpSession session , RedirectAttributes ra){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            ra.addFlashAttribute("alertMsg", "로그인이 필요한 서비스입니다.");
            return "redirect:/";
        }
        return "approval/document/myDocList";
    }

    @GetMapping("approverDocList")
    public String approvalDocList(HttpSession session , RedirectAttributes ra){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            ra.addFlashAttribute("alertMsg", "로그인이 필요한 서비스입니다.");
            return "redirect:/";
        }
        return "approval/document/approverDocList";
    }
}
