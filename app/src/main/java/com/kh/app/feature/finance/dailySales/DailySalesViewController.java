package com.kh.app.feature.finance.dailySales;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/dailySales")
@Controller
public class DailySalesViewController {

    @GetMapping("/insertDaily")
    public String insertDaily(){
        return "/finance/dailySales/dailySales";
    }
}
