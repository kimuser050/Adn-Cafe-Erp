package com.kh.app.feature.finance.Account;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class AccountService {

    private final AccountMapper accountMapper;

    @Transactional
    public int insertAccount(AccountVo vo) {
        return accountMapper.insertAccount(vo);
    }

    @Transactional
    public int deleteAccount(String accountNo) {
        return accountMapper.deleteAccount(accountNo);
    }

    public List<AccountVo> accountList(String mainAccountNo) {
        return accountMapper.accountList(mainAccountNo);
    }
}
