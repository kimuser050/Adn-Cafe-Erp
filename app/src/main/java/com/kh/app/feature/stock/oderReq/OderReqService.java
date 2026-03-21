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

    /**
     * 1. [발주 신청 탭] 품목 개수 조회 (검색 포함)
     */
    public int selectCount(String keyword) {
        return oderReqMapper.selectCount(keyword);
    }

    /**
     * 2. [발주 신청 탭] 품목 목록 조회 (페이징 + 검색 + 매장정보)
     */
    public List<OderReqVo> selectList(PageVo pvo, String keyword, String empNo) {
        // 매퍼에 empNo를 추가로 전달해서 쿼리가 STORE_NAME을 찾을 수 있게 합니다.
        return oderReqMapper.selectList(pvo, keyword, empNo);
    }

    /**
     * 3. [공통] 단건 상세 조회 (모달 상세용)
     */
    public OderReqVo selectOne(String orderNo) {
        return oderReqMapper.selectOne(orderNo);
    }

    /**
     * 4. [발주 상태 탭] 상태 수정 & 완료('F') 시 재고 차감
     */
    public int updateStatus(OderReqVo vo) {
        // DB 상태값 업데이트 ('W' -> 'F', 'C' 등)
        int result = oderReqMapper.updateByNo(vo);

        // 상태가 'F'(Finish/완료)로 변경될 때만 재고를 차감(-)합니다.
        if ("F".equals(vo.getStatus())) {
            int stockResult = oderReqMapper.decreaseStock(vo.getOrderNo());
            if (stockResult < 1) {
                // 재고가 부족하거나 업데이트 실패 시 롤백 처리
                throw new RuntimeException("재고 반영에 실패했습니다. (재고 부족 등)");
            }
        }
        return result;
    }

    /**
     * 5. [발주 신청 탭] 다중 품목 일괄 주문 등록
     * 이 메서드가 실행되면 매퍼에 의해 상태값이 'W'로 자동 저장됩니다.
     */
    public int orderReqBulk(List<OderReqVo> voList) {
        if (voList == null || voList.isEmpty()) return 0;

        int totalResult = 0;
        for (OderReqVo vo : voList) {
            // 하나씩 DB에 INSERT (상태는 매퍼 SQL에 의해 'W'로 고정됨)
            totalResult += oderReqMapper.insertOrder(vo);
        }

        log.info("발주 요청 완료: 총 {}건 성공", totalResult);
        return totalResult;
    }

    /**
     * 6. [발주 상태 탭] 이력 개수 조회
     */
    public int selectHistoryCount(String keyword) {
        return oderReqMapper.selectHistoryCount(keyword);
    }

    /**
     * 7. [발주 상태 탭] 이력 목록 조회 (페이징 + 검색)
     */
    public List<OderReqVo> selectHistory(PageVo pagingInfo, String keyword) {
        return oderReqMapper.selectHistory(pagingInfo, keyword);
    }
}