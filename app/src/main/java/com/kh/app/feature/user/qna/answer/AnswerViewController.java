package com.kh.app.feature.user.qna.answer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("qna/answer")
@Controller
public class AnswerViewController {

    @GetMapping("insert")
    public String insert(){
        return "user/qna/answer/insert";
    }
}
