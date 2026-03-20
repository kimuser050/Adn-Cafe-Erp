package com.kh.app.feature.finance.dailySales;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@RequestMapping("/dailySales")
@Controller
public class DailySalesViewController {

    @GetMapping("/insertDaily")
    public String insertDaily(HttpSession session, RedirectAttributes ra){

       MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if(loginMemberVo == null || (!"310102".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        return "/finance/dailySales/dailySales";
    }

    @GetMapping("/listDaily")
    public String listDaily() {
        return "/finance/dailySales/dailyList";
    }

    @GetMapping("/productIncome")
    public String productIncome(){
        return "/finance/dailySales/productIncome";
    }

    @GetMapping("/storeIncome")
    public String storeIncome(HttpSession session, RedirectAttributes ra){

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if(loginMemberVo == null || (!"310102".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        return "/finance/dailySales/storeIncome";
    }
}
