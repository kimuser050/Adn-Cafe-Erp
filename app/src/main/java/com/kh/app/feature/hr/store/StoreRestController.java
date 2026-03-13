package com.kh.app.feature.hr.store;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/store")
@RequiredArgsConstructor
@Slf4j
public class StoreRestController {

    private final StoreService storeService;

    // 0. 신규매장 등록하기
    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody StoreVo vo){

        int result = storeService.insert(vo);

        if(result != 1){
            String errMsg = "에러코드";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    // 1. 매장리스트 가져오기
    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList() {
        List<StoreVo> voList = storeService.selectList();

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    // 2. 매장 상세조회 하기


}
