package com.kh.app.feature.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
public class userController {
    @GetMapping("user")
    public String test(){
        return "user";
    }
}
