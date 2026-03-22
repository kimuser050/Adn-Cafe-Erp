package com.kh.app.feature.stock.itemcheck;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("stock")
public class CheckViewController {


    //품질관리
    @GetMapping("check")
    public String check(HttpSession session, RedirectAttributes ra, org.springframework.ui.Model model){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null || (!"310103".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }


        return "stock/item/itemCheck";

    }
    //매장관리

    @GetMapping("checksList")
    public String checkList(HttpSession session, RedirectAttributes ra, org.springframework.ui.Model model){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if(loginMemberVo == null || (!"310104".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }


        return "stock/item/checkList";
    }
}

