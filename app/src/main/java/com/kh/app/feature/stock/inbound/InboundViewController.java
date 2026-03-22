package com.kh.app.feature.stock.inbound;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("stock")
public class InboundViewController {
    
    //입고내역 조회 품질 담당자
    @GetMapping("inbound")
    public String inbound(HttpSession session, RedirectAttributes ra, org.springframework.ui.Model model){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        // 1. 로그인 및 권한 체크
        if (loginMemberVo == null ||
                (!"310102".equals(loginMemberVo.getDeptCode()) && !"310103".equals(loginMemberVo.getDeptCode()))) {
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/main";
        }


        return  "stock/item/inboundList";
    }
}
