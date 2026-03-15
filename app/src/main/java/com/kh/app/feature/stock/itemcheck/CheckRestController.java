package com.kh.app.feature.stock.itemcheck;

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
@RequestMapping("api/itemcheck")
@RestController
public class CheckRestController {
    private final CheckService checkService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    //검수 조회
    @GetMapping("list")
    public ResponseEntity<Map<String, Object>> selectList(@RequestParam(required = false, defaultValue = "1") int currentPage) {
        int listCount = checkService.selectCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<CheckVo> voList = checkService.selectList(pvo);
        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);
        return ResponseEntity.ok(map);
    }
    //상세조회
    @GetMapping("{itemreturnNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String itemreturnNo){
        CheckVo vo= checkService.selectOne(itemreturnNo);
        Map<String, Object>map = new HashMap<>();
        map.put("vo", vo);
        return ResponseEntity.ok(map);
    }

    //수정
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateByNo(@RequestBody CheckVo vo){
        int result = checkService.updateByNo(vo);
        if(result != 1){
            String errMsg = "검수 수정 오류";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

}

