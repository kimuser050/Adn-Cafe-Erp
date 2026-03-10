package com.kh.app.feature.user.member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("mamber")
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






}
