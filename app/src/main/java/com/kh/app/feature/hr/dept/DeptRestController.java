package com.kh.app.feature.hr.dept;

import com.kh.app.feature.hr.position.PosVo;
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
@RequestMapping("/dept")
@RestController
public class DeptRestController {

    private final DeptService deptService;

    @Value("${page.pageLimit}")
    private int pageLimit;   // 예: 5

    @Value("${page.boardLimit}")
    private int boardLimit;  // 예: 10

    // 0. 신규부서 등록하기
    @PostMapping
    public ResponseEntity<Map<String, Object>> insert(@RequestBody DeptVo vo){

        int result = deptService.insert(vo);

        if(result != 1){
            String errMsg = "에러코드";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }


    // 1. 부서리스트 가져오기
    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                deptService.selectList(currentPage, pageLimit, boardLimit)
        );
    }

    @GetMapping("/search/name")
    public ResponseEntity<Map<String, Object>> selectListByName(
            @RequestParam String keyword,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                deptService.selectListByName(keyword, currentPage, pageLimit, boardLimit)
        );
    }

    @GetMapping("/search/useYn")
    public ResponseEntity<Map<String, Object>> selectListByUseYn(
            @RequestParam String useYn,
            @RequestParam(required = false, defaultValue = "1") int currentPage
    ) {
        return ResponseEntity.ok(
                deptService.selectListByUseYn(useYn, currentPage, pageLimit, boardLimit)
        );
    }


    // 2. 부서 상세조회 하기
    @GetMapping("/{deptCode}")
    public ResponseEntity<Map<String, Object>> selectDetail(@PathVariable String deptCode){
        Map<String, Object> map = deptService.selectDetail(deptCode);
        return ResponseEntity.ok(map);
    }

    // 3. 부서 비활성화 하기
    @PutMapping("/{deptCode}/disable")
    public ResponseEntity<Map<String, Object>> disable(@PathVariable String deptCode) {
        int result = deptService.disable(deptCode);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    //3.1 부서 활성화 하기
    @PutMapping("/{deptCode}/enable")
    public ResponseEntity<Map<String, Object>> enable(@PathVariable String deptCode) {
        int result = deptService.enable(deptCode);

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    //4. 부서 근무위치 수정하기
    @PutMapping("/{deptCode}/address")
    public ResponseEntity<Map<String, Object>> editAddress(
            @PathVariable String deptCode,
            @RequestBody DeptVo vo
    ) {
        int result = deptService.editAddress(deptCode, vo.getDeptAddress());

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

    //5. 부서 관리자 수정하기
    @PutMapping("/{deptCode}/manager")
    public ResponseEntity<Map<String, Object>> editManager(
            @PathVariable String deptCode,
            @RequestBody DeptVo vo
    ) {
        int result = deptService.editManager(deptCode, vo.getManagerEmpNo());

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);

        return ResponseEntity.ok(map);
    }

}