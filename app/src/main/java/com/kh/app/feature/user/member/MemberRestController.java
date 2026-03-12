package com.kh.app.feature.user.member;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("member")
@RestController
public class MemberRestController {
    private final MemberService memberService;

    @PostMapping("join")
    public ResponseEntity<HashMap<String, String>> join(
            MemberVo vo
            , @RequestParam(required = false) MultipartFile profile
    ) throws IOException {
        System.out.println("vo = " + vo);
        System.out.println(profile);

        int result = memberService.join(vo, profile);

        HashMap<String, String> map = new HashMap<>();
        map.put("x" , String.valueOf(result));
        return ResponseEntity.ok(map);
    }//method

    @PostMapping("login")
    public ResponseEntity.BodyBuilder login(@RequestBody MemberVo vo , HttpSession session){
        MemberVo loginMemberVo = memberService.login(vo);
        if(loginMemberVo == null){
            throw new IllegalArgumentException("[M-200] login err ...");
        }
        session.setAttribute("loginMemberVo" , loginMemberVo);
        return ResponseEntity.ok();
    }

    @PostMapping("logout")
    public void logout(HttpSession session) {
        session.removeAttribute("loginMemberVo");
    }

    @DeleteMapping("/quit")
    public ResponseEntity.BodyBuilder quit(HttpSession session){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        String no = loginMemberVo.getEmpNo();
        int result = memberService.quit(no);
        if(result != 1){
            throw new IllegalStateException("[M-500]");
        }
        session.invalidate();
        return ResponseEntity.ok();
    }
    @PutMapping("/edit")
    public ResponseEntity<HashMap<String, String>> edit(
            MemberVo vo,
            @RequestParam(required = false) MultipartFile profile,
            HttpSession session
    ) throws IOException {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null){
            throw new IllegalStateException("[M401] need to login");
        }
        String no = loginMemberVo.getEmpNo();
        vo.setEmpNo(no);
        MemberVo updatedMemberVo = memberService.edit(vo , profile , loginMemberVo.getProfileChangeName());

        HashMap<String, String> map = new HashMap<>();

        if(updatedMemberVo == null){
            String errMsg = "[M-411] updated fail";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        map.put("msg" , "회원 정보 수정 잘 됨 ~~~");

        session.setAttribute("loginMemberVo" , updatedMemberVo);
        return ResponseEntity
                .ok()
                .body(map);
    }








}
