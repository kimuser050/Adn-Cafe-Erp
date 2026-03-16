package com.kh.app.feature.stock.item;

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
@RequestMapping("/api/stock")
@RestController
public class ItemRestController {

    private final ItemService itemService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    //품목 조회
    @GetMapping("itemList")
    public ResponseEntity<Map<String, Object>> selectList(@RequestParam(required = false , defaultValue = "1")int currentPage){
        int listCount = itemService.selectCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<ItemVo> voList = itemService.selectList(pvo);
        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);
        return ResponseEntity.ok(map);

    }
    //상세조회
    @GetMapping("{itemNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String itemNo){
        ItemVo vo = itemService.selectOne(itemNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);

        return ResponseEntity.ok(map);
    }
    //품목 등록
    @PostMapping("insert")
    public ResponseEntity<Map<String, String>> insert(@RequestBody ItemVo vo) {
        int result = itemService.insert(vo);
        System.out.println("vo = " + vo);
        if (result != 1) {
            String errMsg = "품목 등록 x ~...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, String> map = new HashMap<>();
        map.put("result", result + "");
        return ResponseEntity.ok(map);
    }
    //수정
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateByNo(@RequestBody ItemVo vo){
        int result = itemService.updateByNo(vo);
        if(result != 1){
            String errMsg = "품목수정 실패...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result" , result);
        return ResponseEntity.ok(map);
    }
    //삭제
    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteByNo(@RequestBody ItemVo vo){
        int result = itemService.deleteByNo(vo);
        if(result != 1){
            String errMsg = "품목 삭제 실패...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result" , result);
        return ResponseEntity.ok(map);
    }





}