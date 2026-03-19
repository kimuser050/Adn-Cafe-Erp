package com.kh.app.feature.hr.att;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/att")
public class AttRestController {

    private final AttService attService;

//    // 1. 월별 전체조회
//    @GetMapping
//    public ResponseEntity<Map<String, Object>> selectList(@RequestParam String month) {
//        return ResponseEntity.ok(attService.selectList(month));
//    }
//
//    // 2. 상세조회
//    @GetMapping("/{empNo}")
//    public ResponseEntity<Map<String, Object>> selectDetail(
//            @PathVariable String empNo,
//            @RequestParam String month
//    ) {
//        return ResponseEntity.ok(attService.selectDetail(empNo, month));
//    }
//
//    // 3. 근태 수정
//    @PutMapping("/{attNo}")
//    public ResponseEntity<Map<String, String>> updateAttendance(
//            @PathVariable String attNo,
//            @RequestBody AttVo vo
//    ) {
//        vo.setAttNo(attNo);
//        attService.updateAttendance(vo);
//
//        Map<String, String> map = new HashMap<>();
//        map.put("msg", "근태 수정 완료");
//        return ResponseEntity.ok(map);
//    }
//
//    // 4. 출근
//    @PostMapping("/check-in")
//    public ResponseEntity<Map<String, String>> checkIn(@RequestBody AttVo vo) {
//        attService.checkIn(vo.getEmpNo());
//
//        Map<String, String> map = new HashMap<>();
//        map.put("msg", "출근 처리 완료");
//        return ResponseEntity.ok(map);
//    }
//
//    // 5. 퇴근
//    @PostMapping("/check-out")
//    public ResponseEntity<Map<String, String>> checkOut(@RequestBody AttVo vo) {
//        attService.checkOut(vo.getEmpNo());
//
//        Map<String, String> map = new HashMap<>();
//        map.put("msg", "퇴근 처리 완료");
//        return ResponseEntity.ok(map);
//    }
}