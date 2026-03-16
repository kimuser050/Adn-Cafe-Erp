package com.kh.app.feature.stock.Products;

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
@RequestMapping("api/product")
@RequiredArgsConstructor
@Slf4j
public class ProductRestController {
    private final ProductService productService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    @GetMapping("list")
    public ResponseEntity<Map<String, Object>> list(@RequestParam(required = false, defaultValue = "1")int currentPage{
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
}
