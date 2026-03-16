package com.kh.app.feature.user.qna.question;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionMapper questionMapper;

    @Transactional
    public int insert(QuestionVo vo) {
        return questionMapper.insert(vo);
    }
}
