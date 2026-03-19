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

@Slf4j
@RequiredArgsConstructor
@RequestMapping("qna/question")
@RestController
public class QuestionRestController {

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
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(required = false, defaultValue = "1") int currentPage,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchKeyword
    ) {
        // 전체 게시글 수가 아닌 '검색된 게시글 수'를 가져와야 페이징이 정확합니다.
        int listCount = questionService.selectCount(searchType, searchKeyword);

        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<QuestionVo> voList = questionService.selectList(pvo, searchType, searchKeyword);

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

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteByNo(@RequestBody QuestionVo vo
            , HttpSession session
    )
    {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null){
            throw new IllegalStateException("login required");
        }
        vo.setWriterNo(loginMemberVo.getEmpNo());
        int result = questionService.deleteByNo(vo);

        if (result != 1) {
            String errMsg = "[B-510] delete err ...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }















}
