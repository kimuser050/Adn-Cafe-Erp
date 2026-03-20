package com.kh.app.feature.finance.journal;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/journal")
@Slf4j
public class JournalViewController {

    @GetMapping("/insertJournal")
    public String insertJournal(HttpSession session, RedirectAttributes ra) throws Exception {

//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
//
//        if(loginMemberVo == null || (!"310102".equals(loginMemberVo.getDeptCode())
//                && !"310100".equals(loginMemberVo.getDeptCode()))){
//            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
//            return "redirect:/home";
//        }

        return "/finance/journal/journal";
    }

    @GetMapping("/totalList")
    public String totalList(){
        return "finance/journal/totalList";
    }

    @GetMapping("/monthList")
    public String monthList(){
        return "finance/journal/monthList";
    }

    @GetMapping("/dailyList")
    public String dailyList(){
        return "finance/journal/dailyList";
    }

    @GetMapping("/journalState")
    public String journalState(HttpSession session, RedirectAttributes ra) throws Exception {

//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
//
//        if(loginMemberVo == null || (!"310102".equals(loginMemberVo.getDeptCode())
//                && !"310100".equals(loginMemberVo.getDeptCode()))){
//            ra.addFlashAttribute("alertMsg", "권한이 없습니다.");
//            return "redirect:/home";
//        }

        return "finance/journal/journalState";
    }

    @GetMapping("/incomeState")
    public String incomeState(){
        return "finance/journal/incomeState";
    }


}