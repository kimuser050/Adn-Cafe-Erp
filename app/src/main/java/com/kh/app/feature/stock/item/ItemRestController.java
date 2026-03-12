package com.kh.app.feature.stock.item;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/item")
@RestController
public class ItemRestController {
    public void test(int x){
        System.out.println("test!!");

    }
}
