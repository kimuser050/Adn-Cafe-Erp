package com.kh.app.feature.user.member;


import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("member")
@RequiredArgsConstructor
public class MemberViewController {

    private final MemberService memberService;

    @GetMapping("join")
    public String join(){
        return "user/member/join";
    }

    @GetMapping("/{empNo}")
    public ResponseEntity<MemberVo> getMember(@PathVariable String empNo) {
        MemberVo member = memberService.selectByNo(empNo);
        if (member == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(member);
    }

    @GetMapping("logout")
    public String logout(HttpSession session) {
        session.removeAttribute("loginMemberVo");
        return "redirect:/";  // 메인 페이지로 리다이렉트
    }

    @GetMapping("mypage")
    public String update(HttpSession session){
        if (session.getAttribute("loginMemberVo") == null) {
            throw new IllegalStateException("login plz..");
        }
        return "user/member/mypage";
    }
}
