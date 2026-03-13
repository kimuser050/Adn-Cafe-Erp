package com.kh.app.feature.finance.journal;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/account")
@Slf4j
public class JournalViewController {

    @GetMapping("/insertJournal")
    public String insertJournal(){
        return "/finance/journal/journal";
    }
}