package com.kh.app.feature.hr;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
@Slf4j
@RequiredArgsConstructor
public class HrTestController {

    @GetMapping("hr")
    public String hr() {
        return "hr test";
    }
}
