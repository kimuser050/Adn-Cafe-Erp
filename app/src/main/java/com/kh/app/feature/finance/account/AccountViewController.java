package com.kh.app.feature.finance.account;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/account")
@Slf4j
public class AccountViewController {

    @GetMapping("")
    public String mainAccount(){
        return "finance/account/accountMain";
    }

    @GetMapping("/insertAccount")
    public String insertAccount(){
        return "finance/account/account";
    }

}
