package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.util.PageVo;
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
@RequestMapping("api/order")
@RestController
public class OderReqRestController {

    private final OderReqService oderReqService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    /**
     * [발주 물품 목록 조회]
     * 검색 키워드(keyword)와 페이징 처리를 포함합니다.
     */
    @GetMapping("list")
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(required = false) String keyword) {

        // 1. 검색 조건에 따른 전체 개수 조회
        int listCount = oderReqService.selectCount(keyword);

        // 2. 페이징 객체 생성
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        // 3. 목록 조회 (PVO와 Keyword 전달)
        List<OderReqVo> voList = oderReqService.selectList(pvo, keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    /**
     * [발주 상태 수정 - 관리자 모달용]
     * 상세 정보 모달에서 특정 발주 건의 상태를 변경할 때 사용합니다.
     */
    @PutMapping("status")
    public ResponseEntity<Map<String, Object>> updateStatus(@RequestBody OderReqVo vo) {
        log.info("상태 수정 요청: {}", vo);
        int result = oderReqService.updateStatus(vo);

        if(result < 1) {
            return ResponseEntity.internalServerError().build();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }
    // [발주 상태 탭] 주문 이력 조회
    @GetMapping("history")
    public ResponseEntity<Map<String, Object>> selectHistory(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(required = false) String keyword) {

        // 1. 발주 이력(ORDER_REQ)의 전체 개수 조회
        int listCount = oderReqService.selectHistoryCount(keyword);

        // 2. 페이징 처리
        PageVo pvo = new PageVo(listCount, currentPage, 5, 10); // 발주 상태용 페이징

        // 3. 이력 목록 조회 (상태값 포함)
        List<OderReqVo> voList = oderReqService.selectHistory(pvo, keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    /**
     * [발주 요청 - 다중 주문 처리]
     * 리스트에서 체크한 여러 품목을 List<OderReqVo> 형태로 한 번에 받습니다.
     */
    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> orderReqBulk(@RequestBody List<OderReqVo> voList) {
        log.info("다중 발주 요청 수량: {}건", voList.size());

        // Service에서 반복문을 돌리거나 MyBatis의 foreach를 사용하도록 구현
        int result = oderReqService.orderReqBulk(voList);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result", result);
        resultMap.put("msg", result > 0 ? "발주 성공" : "발주 실패");

        return ResponseEntity.ok(resultMap);
    }

    // 발주 상세조회
    @GetMapping("/{orderNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String orderNo){
        OderReqVo vo = oderReqService.selectOne(orderNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        return ResponseEntity.ok(map);
    }
}