package com.kh.app.feature.hr.att;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hr/att")
public class AttViewController {

    @GetMapping("/list")
    public String list(){
        return "hr/att/attList";
    }


}
