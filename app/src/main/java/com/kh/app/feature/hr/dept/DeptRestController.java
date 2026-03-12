package com.kh.app.feature.hr.dept;

import com.kh.app.feature.finance.Account.AccountService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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


}