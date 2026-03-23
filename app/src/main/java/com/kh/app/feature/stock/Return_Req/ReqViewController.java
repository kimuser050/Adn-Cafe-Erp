package com.kh.app.feature.stock.Return_Req;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("stock")
public class ReqViewController {

    @GetMapping("return")
    public String req(HttpSession session, RedirectAttributes ra, org.springframework.ui.Model model){


        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        // 1. 로그인 및 권한 체크
        if (loginMemberVo == null ||
                (!"310102".equals(loginMemberVo.getDeptCode()) && !"310104".equals(loginMemberVo.getDeptCode()))) {
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        // 2. [중요] 사번(empNo)을 모델에 담습니다.
        model.addAttribute("loginEmpNo", loginMemberVo.getEmpNo());

        // 3. 만약 화면 상단에 '문춘주 님 환영합니다' 같은 걸 띄우고 싶다면 이름도 유지합니다.
        model.addAttribute("userEmpName", loginMemberVo.getEmpName());


        return "stock/item/return";
    }
}
