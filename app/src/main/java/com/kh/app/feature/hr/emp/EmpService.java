package com.kh.app.feature.hr.emp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class EmpService {

    private final EmpMapper empMapper;

    public List<EmpVo> selectList() {
        return empMapper.selectList();
    }

    public EmpVo selectDetail(String empNo) {
        return empMapper.selectDetail(empNo);
    }

    public List<EmpHistoryVo> selectEmpHistory(String empNo) {
        return empMapper.selectEmpHistory(empNo);
    }

    @Transactional
    public int edit(EmpVo vo) {
        return empMapper.edit(vo);
    }

    @Transactional
    public int insertEmpHistory(EmpHistoryVo vo) {
        return empMapper.insertEmpHistory(vo);
    }

    @Transactional
    public int editEmpHistory(EmpHistoryVo vo) {
        return empMapper.editEmpHistory(vo);
    }

    public List<CurrentStatusVo> selectStatusList() {
        return empMapper.selectStatusList();
    }
}