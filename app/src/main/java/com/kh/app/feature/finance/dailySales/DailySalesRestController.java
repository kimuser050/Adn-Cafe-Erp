package com.kh.app.feature.finance.dailySales;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/dailySales")
@RestController
public class DailySalesRestController {

    private final DailySalesService dailySalesService;

    @PostMapping("/insertDaily")
    public ResponseEntity<HashMap<String, String>> insertDaily(@RequestBody DailySalesVo vo) throws Exception {

        int result = dailySalesService.insertDaily(vo);

        HashMap<String, String> map = new HashMap<>();
        map.put("result" , result+"");
        return ResponseEntity.ok(map);
    }

    @PutMapping("/editDaily")
    public ResponseEntity<Map<String, String>> editDaily(@RequestBody DailySalesVo vo) throws Exception {

        int result = dailySalesService.editDaily(vo);

        Map<String, String> map = new HashMap<>();
        map.put("result" , result+"");
        return ResponseEntity.ok(map);
    }

    @DeleteMapping("/delDaily")
    public ResponseEntity<Map<String, String>> delDaily(@RequestBody DailySalesVo vo) throws Exception {
        int result = dailySalesService.delDaily(vo);

        Map<String, String> map = new HashMap<>();
        map.put("result" , result+"");
        return ResponseEntity.ok(map);
    }

    @GetMapping("/listDaily")
    public ResponseEntity<Map<Object, Object>> listDaily(DailySalesVo vo) throws Exception {
        List<DailySalesVo> voList = dailySalesService.listDaily(vo);

        Map<Object, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/storeIncome")
    public ResponseEntity<Map<Object, Object>> storeIncome(@RequestParam String salesDate) throws Exception {

        List<DailySalesVo> voList = dailySalesService.storeIncome(salesDate);

        Map<Object, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }

    @GetMapping("/productIncome")
    public ResponseEntity<Map<Object, Object>> productIncome(String salesDate) throws Exception {

        List<DailySalesVo> voList = dailySalesService.productIncome(salesDate);

        Map<Object, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }
}
