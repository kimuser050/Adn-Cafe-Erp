package com.kh.app.feature.finance.account;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/account")
@Slf4j
public class AccountViewController {

    @GetMapping("")
    public String mainAccount(HttpSession session, RedirectAttributes ra) throws Exception {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if(loginMemberVo == null || (!"310102".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        return "finance/account/accountMain";
    }

    @GetMapping("/insertAccount")
    public String insertAccount(HttpSession session, RedirectAttributes ra) throws Exception {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if(loginMemberVo == null || (!"310102".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        return "finance/account/account";
    }

}
