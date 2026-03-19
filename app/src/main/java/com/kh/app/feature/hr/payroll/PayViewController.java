package com.kh.app.feature.hr.payroll;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hr/pay")
public class PayViewController {

    @GetMapping("list")
    public String list() {
        return "hr/pay/payList";
    }

    @GetMapping("insert")
    public String insert() {
        return "hr/pay/payInsert";
    }

}
