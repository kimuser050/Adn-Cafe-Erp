package com.kh.app.feature.approval.document;

import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/approval/document")
@RequiredArgsConstructor
@Slf4j
public class ApprovalDocRestController {

    private final ApprovalDocService approvalDocService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    // 문서 작성
    @PostMapping("write")
    public ResponseEntity<Map<String, String>> insert(@RequestBody ApprovalDocVo vo){
        System.out.println("vo = " + vo);
        int result = approvalDocService.insert(vo);

        if(result != 1){
            String errMsg = "insert fail";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, String> map = new HashMap<>();
        map.put("result" , result + "");
        return ResponseEntity.ok(map);
    }
    // 내 문서함
    @GetMapping("selectMyDocumentList")
    public ResponseEntity<Map<String, Object>> selectMyDocumentList(@RequestParam(required = false , defaultValue = "1") int currentPage , HttpSession session){
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
//        vo.setWriterNo(loginMemberVo.getEmpNo());
        int listCount = approvalDocService.selectMyDocListCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount , currentPage , pageLimit , boardLimit);
        List<ApprovalDocVo> voList= approvalDocService.selectMyDocumentList(pvo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo" , pvo);
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    // 결재함
    @GetMapping("selectApproverDocList")
    public ResponseEntity<Map<String, Object>> selectApproverDocList(@RequestParam(required = false , defaultValue = "1") int currentPage , HttpSession session){
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
//        vo.setWriterNo(loginMemberVo.getEmpNo());
        int listCount = approvalDocService.selectApproverDocListCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount , currentPage , pageLimit , boardLimit);
        List<ApprovalDocVo> voList= approvalDocService.selectApproverDocList(pvo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo" , pvo);
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    // 검색
    @GetMapping("search")
    public ResponseEntity<Map<String, Object>> searchDoc(@RequestParam(required = false , defaultValue = "1") int currentPage , ApprovalDocVo vo){
        int listCount = approvalDocService.selectSearchDocCount(vo);
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;

        PageVo pvo = new PageVo(listCount , currentPage , pageLimit , boardLimit);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("vo" , vo);
        paramMap.put("pvo" , pvo);

        List<ApprovalDocVo> voList = approvalDocService.searchDoc(paramMap);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("vo" , vo);
        resultMap.put("pvo" , pvo);
        resultMap.put("voList" , voList);


        return ResponseEntity.ok(resultMap);
    }


//    // 상세조회
//    @GetMapping("/{docNo}")
//    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String docNo){
//        ApprovalDocVo vo = approvalDocService.selectOne(docNo);
//        Map<String, Object> map = new HashMap<>();
//        map.put("vo", vo);
//
//        return ResponseEntity.ok(map);
//    }

    // 문서 수정 (기안자)
    @PutMapping("/{docNo}")
    public ResponseEntity<Map<String, Object>> editDocument(@PathVariable String docNo , @RequestBody ApprovalDocVo vo){

        vo.setDocNo(docNo);
        int result = approvalDocService.editDocument(vo);

        if(result != 1){
            String errMsg = "update error";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result" , result);
        return ResponseEntity.ok(map);
    }

    // 결재 처리
//    @PutMapping("/processApproval")
//    public ResponseEntity<Map<String, Object>> processApproval(@RequestBody ApprovalDocVo vo){
//        int result = approvalDocService.processApproval(vo);
//
//        if(result != 1){
//            String errMsg = "processApproval error";
//            log.error(errMsg);
//            throw new IllegalStateException(errMsg);
//        }
//
//        Map<String, Object> map = new HashMap<>();
//        map.put("result" , result);
//        return ResponseEntity.ok(map);
//    }

    // 결재 문서 삭제 (기안자)
//    @DeleteMapping("/{docNo}")
//    public ResponseEntity<Map<String, Object>> deleteDoc(@PathVariable String docNo ,
//                                                         @RequestBody ApprovalDocVo vo){
//        vo.setDocNo(docNo);
//        int result = approvalDocService.deleteDoc(vo);
//
//        if(result != 1){
//            String errMsg = "delete document error";
//            log.error(errMsg);
//            throw new IllegalStateException(errMsg);
//        }
//
//        Map<String, Object> map = new HashMap<>();
//        map.put("result" , result);
//        return ResponseEntity.ok(map);
//    }

    // 상세조회
    @GetMapping("detail/{docNo}")
    public ResponseEntity<ApprovalDocVo> selectDocDetail(
            @PathVariable String docNo,
            HttpSession session
    ) {
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        ApprovalDocVo detailVo = approvalDocService.selectDocDetail(docNo); //, loginMemberVo.getEmpNo()
        System.out.println("detailVo = " + detailVo);
        return ResponseEntity.ok(detailVo);
    }

    // 승인
    @PostMapping("{docNo}/approve")
    public ResponseEntity<Map<String, Object>> approveDoc(
            @PathVariable String docNo,
            @RequestBody ApprovalDocVo vo,
            HttpSession session
    ) {
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        approvalDocService.approveDoc(docNo, vo.getApproverComment());//, loginMemberVo.getEmpNo()

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "승인 완료");
        return ResponseEntity.ok(map);
    }

    // 반려
    @PostMapping("{docNo}/reject")
    public ResponseEntity<Map<String, Object>> rejectDoc(
            @PathVariable String docNo,
            @RequestBody ApprovalDocVo vo,
            HttpSession session
    ) {
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        approvalDocService.rejectDoc(docNo, vo.getApproverComment());//, loginMemberVo.getEmpNo()

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "반려 완료");
        return ResponseEntity.ok(map);
    }

    // 삭제
    @DeleteMapping("{docNo}")
    public ResponseEntity<Map<String, Object>> deleteDoc(
            @PathVariable String docNo,
            HttpSession session
    ) {
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        approvalDocService.deleteDoc(docNo);//, loginMemberVo.getEmpNo()

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "삭제 완료");
        return ResponseEntity.ok(map);
    }
}
