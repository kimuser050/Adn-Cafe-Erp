package com.kh.app.feature;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
public class TestRestController {
    @GetMapping("test")
    public String test(){
        return "살려줘";
    }
}
