package com.kh.app.feature.hr.emp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hr/emp")
public class EmpViewController {

    @GetMapping("/list")
    public String list() {
        return "hr/emp/empList";
    }
}
