package com.kh.app.feature.hr.emp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/emp")
@Slf4j
public class EmpRestController {

    private final EmpService empService;

    // 1. 전체조회
    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList() {
        List<EmpVo> voList = empService.selectList();

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    // 2. 직원 상세조회 + 해당 직원 인사이력 조회
    @GetMapping("/{empNo}")
    public ResponseEntity<Map<String, Object>> selectDetail(@PathVariable String empNo) {
        EmpVo vo = empService.selectDetail(empNo);
        List<EmpHistoryVo> empHistoryList = empService.selectEmpHistory(empNo);

        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        map.put("empHistoryList", empHistoryList);

        return ResponseEntity.ok(map);
    }

    // 3. 직원 기본정보 수정
    @PutMapping("/{empNo}")
    public ResponseEntity<Map<String, Object>> edit(@PathVariable String empNo,
                                                    @RequestBody EmpVo vo) {
        vo.setEmpNo(empNo);

        int result = empService.edit(vo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    // 4. 해당 직원 인사이력 추가
    @PostMapping("/{empNo}/history")
    public ResponseEntity<Map<String, Object>> insertEmpHistory(@PathVariable String empNo,
                                                                @RequestBody EmpHistoryVo vo) {
        vo.setEmpNo(empNo);

        int result = empService.insertEmpHistory(vo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    // 5. 인사이력 수정
    @PutMapping("/history/{hisNo}")
    public ResponseEntity<Map<String, Object>> editEmpHistory(@PathVariable String hisNo,
                                                              @RequestBody EmpHistoryVo vo) {
        vo.setHisNo(hisNo);

        int result = empService.editEmpHistory(vo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }


    // 상태 목록 조회
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> selectStatusList() {
        List<CurrentStatusVo> statusList = empService.selectStatusList();

        Map<String, Object> map = new HashMap<>();
        map.put("statusList", statusList);

        return ResponseEntity.ok(map);
    }
}