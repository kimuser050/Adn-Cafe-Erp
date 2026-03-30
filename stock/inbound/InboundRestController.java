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
    /**
     * 입고 내역 조회 (페이징 + 검색)
     */
    @GetMapping("selectList")
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
            @RequestParam(value = "keyword", required = false) String keyword) {

        // 1. 검색 조건이 반영된 전체 데이터 개수 조회
        int listCount = inboundService.selectCount(keyword);

        // 2. 페이징 객체 생성
        PageVo pvo = new PageVo(listCount, currentPage, this.pageLimit, this.boardLimit);

        // 3. 해당 페이지의 목록 조회
        List<InboundVo> voList = inboundService.selectList(pvo, keyword);

        // 4. 결과 반환
        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }
}