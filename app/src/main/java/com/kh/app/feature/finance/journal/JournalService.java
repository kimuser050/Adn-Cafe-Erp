package com.kh.app.feature.finance.journal;

import com.kh.app.feature.finance.account.AccountVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class JournalService {

    private final JournalMapper journalMapper;

    @Transactional
    public int insertJournal(List<JournalVo> voList) {

        if (voList == null || voList.size() < 2) {
            throw new IllegalArgumentException("차변과 대변 내역이 모두 필요합니다.");
        }
        // 1. 시퀀스에서 공통 전표번호 하나 가져오기
        String sharedNo = journalMapper.getJournalNo();
        int totalResult = 0;

        // 2. 리스트를 돌면서 차변/대변 입력
        for (JournalVo vo : voList) {
            vo.setJournalNo(sharedNo);
            totalResult += journalMapper.insertJournal(vo);
        }

        return totalResult;
    }

    @Transactional
    public int updateJournal(List<JournalVo> voList , String empNo) {

        if (voList == null || voList.size() < 2) {
            throw new IllegalArgumentException("차변과 대변 내역이 모두 필요합니다.");
        }

        String originalDate = voList.get(0).getJournalDate();
        String sharedNo = voList.get(0).getJournalNo();
        journalMapper.delJournalNo(sharedNo);

        int totalResult = 0;

        for (JournalVo vo : voList) {
            vo.setJournalNo(sharedNo);
            vo.setWriterNo(empNo);
            totalResult += journalMapper.insertJournal(vo);
        }

        return totalResult;
    }


    @Transactional
    public int delJournal(JournalVo vo) {
        return journalMapper.delJournal(vo);
    }


    public List<JournalVo> selectJournal(String journalDate) {
        return journalMapper.selectJournal(journalDate);
    }


    public List<AccountVo> getAccountList() {
        return journalMapper.getAccountList();
    }
}
