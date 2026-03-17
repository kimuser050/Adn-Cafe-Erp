package com.kh.app.feature.stock.inbound;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inbound")
@Slf4j
public class InboundRestController {
    private final InboundService inboundService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    //입고 내역 조회만
    @GetMapping("selectList")
    public ResponseEntity<Map<String, Object>> selectList(@RequestParam(required = false, defaultValue = "1")int currentPage){
        int listCount = inboundService.selectCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<InboundVo> voList = inboundService.selectList(pvo);
        Map<String, Object>map = new HashMap<>();
        map.put("pvo",pvo);
        map.put("voList",voList);
        return ResponseEntity.ok(map);

    }



}
