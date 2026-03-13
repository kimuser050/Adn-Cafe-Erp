package com.kh.app.feature.hr.store;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hr/store")
public class StoreViewController {

    @GetMapping("/list")
    public String list() {
        return "hr/store/storeList";
    }
}
