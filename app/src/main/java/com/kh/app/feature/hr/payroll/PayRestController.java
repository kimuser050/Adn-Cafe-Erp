package com.kh.app.feature.hr.payroll;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pay")
@Slf4j
public class PayRestController {

    private final PayService payService;

    // 1. 급여 등록
    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody PayMasterVo vo) {
        payService.insert(vo);

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "급여 등록 성공");
        return ResponseEntity.ok(map);
    }

    // 2. 월별 목록조회
    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList(@RequestParam(required = false) String month) {
        return ResponseEntity.ok(payService.selectList(month));
    }

    // 3. 상세조회
    @GetMapping("/{payNo}")
    public ResponseEntity<PayMasterVo> selectOne(@PathVariable String payNo) {
        return ResponseEntity.ok(payService.selectOne(payNo));
    }

    // 4. 이름 검색
    @GetMapping("/search/name")
    public ResponseEntity<Map<String, Object>> selectListByName(
            @RequestParam(required = false) String month,
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(payService.selectListByName(month, keyword));
    }

    // 5. 확정상태 검색
    @GetMapping("/search/confirmYn")
    public ResponseEntity<Map<String, Object>> selectListByConfirmYn(
            @RequestParam(required = false) String month,
            @RequestParam String confirmYn
    ) {
        return ResponseEntity.ok(payService.selectListByConfirmYn(month, confirmYn));
    }

    // 6. 급여 확정
    @PutMapping("/{payNo}/confirmY")
    public ResponseEntity<Map<String, Object>> confirmY(@PathVariable String payNo) {
        int result = payService.confirmY(payNo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        map.put("msg", "급여 확정 성공");
        return ResponseEntity.ok(map);
    }

    // 7. 급여 확정 취소
    @PutMapping("/{payNo}/confirmN")
    public ResponseEntity<Map<String, Object>> confirmN(@PathVariable String payNo) {
        int result = payService.confirmN(payNo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        map.put("msg", "급여 확정 취소 성공");
        return ResponseEntity.ok(map);
    }

    // 8. 급여 삭제 (논리삭제)
    @PutMapping("/{payNo}/delete")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String payNo) {
        int result = payService.delete(payNo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        map.put("msg", "급여 삭제 성공");
        return ResponseEntity.ok(map);
    }

    // 9. 급여 수정
    @PutMapping("/{payNo}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable String payNo,
            @RequestBody PayMasterVo vo
    ) {
        int result = payService.update(payNo, vo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        map.put("msg", "급여 수정 성공");
        return ResponseEntity.ok(map);
    }

    // 10. 등록/수정용 급여 항목 목록 조회
    @GetMapping("/items")
    public ResponseEntity<List<PayItemVo>> selectItemList() {
        return ResponseEntity.ok(payService.selectItemList());
    }

    // 11. 등록용 사원 검색
    @GetMapping("/emps")
    public ResponseEntity<List<PayEmpVo>> searchEmp(@RequestParam String keyword) {
        return ResponseEntity.ok(payService.searchEmp(keyword));
    }

    // 12. 사원 1명 선택 시 기본급/보너스율 포함 정보 조회
    @GetMapping("/emps/{empNo}")
    public ResponseEntity<PayEmpVo> selectEmpOne(@PathVariable String empNo) {
        return ResponseEntity.ok(payService.selectEmpOne(empNo));
    }
}