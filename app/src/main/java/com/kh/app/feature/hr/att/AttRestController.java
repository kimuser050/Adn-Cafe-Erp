package com.kh.app.feature.hr.att;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/att")
public class AttRestController {

    private final AttService attService;

    // 1. 특정 날짜 전 직원 기본 근태 row 생성
    // 스케줄러 : 정각에 오늘 날짜 근태 미리 다 생성할 거임
    // - workDate를 받아서 해당 날짜에 근태 row 없는 재직자들의 기본 row 생성
    @PostMapping("/init")
    public ResponseEntity<Map<String, Object>> initDailyAttendance(@RequestParam String workDate) {
        int count = attService.initDailyAttendance(workDate);

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "기본 근태 row 생성 완료");
        map.put("count", count);

        return ResponseEntity.ok(map);
    }

    // 2. 월별 전체 근태 조회
    // - month(yyyy-MM)를 받아서
    // - 상단 요약(summary)
    // - 직원별 월간 집계 리스트(voList)
    // - 를 반환
    @GetMapping
    public ResponseEntity<Map<String, Object>> selectMonthAttendance(@RequestParam String month){
        Map<String, Object> result = attService.selectMonthAttendance(month);

        return ResponseEntity.ok(result);
    }


    // 3. 사원별 월간 상세 조회
    // - empNo + month(yyyy-MM)를 받아서
    // - 사원 기본정보(memberInfo)
    // - 사원 월간 요약(summary)
    // - 일별 근태 이력(historyList)
    @GetMapping("/{empNo}")
    public ResponseEntity<Map<String, Object>> selectEmpMonthDetail(@PathVariable String empNo, @RequestParam String month) {
        Map<String, Object> result = attService.selectEmpMonthDetail(empNo, month);

        return ResponseEntity.ok(result);
    }

    // 4. 근태 수정
    // - attNo를 기준으로
    // - 상태 / 출근시간 / 퇴근시간 / 신청OT / 인정OT / 비고 수정
    @PutMapping("/{attNo}")
    public ResponseEntity<Map<String, String>> updateAttendance(@PathVariable String attNo, @RequestBody AttVo vo) {
        vo.setAttNo(attNo);
        attService.updateAttendance(vo);

        Map<String, String> map = new HashMap<>();
        map.put("msg", "근태 수정 완료");

        return ResponseEntity.ok(map);
    }

    // 5. 출근 버튼 처리
    // - empNo를 받아서 오늘 날짜 row를 기준으로 출근 처리
    // - 오늘 row가 없으면 insert 또는 예외 정책 결정
    // - 오늘 row가 있으면 checkIn / status update
    // - 휴가 상태면 출근 불가
    @PostMapping("/check-in")
    public ResponseEntity<Map<String, String>> checkIn(@RequestParam String empNo) {
        attService.checkIn(empNo);

        Map<String, String> map = new HashMap<>();
        map.put("msg", "출근 처리 완료");

        return ResponseEntity.ok(map);
    }

    // 6. 퇴근 버튼 처리
    // - empNo를 받아서 오늘 날짜 row를 기준으로 퇴근 처리
    // - checkOut 시간 저장
    // - 신청 OT가 있으면 인정 OT 계산 후 저장
    @PostMapping("/check-out")
    public ResponseEntity<Map<String, String>> checkOut(@RequestParam String empNo) {
        attService.checkOut(empNo);

        Map<String, String> map = new HashMap<>();
        map.put("msg", "퇴근 처리 완료");

        return ResponseEntity.ok(map);
    }

    // 7. 결근 마감 처리
    // - 특정 날짜를 받아서
    // - 출근 안 한 사람 / 상태 미확정(null) row를 결근으로 처리
    // - 테스트용으로 먼저 만들고, 나중에 스케줄러로 이동할 예정
    @PostMapping("/absent")
    public ResponseEntity<Map<String, Object>> markAbsent(@RequestParam String workDate) {
        int count = attService.markAbsent(workDate);

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "결근 마감 처리 완료");
        map.put("count", count);

        return ResponseEntity.ok(map);
    }

}