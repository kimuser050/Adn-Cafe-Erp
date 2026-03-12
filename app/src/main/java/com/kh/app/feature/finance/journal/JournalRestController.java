package com.kh.app.feature.finance.journal;

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
    public ResponseEntity<Integer> insertJournal(@RequestBody List<JournalVo> voList){
        int result = journalService.insertJournal(voList);
        return ResponseEntity.ok(result);
    }
}
