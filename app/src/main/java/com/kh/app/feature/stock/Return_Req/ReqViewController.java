package com.kh.app.feature.stock.Return_Req;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("return")
public class ReqViewController {

    @GetMapping
    public String req(){
        return "stock/req/return";
    }
}
