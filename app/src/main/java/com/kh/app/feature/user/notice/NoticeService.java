package com.kh.app.feature.user.notice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeMappper noticeMapper;


    @Transactional
    public int insert(NoticeVo vo) {
        return noticeMapper.insert(vo);
    }


}
