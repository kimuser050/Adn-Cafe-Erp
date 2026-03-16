package com.kh.app.feature.user.qna.answerComment;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("answer/comment")
@RequiredArgsConstructor
@Slf4j
public class AnswerCommentRestController {

    private final AnswerCommentService answerCommentService;

    //댓글 등록
    @PostMapping
    public ResponseEntity<HashMap<String, Object>> insert(@RequestBody AnswerCommentVo vo , HttpSession session){


        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo==null){
            throw new IllegalArgumentException("[R-111] login require");
        }
        String loginMemberNo = loginMemberVo.getEmpNo();
        vo.setWriterNo(loginMemberNo);

        int result = answerCommentService.insert(vo);

        if(result !=1){
            throw new IllegalArgumentException("[R-110] reply insert fail ... ");
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    //댓글 목록 조회(특정 게시글에 대한)
    @GetMapping
    public List<AnswerCommentVo> selectList(AnswerCommentVo vo){
        List<AnswerCommentVo> voList = answerCommentService.selectList(vo.getReplyNo());
        return voList;

    }

    //댓글 삭제
    @DeleteMapping
    public int del(@RequestBody AnswerCommentVo vo, HttpSession session){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            throw new IllegalArgumentException("[R-111] login required");
        }
        String loginMemberNo = loginMemberVo.getEmpNo();
        vo.setWriterNo(loginMemberNo);

        int result =answerCommentService.del(vo);
        return result;
    }

    //댓글 수정
    @PutMapping
    public ResponseEntity<HashMap<String, Object>> update(@RequestBody AnswerCommentVo vo, HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            throw new IllegalArgumentException("[R-111] login required");
        }
        vo.setWriterNo(loginMemberVo.getEmpNo());

        int result = answerCommentService.update(vo);
        if (result != 1) {
            throw new IllegalArgumentException("[R-120] comment update fail ...");
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }





}
