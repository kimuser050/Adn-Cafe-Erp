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

    //발주물품 조회
    @GetMapping("list")
    public ResponseEntity<Map<String, Object>> selectList(@RequestParam(required = false , defaultValue = "1")int currentPage){
        int listCount = oderReqService.selectCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<OderReqVo> voList = oderReqService.selectList(pvo);
        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);
        return ResponseEntity.ok(map);

    }

    //발주 상세조회(test)
    @GetMapping("/{orderNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String orderNo){
        OderReqVo vo = oderReqService.selectOne(orderNo);
        Map<String, Object> map= new HashMap<>();
        map.put("vo",vo);
        return ResponseEntity.ok(map);

    }


    //발주 상태수정
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateStatus(@RequestBody OderReqVo vo){
        int result = oderReqService.updateStatus(vo);
        if(result != 1){
            String errMsg = "상태 수정 오류";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
        }

        //발주 요청
        @PostMapping
        public ResponseEntity<Map<String,Object>> orderReq(@RequestBody Map<String,Object> map){

            int result = oderReqService.orderReq(map);

            Map<String,Object> resultMap = new HashMap<>();
            resultMap.put("result", result);

            return ResponseEntity.ok(resultMap);
        }


}
