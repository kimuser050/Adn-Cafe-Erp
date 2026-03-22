package com.kh.app.feature.finance.journal;

import com.kh.app.feature.finance.account.AccountVo;
import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/journal")
@RestController
public class JournalRestController {

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    private final JournalService journalService;

    @PostMapping("/insertJournal")
    public ResponseEntity<Integer> insertJournal(
            @RequestBody List<JournalVo> voList
            , HttpSession session) throws Exception {

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
            @RequestBody List<JournalVo> voList){

        int result = journalService.updateJournal(voList); //vo.getEmpNo()

        HashMap<String, Object> map = new HashMap<>();
        map.put("result" , result);

        return ResponseEntity.ok(result);
    }

    @PutMapping("/delJournal")
    public ResponseEntity<Integer> delJournal(@RequestParam String journalNo){
        int result = journalService.delJournal(journalNo);
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

    //총계정원장
    @GetMapping("/{accountNo}")
    public ResponseEntity<Map<String, Object>> totalList(
            @PathVariable("accountNo") String accountNo,
            @RequestParam(value="page", defaultValue="1") int currentPage){
        // 해당 계정의 전체 데이터 개수 조회
        int listCount = journalService.getTotalCount(accountNo);

        // PageVo 생성
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        // 페이징 처리된 리스트 조회
        List<JournalVo> journalList = journalService.totalList(accountNo, pvo);

        //결과 반환 (리스트와 페이징 정보를 함께 보냄)
        Map<String, Object> map = new HashMap<>();
        map.put("journalList", journalList);
        map.put("pvo", pvo);
        return ResponseEntity.ok(map);
    }


    //월계표
    @GetMapping("/monthListData")
    public List<JournalVo> monthList(@RequestParam String journalDate){
        return journalService.monthList(journalDate);
    }

    //일계표
    @GetMapping("/dailyListData")
    public List<JournalVo> dailyList(@RequestParam String journalDate){
        return journalService.dailyList(journalDate);
    }

    //재무상태표
    @GetMapping("/journalStateData")
    public List<JournalVo> journalState(@RequestParam String journalDate){
        return journalService.journalState(journalDate);
    }

    //손익계산서
    @GetMapping("/incomeStateData")
    public List<JournalVo> incomeState(@RequestParam String journalDate){
        return journalService.incomeState(journalDate);
    }
}
