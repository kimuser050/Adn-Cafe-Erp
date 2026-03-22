package com.kh.app.feature.hr.att;

import com.kh.app.feature.hr.position.PosVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${page.pageLimit}")
    private int pageLimit;   // 예: 5

    @Value("${page.boardLimit}")
    private int boardLimit;  // 예: 10

    // 1. 오늘(또는 특정 날짜) 기본 근태 row 생성
    // - 재직 중인 사람들 중
    // - 아직 그 날짜 근태 row가 없는 사람만 생성
    // - 지금은 테스트용으로 직접 호출
    // - 나중에는 스케줄러로 돌릴 예정
    @PostMapping("/init")
    public ResponseEntity<Map<String, Object>> initDailyAttendance(@RequestParam String workDate) {
        int count = attService.initDailyAttendance(workDate);

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "기본 근태 row 생성 완료");
        map.put("count", count);

        return ResponseEntity.ok(map);
    }

    // 2. 월별 전체 근태 조회
    // - month(yyyy-MM) 기준
    // - 상단 카드 summary + 직원별 리스트 voList 같이 반환
    @GetMapping
    public ResponseEntity<Map<String, Object>> selectMonthAttendance(
            @RequestParam String month,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        Map<String, Object> result = attService.selectMonthAttendance(month, currentPage, pageLimit, boardLimit);
        return ResponseEntity.ok(result);
    }

    // 3. 선택한 사원의 월간 상세조회
    // - empNo + month 기준
    // - 기본정보 / 월간 요약 / 일별 이력 반환
    @GetMapping("/{empNo}")
    public ResponseEntity<Map<String, Object>> selectEmpMonthDetail(
            @PathVariable String empNo,
            @RequestParam String month
    ) {
        Map<String, Object> result = attService.selectEmpMonthDetail(empNo, month);
        return ResponseEntity.ok(result);
    }

    // 4. 근태 수동 수정
    // - 관리자 수정용
    // - attNo 기준으로 한 줄 수정
    @PutMapping("/{attNo}")
    public ResponseEntity<Map<String, String>> updateAttendance(
            @PathVariable String attNo,
            @RequestBody AttVo vo
    ) {
        vo.setAttNo(attNo);
        attService.updateAttendance(vo);

        Map<String, String> map = new HashMap<>();
        map.put("msg", "근태 수정 완료");
        return ResponseEntity.ok(map);
    }

    // 5. 출근 버튼 처리
    // - 오늘 row 기준으로 출근 찍기
    // - 9시 전이면 출근(1), 이후면 지각(2)
    @PostMapping("/check-in")
    public ResponseEntity<Map<String, String>> checkIn(@RequestParam String empNo) {
        Map<String, String> map = new HashMap<>();

        try {
            attService.checkIn(empNo);
            map.put("msg", "출근 처리 완료");
            return ResponseEntity.ok(map);
        } catch (IllegalStateException e) {
            map.put("msg", e.getMessage());
            return ResponseEntity.badRequest().body(map);
        }
    }

    // 6. 퇴근 버튼 처리
    // - 오늘 row 기준으로 퇴근 찍기
    // - 승인 OT 있으면 인정시간 계산
    @PostMapping("/check-out")
    public ResponseEntity<Map<String, String>> checkOut(@RequestParam String empNo) {
        Map<String, String> map = new HashMap<>();

        try {
            attService.checkOut(empNo);
            map.put("msg", "퇴근 처리 완료");
            return ResponseEntity.ok(map);
        } catch (IllegalStateException e) {
            map.put("msg", e.getMessage());
            return ResponseEntity.badRequest().body(map);
        }
    }

    // 7. 결근 마감 처리
    // - 특정 날짜 기준
    // - 상태 null + 출근시간 null인 row를 결근(3)으로 처리
    // - 지금은 테스트용, 나중에 스케줄러로 이동
    @PostMapping("/absent")
    public ResponseEntity<Map<String, Object>> markAbsent(@RequestParam String workDate) {
        int count = attService.markAbsent(workDate);

        Map<String, Object> map = new HashMap<>();
        map.put("msg", "결근 마감 처리 완료");
        map.put("count", count);

        return ResponseEntity.ok(map);
    }


    // 이름 검색
    @GetMapping("/search/name")
    public ResponseEntity<Map<String, Object>> selectListByName(
            @RequestParam String month,
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        Map<String, Object> map = attService.selectListByName(month, keyword, currentPage, pageLimit, boardLimit);
        return ResponseEntity.ok(map);
    }

    // 부서 검색
    @GetMapping("/search/deptName")
    public ResponseEntity<Map<String, Object>> selectListByDept(
            @RequestParam String month,
            @RequestParam String deptName,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        Map<String, Object> map = attService.selectListByDeptName(month, deptName, currentPage, pageLimit, boardLimit);
        return ResponseEntity.ok(map);
    }
}