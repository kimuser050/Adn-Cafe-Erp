package com.kh.app.feature.finance.journal;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/journal")
@Slf4j
public class JournalViewController {

    @GetMapping("/insertJournal")
    public String insertJournal(){
        return "/finance/journal/journal";
    }

    @GetMapping("/totalList")
    public String totalList(){
        return "finance/journal/totalList";
    }

    @GetMapping("/monthList")
    public String monthList(){
        return "finance/journal/monthList";
    }

    @GetMapping("/dailyList")
    public String dailyList(){
        return "finance/journal/dailyList";
    }

    @GetMapping("/journalState")
    public String journalState(){
        return "finance/journal/journalState";
    }

    @GetMapping("/incomeState")
    public String incomeState(){
        return "finance/journal/incomeState";
    }


}