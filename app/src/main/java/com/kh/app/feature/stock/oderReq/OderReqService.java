package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class OderReqService {
    private final OderReqMapper oderReqMapper;

    public int selectCount() {
        return oderReqMapper.selectCount();
    }

    public List<OderReqVo> selectList(PageVo pvo) {
        return oderReqMapper.selectList(pvo);
    }


    public int updateByNo(List<OderReqVo> voList) {
        int totalResult = 0;
        for (OderReqVo vo : voList) {
            // 1. 발주 기록 INSERT
            int insertResult = oderReqMapper.insertOrder(vo);

            // 2. 재고 차감 UPDATE
            int updateResult = oderReqMapper.decreaseStock(vo);

            // 둘 다 성공했을 때만 결과 카운트 증가
            if (insertResult > 0 && updateResult > 0) {
                totalResult++;
            } else {
                // 하나라도 실패하면 예외를 던져 전체 롤백
                throw new RuntimeException("상품 번호 " + vo.getItemNo() + " 처리 중 오류 발생");
            }
        }
        return totalResult;


    }
}

