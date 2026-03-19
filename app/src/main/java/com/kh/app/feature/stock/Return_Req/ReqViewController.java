package com.kh.app.feature.stock.Return_Req;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("stock")
public class ReqViewController {

    @GetMapping("return")
    public String req(){
        return "stock/item/return";
    }
}
