package com.kh.app.feature.hr.dept;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dept")
public class DeptViewController {

    @GetMapping("/list")
    public String list() {
        return "hr/dept/deptList";
    }
}
