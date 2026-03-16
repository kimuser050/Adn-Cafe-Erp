package com.kh.app.feature.user.qna.answerComment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerCommentService {

    private final AnswerCommentMapper answerCommentMapper;

    @Transactional
    public int insert(AnswerCommentVo vo){
        return answerCommentMapper.insert(vo);
    }

    public List<AnswerCommentVo> selectList(String replyNo){
        return answerCommentMapper.selectList(replyNo);
    }

    @Transactional
    public int del(AnswerCommentVo vo){
        return answerCommentMapper.delete(vo);
    }

    @Transactional
    public int update(AnswerCommentVo vo){
        return answerCommentMapper.update(vo);
    }
}
