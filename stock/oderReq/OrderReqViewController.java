package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("stock")
public class OrderReqViewController {

    // 1. 점주입장 발주 신청 화면
    @GetMapping("order")
    public String order(HttpSession session, RedirectAttributes ra, org.springframework.ui.Model model) {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        // 1. 로그인 및 권한 체크
        if (loginMemberVo == null) {
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        String deptCode = loginMemberVo.getDeptCode();

        if (!"310102".equals(deptCode)
                && !"310104".equals(deptCode)
                && !"310100".equals(deptCode)) {

            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

// 2. 사번(empNo)
        model.addAttribute("loginEmpNo", loginMemberVo.getEmpNo());

// 3. 이름
        model.addAttribute("userEmpName", loginMemberVo.getEmpName());

        return "stock/item/orderReq";
    }

    // 1-2 점주입장 발주 내역 화면 (order 메서드 밖으로 독립시킴)
    @GetMapping("product/history")
    public String productHistory(HttpSession session, RedirectAttributes ra, org.springframework.ui.Model model){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if(loginMemberVo == null || (!"310104".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }


        return "stock/item/productOrderhistory"; // jsp 경로
    }



    // 2. 발주 상태 화면 품질담당자만
    @GetMapping("history")
    public String history(HttpSession session, RedirectAttributes ra, org.springframework.ui.Model model){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if(loginMemberVo == null || (!"310103".equals(loginMemberVo.getDeptCode())
                && !"310100".equals(loginMemberVo.getDeptCode()))){
            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
            return "redirect:/home";
        }

        return "stock/item/orderhistory"; // jsp 경로
    }
}
