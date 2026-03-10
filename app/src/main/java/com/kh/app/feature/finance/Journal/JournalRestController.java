package com.kh.app.feature.finance.Journal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/journal")
@RestController
public class JournalRestController {

    private final JournalService journalService;
}
