package com.kh.app.feature.user.noticeComment;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("notice/comment")
@Slf4j
public class NoticeCommentRestController {

    private final NoticeCommentService noticeCommentService;

    //댓글 등록
    @PostMapping
    public ResponseEntity<HashMap<String, Object>> insert(@RequestBody NoticeCommentVo vo , HttpSession session){


        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo==null){
            throw new IllegalArgumentException("[R-111] login require");
        }
        String loginMemberNo = loginMemberVo.getEmpNo();
        vo.setWriterNo(loginMemberNo);

        int result = noticeCommentService.insert(vo);

        if(result !=1){
            throw new IllegalArgumentException("[R-110] reply insert fail ... ");
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    //댓글 목록 조회(특정 게시글에 대한)
    @GetMapping
    public List<NoticeCommentVo> selectList(NoticeCommentVo vo){
        List<NoticeCommentVo> voList = noticeCommentService.selectList(vo.getNoticeNo());
        return voList;

    }

    //댓글 삭제
    @DeleteMapping
    public int del(@RequestBody NoticeCommentVo vo, HttpSession session){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if (loginMemberVo == null) {
            throw new IllegalArgumentException("[R-111] login required");
        }
        String loginMemberNo = loginMemberVo.getEmpNo();
        vo.setWriterNo(loginMemberNo);

        int result =noticeCommentService.del(vo);
        return result;
    }

    //댓글 수정
    @PutMapping
    public ResponseEntity<HashMap<String, Object>> update(@RequestBody NoticeCommentVo vo, HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            throw new IllegalArgumentException("[R-111] login required");
        }
        vo.setWriterNo(loginMemberVo.getEmpNo());

        int result = noticeCommentService.update(vo);
        if (result != 1) {
            throw new IllegalArgumentException("[R-120] comment update fail ...");
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }


}
