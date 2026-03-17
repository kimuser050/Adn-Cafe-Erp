package com.kh.app.feature.stock.item;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("stock")
public class ItemViewController {

    //품목 조회
    @GetMapping("item")
    public String list() {
        return "stock/item/list";
    }

    //품목수정

    //품목 삭제

    //품목 등록
}
