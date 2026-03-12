package com.kh.app.feature.user.notice;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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


    public int selectCount() {
        return noticeMapper.selectCount();
    }

    public List<NoticeVo> selectList(PageVo pvo) {
        return noticeMapper.selectList(pvo);

    }

}
