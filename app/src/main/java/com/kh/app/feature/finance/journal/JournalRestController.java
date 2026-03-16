package com.kh.app.feature.finance.journal;

import com.kh.app.feature.finance.account.AccountVo;
import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/journal")
@RestController
public class JournalRestController {

    private final JournalService journalService;

    @PostMapping("/insertJournal")
    public ResponseEntity<Integer> insertJournal(
            @RequestBody List<JournalVo> voList
            , HttpSession session){

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo != null) {
            for (JournalVo vo : voList) {
                vo.setWriterNo(loginMemberVo.getEmpNo());
            }
        }

        int result = journalService.insertJournal(voList);
        System.out.println("result = " + result);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/updateJournal")
    public ResponseEntity<Integer> updateJournal(
            @RequestBody List<JournalVo> voList
            , HttpSession session){

        String empNo = "200001";
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
//        if (loginMemberVo != null) {
//            for (JournalVo vo : voList) {
//                vo.setWriterNo(loginMemberVo.getEmpNo());
//            }
//        }

        int result = journalService.updateJournal(voList, empNo); //vo.getEmpNo()

        HashMap<String, Object> map = new HashMap<>();
        map.put("result" , result);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delJournal")
    public ResponseEntity<Integer> delJournal(
            @RequestBody JournalVo vo
            , HttpSession session){
        String empNo = "200001";
        vo.setWriterNo(empNo);
//        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
//        vo.setWriterNo(loginMemberVo.getEmpNo());

        int result = journalService.delJournal(vo);
        if(result < 1){
            String errMsg = "전표 삭제 실패";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("result" , result);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/selectJournal")
    public ResponseEntity<List<JournalVo>> selectJournal(@RequestParam String journalDate){

        List<JournalVo> voList = journalService.selectJournal(journalDate);

        return ResponseEntity.ok(voList);
    }

    @GetMapping("/getAccountList")
    public List<AccountVo> getAccountList(){

        return journalService.getAccountList();
    }

    @GetMapping("/{accountNo}")
    public List<JournalVo> totalList(@PathVariable("accountNo") String accountNo){
        return journalService.totalList(accountNo);
    }

    @GetMapping("/monthList")
    public List<JournalVo> monthList(@RequestParam String journalDate){
        return journalService.monthList(journalDate);
    }

    @GetMapping("/dailyList")
    public List<JournalVo> dailyList(@RequestParam String journalDate){
        return journalService.dailyList(journalDate);
    }
}
