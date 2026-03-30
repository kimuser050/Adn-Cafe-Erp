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


    /**
     * 입고 처리: 품목 재고를 먼저 수정하고, 그 변동 사항을 이력으로 남깁니다.
     */
    public void processInbound(InboundVo vo) {
        // 1. 품목(ITEM) 테이블의 재고 수량을 먼저 변경합니다.
        int result = inboundMapper.updateItemStock(vo.getItemNo(), vo.getQuantity());

        if (result > 0) {
            // 2. 재고 변경이 성공했다면, 그 시점의 데이터를 입고(INBOUND) 이력에 남깁니다.
            // 이때 vo에는 이미 화면에서 넘어온 수량, 단가 등이 들어있습니다.
            inboundMapper.insertInboundLog(vo);
        } else {
            throw new RuntimeException("해당 품목을 찾을 수 없어 재고 수정에 실패했습니다.");
        }
    }


    @Transactional(readOnly = true)
    public List<InboundVo> selectList(PageVo pvo, String keyword) {
        return inboundMapper.selectList(pvo, keyword);
    }

    @Transactional(readOnly = true)
    public int selectCount(String keyword) {
        return inboundMapper.selectCount(keyword);
    }
}