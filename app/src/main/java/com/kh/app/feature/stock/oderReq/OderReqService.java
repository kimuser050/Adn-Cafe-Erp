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
        int result = oderReqMapper.updateByNo(vo);

        if ("F".equals(vo.getStatus())) {
            int stockResult = oderReqMapper.decreaseStock(vo.getOrderNo());
            if (stockResult < 1) {
                throw new RuntimeException("재고 반영에 실패했습니다. (재고 부족 등)");
            }
        }
        return result;
    }

    /**
     * 5. [발주 신청 탭] 다중 품목 일괄 주문 등록
     * [수정 포인트] 파라미터에 loginEmpNo를 추가하여 Mapper가 진짜 매장코드를 찾게 합니다.
     */
    public int orderReqBulk(List<OderReqVo> voList, String loginEmpNo) {
        if (voList == null || voList.isEmpty()) return 0;

        int totalResult = 0;
        for (OderReqVo vo : voList) {
            // [중요] 로그인한 사용자의 사번을 Vo에 세팅합니다.
            // Mapper에서 이 empNo를 사용해 STORE 테이블의 진짜 STORE_CODE를 조회합니다.
            vo.setEmpNo(loginEmpNo);

            totalResult += oderReqMapper.insertOrder(vo);
        }

        log.info("발주 요청 완료: 사용자 {}가 총 {}건 신청 성공", loginEmpNo, totalResult);
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