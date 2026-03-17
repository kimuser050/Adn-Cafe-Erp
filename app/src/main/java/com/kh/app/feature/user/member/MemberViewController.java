package com.kh.app.feature.user.member;


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

}
