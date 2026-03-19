package com.kh.app.feature.stock.oderReq;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("stock")
public class OrderReqViewController {
    @GetMapping("order")
    public String order(){
        return "stock/item/orderReq";
    }

    @GetMapping("history")
    public String history(){
        return "stock/item/orderhistory";
    }
}


