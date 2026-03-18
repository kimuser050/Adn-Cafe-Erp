package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OderReqService {

    private final OderReqMapper oderReqMapper;

    // 1. 목록 개수 조회 (검색 포함)
    public int selectCount(String keyword) {
        return oderReqMapper.selectCount(keyword);
    }

    // 2. 목록 조회 (페이징 + 검색)
    public List<OderReqVo> selectList(PageVo pvo, String keyword) {
        return oderReqMapper.selectList(pvo, keyword);
    }

    // 3. 단건 상세 조회 (모달용)
    public OderReqVo selectOne(String orderNo) {
        return oderReqMapper.selectOne(orderNo);
    }

    // 4. 상태 수정 & 입고 완료('F') 시 재고 증가
    public int updateStatus(OderReqVo vo) {
        // 상태값 업데이트 실행
        int result = oderReqMapper.updateByNo(vo);

        // 상태가 'F'(Finish/입고완료)라면 재고 증가 쿼리 실행
        if ("F".equals(vo.getStatus())) {
            int stockResult = oderReqMapper.decreaseStock(vo.getOrderNo());
            if (stockResult < 1) {
                throw new RuntimeException("재고 반영에 실패했습니다.");
            }
        }
        return result;
    }

    // 5. 다중 품목 일괄 주문 등록
    public int orderReqBulk(List<OderReqVo> voList) {
        if (voList == null || voList.isEmpty()) return 0;

        int totalResult = 0;
        for (OderReqVo vo : voList) {
            // Mapper에 주문 등록 메서드가 있다면 여기서 호출 (예: insertOrder)
            // totalResult += oderReqMapper.insertOrder(vo);
        }
        return totalResult;
    }

    public int selectHistoryCount(String keyword) {
        return oderReqMapper.selectHistoryCount(keyword);
    }

    public List<OderReqVo> selectHistory(PageVo pvo, String keyword) {
        return oderReqMapper.selectHistory(pvo, keyword);
    }
}