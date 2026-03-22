package com.kh.app.feature.hr.store;

import com.kh.app.feature.user.member.MemberVo;
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
@RequestMapping("/store")
@RestController
public class StoreRestController {

    private final StoreService storeService;

    @Value("${page.pageLimit}")
    private int pageLimit;   // 예: 5

    @Value("${page.boardLimit}")
    private int boardLimit;  // 예: 10

    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody StoreVo vo) {
        int result = storeService.insert(vo);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                storeService.selectList(currentPage, pageLimit, boardLimit)
        );
    }

    @GetMapping("/search/name")
    public ResponseEntity<Map<String, Object>> selectListByName(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                storeService.selectListByName(keyword, currentPage, pageLimit, boardLimit)
        );
    }

    @GetMapping("/search/statusName")
    public ResponseEntity<Map<String, Object>> selectListByStatusName(
            @RequestParam String statusName,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                storeService.selectListByStatusName(statusName, currentPage, pageLimit, boardLimit)
        );
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

    @PutMapping("/{storeCode}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@PathVariable String storeCode,
                                                            @RequestBody StoreVo vo) {
        int result = storeService.updateStatus(storeCode, Integer.parseInt(vo.getStatusCode()));

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