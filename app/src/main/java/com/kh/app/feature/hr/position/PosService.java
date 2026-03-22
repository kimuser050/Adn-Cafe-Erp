package com.kh.app.feature.hr.position;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public Map<String, Object> selectList(int currentPage, int pageLimit, int boardLimit) {
        int listCount = posMapper.selectCount();
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<PosVo> voList = posMapper.selectListByPage(pvo);
        Map<String, Object> summary = posMapper.selectSummary();

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);
        map.put("pvo", pvo);
        map.put("summary", summary);

        return map;
    }

    public Map<String, Object> selectListByName(String keyword, int currentPage, int pageLimit, int boardLimit) {
        int listCount = posMapper.selectCountByName(keyword);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<PosVo> voList = posMapper.selectListByNameByPage(keyword, pvo);
        Map<String, Object> summary = posMapper.selectSummaryByName(keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("keyword", keyword);
        map.put("voList", voList);
        map.put("pvo", pvo);
        map.put("summary", summary);

        return map;
    }

    public Map<String, Object> selectListByUseYn(String useYn, int currentPage, int pageLimit, int boardLimit) {
        int listCount = posMapper.selectCountByUseYn(useYn);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<PosVo> voList = posMapper.selectListByUseYnByPage(useYn, pvo);
        Map<String, Object> summary = posMapper.selectSummaryByUseYn(useYn);

        Map<String, Object> map = new HashMap<>();
        map.put("useYn", useYn);
        map.put("voList", voList);
        map.put("pvo", pvo);
        map.put("summary", summary);

        return map;
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