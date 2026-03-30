package com.kh.app.feature.stock.itemcheck;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class CheckService {
    private final CheckMapper checkMapper;

    // [교정] 매퍼에 맞게 keyword(String)만 받도록 수정
    public int selectCount(String keyword, String deptCode, String empNo) {
        return checkMapper.selectCount(keyword, deptCode, empNo);
    }

    /**
     * [교정] 리스트 조회
     * - 매퍼의 @Param 설정에 맞춰 pvo, keyword, deptCode, empNo를 각각 전달합니다.
     */
    public List<CheckVo> selectList(PageVo pvo, String keyword, String deptCode, String empNo) {
        log.info("[Service] 목록 조회 요청 - 부서: {}, 사번: {}, 키워드: {}", deptCode, empNo, keyword);
        return checkMapper.selectList(pvo, keyword, deptCode, empNo);
    }

    public CheckVo selectOne(String returnNo) {
        return checkMapper.selectOne(returnNo);
    }

    @Transactional // 수정 작업이므로 Transactional(readOnly=false) 적용
    public int updateByNo(CheckVo vo) {
        log.info("[Service] 상태 수정 요청 - 반품번호: {}, 상태: {}", vo.getReturnNo(), vo.getStatus());
        return checkMapper.updateByNo(vo);
    }
}