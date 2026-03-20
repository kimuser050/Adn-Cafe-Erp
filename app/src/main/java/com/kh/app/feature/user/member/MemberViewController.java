package com.kh.app.feature.user.member;


import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@Controller
@RequestMapping("member")
@RequiredArgsConstructor
public class MemberViewController {

    private final MemberService memberService;

    @GetMapping("/join")
    public String join(){
        return "user/member/join";
    }

    @GetMapping("/{empNo}")
    public ResponseEntity<MemberVo> getMember(@PathVariable String empNo) {
        MemberVo member = memberService.selectByNo(empNo);
        if (member == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(member);
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate(); // 세션 무효화
        return "redirect:/";  // 메인 페이지로 리다이렉트
    }

    @GetMapping("mypage")
    public String update(HttpSession session, RedirectAttributes ra) {
        if (session.getAttribute("loginMemberVo") == null) {
            // 일회성 세션 데이터로 메시지 전달 (리다이렉트 시 자동 삭제됨)
            ra.addFlashAttribute("alertMsg", "로그인이 필요한 서비스입니다.");
            return "redirect:/"; // 메인 페이지(/)로 리다이렉트
        }
        return "user/member/mypage";
    }



}
