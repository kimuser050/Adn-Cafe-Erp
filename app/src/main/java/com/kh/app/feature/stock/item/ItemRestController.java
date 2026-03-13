package com.kh.app.feature.stock.item;

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
@RequestMapping("/api/stock")
@RestController
public class ItemRestController {

    private final ItemService itemService;

    @GetMapping("itemList")
    public ResponseEntity<Map<String, Object>> selectList(ItemVo vo){
        List<ItemVo> voList = itemService.selectList(vo);
        System.out.println("voList = " + voList);
        Map<String, Object> map = new HashMap<>();
        map.put("voList" , voList);
        return ResponseEntity.ok(map);

    }
}
