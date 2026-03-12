package com.kh.app.feature.finance.account;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/account")
@RestController
public class AccountRestController {

    private final AccountService accountService;

    @PostMapping("/insertAccount")
    public ResponseEntity<Integer> insertAccount(AccountVo vo){
        int result = accountService.insertAccount(vo);

        Map<String, String> map = new HashMap<>();
        map.put("result" , result+"");
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Integer> deleteAccount(@RequestParam String accountNo){

        int result = accountService.deleteAccount(accountNo);

        Map<String, String> map = new HashMap<>();
        map.put("result" , String.valueOf(result));
        return ResponseEntity.ok(result);
    }

    @PostMapping("/list")
    public ResponseEntity<Map<String, Object>> accountList(@RequestParam String mainAccountNo){

        List<AccountVo> voList = accountService.accountList(mainAccountNo);

        Map<String, Object> map = new HashMap<>();
        map.put("voList" , voList);

        return ResponseEntity.ok(map);
    }
}
