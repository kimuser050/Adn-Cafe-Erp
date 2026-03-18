package com.kh.app.feature.stock.inbound;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("stock")
public class InboundViewController {
    
    //입고내역 조회
    @GetMapping("inbound")
    public String inbound(){
        return  "stock/item/inboundList";
    }
}
