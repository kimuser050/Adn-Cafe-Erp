package com.kh.app.feature.stock.Products;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Update;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/product")
@RequiredArgsConstructor
@Slf4j
public class ProductRestController {
    private final ProductService productService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    //판매 상품 조회
    @GetMapping("list")
    public ResponseEntity<Map<String, Object>> list(@RequestParam(required = false, defaultValue = "1")int currentPage){

        int listCount = productService.selectCount();
        int pageLimit = this.pageLimit;
        int boardLimit = this.boardLimit;
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);
        List<ProductVo> voList = productService.list(pvo);
        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);
        return ResponseEntity.ok(map);
    }

    @GetMapping("{productNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String productNo){
        ProductVo vo = productService.selectOne(productNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);

        return ResponseEntity.ok(map);
    }
    //상품 등록
    @PostMapping("insert")
    public ResponseEntity<Map<String, String>> insert(@RequestBody ProductVo vo) {
        int result = productService.insert(vo);
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
    public ResponseEntity<Map<String, Object>> updateByNo(@RequestBody ProductVo vo){
        int result = productService.updateByNo(vo);
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
    @PutMapping("delete")
    public ResponseEntity<Map<String, Object>> deleteByNo(@RequestBody ProductVo vo){
        int result = productService.deleteByNo(vo);
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
