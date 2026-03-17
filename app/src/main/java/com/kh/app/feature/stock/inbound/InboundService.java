package com.kh.app.feature.stock.inbound;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InboundService {
    private final InboundMapper inboundMapper;

    public int selectCount() {
        return inboundMapper.selectCount();
    }

    public List<InboundVo> selectList(PageVo pvo) {
        return inboundMapper.selectList(pvo);
       }
}
