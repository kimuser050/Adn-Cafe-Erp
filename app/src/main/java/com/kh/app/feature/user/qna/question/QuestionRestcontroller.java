package com.kh.app.feature.user.qna.question;

import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
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
    public ResponseEntity<Map<String, String>> insert(
            QuestionVo vo,
            @RequestParam(value = "file", required = false) List<MultipartFile> fileList,
            HttpSession session
    ) {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginMemberNo = loginMemberVo.getEmpNo();
        vo.setWriterNo(loginMemberNo);

        int result = questionService.insert(vo, fileList);

        if (result != 1) {
            String errMsg = "[B-100] insert err...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, String> map = new HashMap<>();
        map.put("result", String.valueOf(result));
        return ResponseEntity.ok(map);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList(@RequestParam(required = false, defaultValue = "1") int currentPage) {
        int listCount = questionService.selectCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;

        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<QuestionVo> voList = questionService.selectList(pvo);
        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/{no}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String no, HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null){
            throw new IllegalArgumentException("로그인먼저");

        }
        QuestionVo vo = questionService.selectOne(no);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);



        return ResponseEntity.ok(map);
    }


}
