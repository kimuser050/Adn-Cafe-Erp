package com.kh.app.feature.hr.store;

import com.kh.app.feature.user.member.MemberVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/store")
@RestController
public class StoreRestController {

    private final StoreService storeService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody StoreVo vo) {
        int result = storeService.insert(vo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList() {
        List<StoreVo> voList = storeService.selectList();

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/search/name")
    public ResponseEntity<Map<String, Object>> selectListByName(@RequestParam String keyword) {
        List<StoreVo> voList = storeService.selectListByName(keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/search/statusName")
    public ResponseEntity<Map<String, Object>> selectListByStatusName(@RequestParam String statusName) {
        List<StoreVo> voList = storeService.selectListByStatusName(statusName);

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/{storeCode}")
    public ResponseEntity<Map<String, Object>> selectDetail(@PathVariable String storeCode) {
        StoreVo vo = storeService.selectDetail(storeCode);
        List<MemberVo> managerList = storeService.selectManagerList();

        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        map.put("managerList", managerList);

        return ResponseEntity.ok(map);
    }

    @PostMapping("/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@RequestParam String storeCode,
                                                            @RequestParam int statusCode) {
        int result = storeService.updateStatus(storeCode, statusCode);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        map.put("msg", "상태 변경 성공");

        return ResponseEntity.ok(map);
    }

    @PutMapping("/{storeCode}/address")
    public ResponseEntity<Map<String, Object>> editAddress(@PathVariable String storeCode,
                                                           @RequestBody StoreVo vo) {
        int result = storeService.editAddress(storeCode, vo.getStoreAddress());

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    @PutMapping("/{storeCode}/manager")
    public ResponseEntity<Map<String, Object>> editManager(@PathVariable String storeCode,
                                                           @RequestBody StoreVo vo) {
        int result = storeService.editManager(storeCode, vo.getOwnerEmpNo());

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }
}