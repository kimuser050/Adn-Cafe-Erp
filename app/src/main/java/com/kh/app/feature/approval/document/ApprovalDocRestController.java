package com.kh.app.feature.approval.document;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    // 문서 작성
    @PostMapping("write")
    public ResponseEntity<Map<String, String>> insert(@RequestBody ApprovalDocVo vo){
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
    public ResponseEntity<HashMap<String, Object>> selectMyDocumentList(ApprovalDocVo vo , HttpSession session){
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
//        vo.setWriterNo(loginMemberVo.getEmpNo());

        List<ApprovalDocVo> voList= approvalDocService.selectMyDocumentList(vo);

        HashMap<String, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    // 결재함
    @GetMapping("selectApproverDocList")
    public ResponseEntity<HashMap<String, Object>> selectApproverDocList(ApprovalDocVo vo , HttpSession session){
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
//        vo.setApproverNo(loginMemberVo.getEmpNo());

        List<ApprovalDocVo> voList= approvalDocService.selectApproverDocList(vo);

        HashMap<String, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    // 상세조회
    @GetMapping("/{docNo}")
    public ResponseEntity<Map<String, Object>> selectByNo(@PathVariable String docNo){
        ApprovalDocVo vo = approvalDocService.selectOne(docNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);

        return ResponseEntity.ok(map);
    }

    // 문서 수정 (기안자)
    @PutMapping("/edit")
    public ResponseEntity<Map<String, Object>> editDocument(@RequestBody ApprovalDocVo vo){
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
    @PutMapping("/processApproval")
    public ResponseEntity<Map<String, Object>> processApproval(@RequestBody ApprovalDocVo vo){
        int result = approvalDocService.processApproval(vo);

        if(result != 1){
            String errMsg = "processApproval error";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result" , result);
        return ResponseEntity.ok(map);
    }

    // 결재 문서 삭제 (기안자)
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteDoc(@RequestBody ApprovalDocVo vo){
        int result = approvalDocService.deleteDoc(vo);

        if(result != 1){
            String errMsg = "delete document error";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result" , result);
        return ResponseEntity.ok(map);
    }
}
