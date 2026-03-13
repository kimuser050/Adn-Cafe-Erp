package com.kh.app.feature.user.noticeComment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class NoticeCommentService {

    private final NoticeCommentMapper noticeCommentMapper;

    @Transactional
    public int insert(NoticeCommentVo vo) {
        return noticeCommentMapper.insert(vo);
    }
}
