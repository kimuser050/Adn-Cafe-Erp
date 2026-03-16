package com.kh.app.feature.user.qna.question;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RequestMapping("qna/question")
@RestController
@Slf4j
public class QuestionRestcontroller {

    private final QuestionService questionService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    @PostMapping
    public ResponseEntity<Map<String, String>> insert(@RequestBody QuestionVo vo, HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginMemberNo = loginMemberVo.getEmpNo();
        vo.setWriterNo(loginMemberNo);
        int result = questionService.insert(vo);

        if (result != 1) {
            String errMsg = "[B-100] insert err...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, String> map = new HashMap<>();
        map.put("result", result + "");
        return ResponseEntity.ok(map);
    }

}
