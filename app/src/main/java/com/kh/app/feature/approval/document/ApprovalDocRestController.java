package com.kh.app.feature.approval.document;

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

    @PostMapping("write")
    public ResponseEntity<Map<String, String>> insert(@RequestBody ApprovalDocVo vo){
        int result = approvalDocService.insert(vo);

        if(result != 1){
            String errMsg = "write fail";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, String> map = new HashMap<>();
        map.put("result" , result + "");
        return ResponseEntity.ok(map);
    }

    @GetMapping("selectDocList")
    public ResponseEntity<HashMap<String, Object>> selectDocList(ApprovalDocVo vo){
        List<ApprovalDocVo> voList= approvalDocService.selectDocList(vo);

        HashMap<String, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/{docNo}")
    public ResponseEntity<Map<String, Object>> selectByNo(@PathVariable String docNo){
        ApprovalDocVo vo = approvalDocService.selectOne(docNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);

        return ResponseEntity.ok(map);
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateByNo(ApprovalDocVo vo){
        int result = approvalDocService.updateByNo(vo);

        if(result != 1){
            String errMsg = "update error";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result" , result);
        return ResponseEntity.ok(map);
    }
}
