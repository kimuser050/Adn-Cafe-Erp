package com.kh.app.feature.stock.item;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("stock")
public class ItemViewController {

    //품목 조회
    @GetMapping("item")
    public String list(HttpSession session, RedirectAttributes ra, org.springframework.ui.Model model){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if(loginMemberVo == null || (!"310103".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }


        return "stock/item/itemList";
    }

}
