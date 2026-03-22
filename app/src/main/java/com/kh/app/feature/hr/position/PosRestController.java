package com.kh.app.feature.hr.position;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/pos")
@RestController
public class PosRestController {

    private final PosService posService;

    @Value("${page.pageLimit}")
    private int pageLimit;   // 예: 5

    @Value("${page.boardLimit}")
    private int boardLimit;  // 예: 10

    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody PosVo vo) {
        int result = posService.insert(vo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                posService.selectList(currentPage, pageLimit, boardLimit)
        );
    }

    @GetMapping("/search/name")
    public ResponseEntity<Map<String, Object>> selectListByName(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                posService.selectListByName(keyword, currentPage, pageLimit, boardLimit)
        );
    }

    @GetMapping("/search/useYn")
    public ResponseEntity<Map<String, Object>> selectListByUseYn(
            @RequestParam String useYn,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                posService.selectListByUseYn(useYn, currentPage, pageLimit, boardLimit)
        );
    }

    @GetMapping("/{posCode}")
    public ResponseEntity<Map<String, Object>> selectDetail(@PathVariable String posCode) {
        PosVo vo = posService.selectDetail(posCode);
        List<PosMemberVo> memberList = posService.selectMemberList(posCode);

        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        map.put("memberList", memberList);

        return ResponseEntity.ok(map);
    }

    @PutMapping("/{posCode}/disable")
    public ResponseEntity<Map<String, Object>> disable(@PathVariable String posCode) {
        int result = posService.disable(posCode);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    @PutMapping("/{posCode}/enable")
    public ResponseEntity<Map<String, Object>> enable(@PathVariable String posCode) {
        int result = posService.enable(posCode);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    @PutMapping("/{posCode}/baseSalary")
    public ResponseEntity<Map<String, Object>> editBaseSalary(
            @PathVariable String posCode,
            @RequestBody PosVo vo
    ) {
        int result = posService.editBaseSalary(posCode, vo.getBaseSalary());

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    @PutMapping("/{posCode}/bonusRate")
    public ResponseEntity<Map<String, Object>> editBonusRate(
            @PathVariable String posCode,
            @RequestBody PosVo vo
    ) {
        int result = posService.editBonusRate(posCode, vo.getBonusRate());

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }
}