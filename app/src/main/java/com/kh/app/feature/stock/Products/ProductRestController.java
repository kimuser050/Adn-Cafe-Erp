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

    // 상품 목록 조회 (검색 기능 반영)
    @GetMapping("list")
    public ResponseEntity<Map<String, Object>> list(
            @RequestParam(required = false, defaultValue = "1") int currentPage,
            @RequestParam(required = false, defaultValue = "") String keyword // 검색어 기본값 빈 문자열
    ) {
        // 1. 검색어가 포함된 전체 개수를 가져와야 페이징이 정확함
        int listCount = productService.selectCount(keyword);

        // 2. 페이징 객체 생성
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        // 3. 검색어와 페이징 정보를 서비스에 전달
        List<ProductVo> voList = productService.list(pvo, keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    // 상세 조회
    @GetMapping("{productNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String productNo) {
        ProductVo vo = productService.selectOne(productNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        return ResponseEntity.ok(map);
    }

    // 상품 등록
    @PostMapping("insert")
    public ResponseEntity<Map<String, String>> insert(@RequestBody ProductVo vo) {
        int result = productService.insert(vo);
        if (result != 1) {
            log.error("품목 등록 실패: {}", vo);
            return ResponseEntity.internalServerError().build();
        }
        Map<String, String> map = new HashMap<>();
        map.put("result", String.valueOf(result));
        return ResponseEntity.ok(map);
    }

    // 수정
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateByNo(@RequestBody ProductVo vo) {
        int result = productService.updateByNo(vo);
        if (result != 1) {
            log.error("품목 수정 실패: {}", vo);
            return ResponseEntity.internalServerError().build();
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }
}
//    // 삭제 (소프트 삭제)
//    @PutMapping("delete")
//    public ResponseEntity<Map<String, Object>> deleteByNo(@RequestBody ProductVo vo){
//        int result = productService.deleteByNo(vo);
//        if(result != 1){
//            log.error("품목 삭제 실패: {}", vo);
//            return ResponseEntity.internalServerError().build();
//        }
//        Map<String, Object> map = new HashMap<>();
//        map.put("result", result);
//        return ResponseEntity.ok(map);
//    }
//}