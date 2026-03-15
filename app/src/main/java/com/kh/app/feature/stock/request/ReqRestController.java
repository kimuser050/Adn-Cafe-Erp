package com.kh.app.feature.stock.request;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/reqreturn")
@RestController
public class ReqRestController {

    private final ReqService reqService;

    //반품신청
    @PostMapping("insert")
    public ResponseEntity<Map<String, String>> reinsert(@RequestBody ReqVo vo){
        int result = reqService.reqinsert(vo);
        if(result != 1){
            String errMsg = "반품신청 안됨";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        Map<String, String> map = new HashMap<>();
        map.put("result", result + "");
        return ResponseEntity.ok(map);

    }

}
