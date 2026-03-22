package com.kh.app.feature.approval.document;

import com.kh.app.feature.hr.dept.DeptVo;
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

    @GetMapping("deptList")
    public ResponseEntity<List<DeptVo>> selectDeptList() {
        List<DeptVo> deptList = approvalDocService.selectDeptList();
        return ResponseEntity.ok(deptList);
    }

    @GetMapping("approverList")
    public ResponseEntity<List<ApproverVo>> selectApproverList() {
        List<ApproverVo> approverList = approvalDocService.selectApproverList();
        System.out.println("approverList = " + approverList);
        return ResponseEntity.ok(approverList);
    }

    @PostMapping("write")
    public ResponseEntity<Map<String, String>> insertDocument(
            @RequestBody ApprovalDocVo vo,
            HttpSession session
    ) {
        System.out.println("vo = " + vo);
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if (loginMemberVo == null) {
            throw new IllegalStateException("login plz");
        }

        vo.setWriterNo(loginMemberVo.getEmpNo());

        int result = approvalDocService.insertDocument(vo);

        if (result != 1) {
            String errMsg = "insert fail";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, String> map = new HashMap<>();
        map.put("result" , result + "");
        return ResponseEntity.ok(map);
    }
    // 문서 작성
//    @PostMapping("write")
//    public ResponseEntity<Map<String, String>> insert(@RequestBody ApprovalDocVo vo){
//        int result = approvalDocService.insert(vo);
//
//        if(result != 1){
//            String errMsg = "insert fail";
//            log.error(errMsg);
//            throw new IllegalStateException(errMsg);
//        }
//
//        Map<String, String> map = new HashMap<>();
//        map.put("result" , result + "");
//        return ResponseEntity.ok(map);
//
//    }
    // 내 문서함
    @GetMapping("selectMyDocumentList")
    public ResponseEntity<Map<String, Object>> selectMyDocumentList(@RequestParam(required = false , defaultValue = "1") int currentPage , HttpSession session){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();
        int listCount = approvalDocService.selectMyDocListCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount , currentPage , pageLimit , boardLimit);
        List<ApprovalDocVo> voList= approvalDocService.selectMyDocumentList(pvo , loginEmpNo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo" , pvo);
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    // 결재함
    @GetMapping("selectApproverDocList")
    public ResponseEntity<Map<String, Object>> selectApproverDocList(@RequestParam(required = false , defaultValue = "1") int currentPage , HttpSession session){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();
        int listCount = approvalDocService.selectApproverDocListCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount , currentPage , pageLimit , boardLimit);
        List<ApprovalDocVo> voList= approvalDocService.selectApproverDocList(pvo , loginEmpNo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo" , pvo);
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    // 검색(기안자 시점)
    @GetMapping("searchMyDoc")
    public ResponseEntity<Map<String, Object>> searchMyDoc(@RequestParam(required = false , defaultValue = "1") int currentPage , ApprovalDocVo vo , HttpSession session){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();
        int listCount = approvalDocService.searchMyDocCount(vo , loginEmpNo);
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;

        PageVo pvo = new PageVo(listCount , currentPage , pageLimit , boardLimit);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("vo" , vo);
        paramMap.put("pvo" , pvo);

        List<ApprovalDocVo> voList = approvalDocService.searchMyDoc(paramMap , loginEmpNo);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("vo" , vo);
        resultMap.put("pvo" , pvo);
        resultMap.put("voList" , voList);


        return ResponseEntity.ok(resultMap);

    }// 검색(결재자 시점)
    @GetMapping("searchApproverDoc")
    public ResponseEntity<Map<String, Object>> searchApproverDoc(@RequestParam(required = false , defaultValue = "1") int currentPage , ApprovalDocVo vo , HttpSession session){
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();
        int listCount = approvalDocService.searchApproverDocCount(vo , loginEmpNo);
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;

        PageVo pvo = new PageVo(listCount , currentPage , pageLimit , boardLimit);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("vo" , vo);
        paramMap.put("pvo" , pvo);

        List<ApprovalDocVo> voList = approvalDocService.searchApproverDoc(paramMap , loginEmpNo);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("vo" , vo);
        resultMap.put("pvo" , pvo);
        resultMap.put("voList" , voList);


        return ResponseEntity.ok(resultMap);
    }

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
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();

        ApprovalDocVo detailVo = approvalDocService.selectDocDetail(docNo , loginEmpNo);
        return ResponseEntity.ok(detailVo);
    }

    // 승인
    @PutMapping("{docNo}/approve")
    public ResponseEntity<Map<String, Object>> approveDoc(
            @PathVariable String docNo,
            @RequestBody ApprovalDocVo vo,
            HttpSession session
    ) {
        System.out.println("docNo = " + docNo);
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();
        String approverComment = vo.getApproverComment();
        System.out.println("loginEmpNo = " + loginEmpNo);
        approvalDocService.approveDoc(docNo, approverComment, loginEmpNo);

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "승인 완료");
        return ResponseEntity.ok(map);
    }

    // 반려
    @PutMapping("{docNo}/reject")
    public ResponseEntity<Map<String, Object>> rejectDoc(
            @PathVariable String docNo,
            @RequestBody ApprovalDocVo vo,
            HttpSession session
    ) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();
        String approverComment = vo.getApproverComment();

        approvalDocService.rejectDoc(docNo, approverComment, loginEmpNo);

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
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();
        approvalDocService.deleteDoc(docNo, loginEmpNo);

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "삭제 완료");
        return ResponseEntity.ok(map);
    }
}
