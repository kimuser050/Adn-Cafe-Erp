package com.kh.app.feature.hr.dept;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/dept")
@RestController
public class DeptRestController {

    private final DeptService deptService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList() {
        List<DeptVo> voList = deptService.selectList();

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/{deptCode}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String deptCode){
        DeptVo vo = deptService.selectOne(deptCode);

        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);

        return ResponseEntity.ok(map);
    }

}