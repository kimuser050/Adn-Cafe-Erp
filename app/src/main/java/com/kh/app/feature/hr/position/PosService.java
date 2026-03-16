package com.kh.app.feature.hr.position;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PosService {

    private final PosMapper posMapper;

    @Transactional
    public int insert(PosVo vo) {
        return posMapper.insert(vo);
    }

    public List<PosVo> selectList() {
        return posMapper.selectList();
    }

    public List<PosVo> selectListByName(String keyword) {
        return posMapper.selectListByName(keyword);
    }

    public List<PosVo> selectListByUseYn(String useYn) {
        return posMapper.selectListByUseYn(useYn);
    }

    public PosVo selectDetail(String posCode) {
        return posMapper.selectDetail(posCode);
    }

    public List<PosMemberVo> selectMemberList(String posCode) {
        return posMapper.selectMemberList(posCode);
    }

    @Transactional
    public int disable(String posCode) {
        return posMapper.disable(posCode);
    }

    @Transactional
    public int enable(String posCode) {
        return posMapper.enable(posCode);
    }

    @Transactional
    public int editBaseSalary(String posCode, String baseSalary) {
        return posMapper.editBaseSalary(posCode, baseSalary);
    }

    @Transactional
    public int editBonusRate(String posCode, String bonusRate) {
        return posMapper.editBonusRate(posCode, bonusRate);
    }
}