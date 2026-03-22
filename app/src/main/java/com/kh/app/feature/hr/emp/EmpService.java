package com.kh.app.feature.hr.emp;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class EmpService {

    private final EmpMapper empMapper;

    // 1. 전체조회 (페이징)
    public Map<String, Object> selectList(int currentPage, int pageLimit, int boardLimit) {
        int listCount = empMapper.selectCount();
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<EmpVo> voList = empMapper.selectListByPage(pvo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return map;
    }

    // 2. 직원 상세조회
    public EmpVo selectDetail(String empNo) {
        return empMapper.selectDetail(empNo);
    }

    // 2-1. 해당 직원 인사이력 조회
    public List<EmpHistoryVo> selectEmpHistory(String empNo) {
        return empMapper.selectEmpHistory(empNo);
    }

    // 3. 직원 기본정보 수정
    @Transactional
    public int edit(EmpVo vo) {
        return empMapper.edit(vo);
    }

    // 4. 해당 직원 인사이력 추가
    @Transactional
    public int insertEmpHistory(EmpHistoryVo vo) {
        return empMapper.insertEmpHistory(vo);
    }

    // 5. 인사이력 수정
    @Transactional
    public int editEmpHistory(EmpHistoryVo vo) {
        return empMapper.editEmpHistory(vo);
    }

    // 상태 목록 조회
    public List<CurrentStatusVo> selectStatusList() {
        return empMapper.selectStatusList();
    }

    public Map<String, Object> getEmpSummary() {
        return empMapper.selectEmpSummary();
    }
}