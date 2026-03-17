package com.kh.app.feature.hr.payroll;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pay")
@Slf4j
public class PayRestController {

    private final PayService payService;

    // 1. 급여 등록 (이거 좀 손봐야함 원래 거랑 좀 맞춰보기)
    @PostMapping
    public Map<String, String> insert(@RequestBody PayMasterVo vo) {
        payService.insert(vo);
        return Map.of("msg", "급여 등록 완료");
    }



}
