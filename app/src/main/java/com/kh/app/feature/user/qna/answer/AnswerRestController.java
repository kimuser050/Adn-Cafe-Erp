package com.kh.app.feature.user.qna.answer;

import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("qna/answer")
@Slf4j
@RequiredArgsConstructor
public class AnswerRestController {

    private final AnswerService answerService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    @PostMapping
    public ResponseEntity<Map<String, String>> insert(
            AnswerVo vo,
            @RequestParam(value = "file", required = false) List<MultipartFile> fileList,
            HttpSession session
    ) {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            throw new IllegalStateException("로그인이 필요합니다.");
        }
        String loginMemberNo = loginMemberVo.getEmpNo();
        vo.setWriterNo(loginMemberNo);

        int result = answerService.insert(vo, fileList);

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
        int listCount = answerService.selectCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;

        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<AnswerVo> voList = answerService.selectList(pvo);
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
        AnswerVo vo = answerService.selectOne(no);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);



        return ResponseEntity.ok(map);
    }

    @PostMapping("/update")
    public ResponseEntity<Map<String, Object>> updateByNo(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "oldChangeName", required = false) String oldChangeName, // JS의 키값과 일치시킴
            AnswerVo vo, // replyNo, response 등을 담음
            HttpSession session) throws IOException
    {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null){
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        vo.setWriterNo(loginMemberVo.getEmpNo());

        // Service 메서드 호출 (기존 인자 순서 확인 필요: vo, file, oldChangeName)
        int result = answerService.updateByNo(vo, file, oldChangeName);

        if (result != 1) {
            log.error("[B-410] 답변 수정 실패 - 대상 없음 또는 권한 없음");
            throw new IllegalStateException("[B-410] 답변 수정 실패");
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    @PostMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteByNo(
            @RequestBody AnswerVo vo, // JSON으로 보낼 경우 유지
            HttpSession session
    ) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null){
            throw new IllegalStateException("로그인이 필요합니다.");
        }

        vo.setWriterNo(loginMemberVo.getEmpNo());
        int result = answerService.deleteByNo(vo);

        if (result != 1) {
            log.error("[B-510] 답변 삭제 실패");
            throw new IllegalStateException("[B-510] 답변 삭제 실패");
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }
}





