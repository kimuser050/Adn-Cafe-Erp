package com.kh.app.feature.stock.item;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("stock")
public class ItemViewController {

    @GetMapping("item")
    public String list() {
        return "hr/dept/deptList";
    }
}
