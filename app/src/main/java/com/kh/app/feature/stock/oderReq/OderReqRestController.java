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
@RequestMapping("/api/order") // ★ 앞에 슬래시(/) 추가! 절대경로 명시
@RestController
public class OderReqRestController {

    private final OderReqService oderReqService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    /**
     * [발주 물품 목록 조회]
     */
    @GetMapping("/list") // 앞에 / 추가 권장
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(required = false) String keyword) {

        int listCount = oderReqService.selectCount(keyword);
        PageVo pagingInfo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<OderReqVo> voList = oderReqService.selectList(pagingInfo, keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("pagingInfo", pagingInfo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    /**
     * [발주 이력 조회] - JS의 loadHistoryList에서 호출하는 주소
     */
    @GetMapping("/history") // 앞에 / 추가 권장
    public ResponseEntity<Map<String, Object>> selectHistory(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(required = false) String keyword) {

        int listCount = oderReqService.selectHistoryCount(keyword);
        // 이력 탭은 게시글 10개씩 노출
        PageVo pagingInfo = new PageVo(listCount, currentPage, 5, 10);
        List<OderReqVo> voList = oderReqService.selectHistory(pagingInfo, keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("pagingInfo", pagingInfo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    /**
     * [발주 상태 수정]
     */
    @PutMapping("/status") // 앞에 / 추가 권장
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

    /**
     * [발주 상세조회]
     */
    @GetMapping("/{orderNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String orderNo){
        OderReqVo vo = oderReqService.selectOne(orderNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        return ResponseEntity.ok(map);
    }

    /**
     * [발주 요청 - 다중 주문 처리]
     */
    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> orderReqBulk(@RequestBody List<OderReqVo> voList) {
        log.info("다중 발주 요청 수량: {}건", voList.size());
        int result = oderReqService.orderReqBulk(voList);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result", result);
        resultMap.put("msg", result > 0 ? "발주 성공" : "발주 실패");

        return ResponseEntity.ok(resultMap);
    }
}