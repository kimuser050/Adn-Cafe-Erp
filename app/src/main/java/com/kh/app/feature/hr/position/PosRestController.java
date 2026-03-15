package com.kh.app.feature.hr.position;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody PosVo vo) {
        int result = posService.insert(vo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList() {
        List<PosVo> voList = posService.selectList();
        int totalCount = voList.size();
        int activeCount = (int) voList.stream()
                .filter(vo -> "Y".equals(vo.getUseYn()))
                .count();

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);
        map.put("totalCount", totalCount);
        map.put("activeCount", activeCount);

        return ResponseEntity.ok(map);
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