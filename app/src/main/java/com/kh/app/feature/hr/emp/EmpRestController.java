package com.kh.app.feature.hr.emp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/emp")
@Slf4j
public class EmpRestController {

    private final EmpService empService;

    //1. 전체 조회하기
    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList(){
        List<EmpVo> voList = empService.selectList();

        Map<String, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }



}
