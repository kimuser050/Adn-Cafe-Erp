package com.kh.app.feature.stock.Return_Req;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ReqService {

    private final ReqMapper reqMapper;

    /**
     * 반품 목록 조회
     */
    public List<ReqVo> list(ReqVo vo) {
        return reqMapper.list(vo);
    }

    /**
     * 반품 신청 (단건 저장)
     * 데이터 변경이 일어나므로 @Transactional을 별도로 걸어줍니다.
     */
    @Transactional
    public int reqinsert(ReqVo vo) {
        log.info("반품 신청 서비스 호출: {}", vo);
        return reqMapper.reqinsert(vo);
    }

    /**
     * 반품 신청 시 화면에 뿌려줄 상품 리스트 조회용
     */
    public List<ReqVo> getItemList() {
        return reqMapper.getItemList();
    }

    /**
     * [추가] 사번으로 매장 '이름' 조회 (화면 표시용: 예 - '대전점')
     */
    public String getStoreNameByEmpNo(String empNo) {
        return reqMapper.getStoreNameByEmpNo(empNo);
    }

    /**
     * [추가] 사번으로 매장 '코드' 조회 (DB 저장용: 예 - '10')
     * ORA-01722 에러 방지를 위해 실제 숫자 코드를 가져옵니다.
     */
    public String getStoreCodeByEmpNo(String empNo) {
        return reqMapper.getStoreCodeByEmpNo(empNo);
    }
}