package com.kh.app.feature.hr.dept;


import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class DeptService {

    private final DeptMapper deptMapper;

    //0. 신규부서 등록하기
    @Transactional
    public int insert(DeptVo vo) {
        return deptMapper.insert(vo);
    }

    //1. 부서 전체 조회하기
    public Map<String, Object> selectList(int currentPage, int pageLimit, int boardLimit) {
        int listCount = deptMapper.selectCount();
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<DeptVo> voList = deptMapper.selectListByPage(pvo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return map;
    }

    public Map<String, Object> selectListByName(String keyword, int currentPage, int pageLimit, int boardLimit) {
        int listCount = deptMapper.selectCountByName(keyword);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<DeptVo> voList = deptMapper.selectListByNameByPage(keyword, pvo);

        Map<String, Object> map = new HashMap<>();
        map.put("keyword", keyword);
        map.put("pvo", pvo);
        map.put("voList", voList);

        return map;
    }

    public Map<String, Object> selectListByUseYn(String useYn, int currentPage, int pageLimit, int boardLimit) {
        int listCount = deptMapper.selectCountByUseYn(useYn);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<DeptVo> voList = deptMapper.selectListByUseYnByPage(useYn, pvo);

        Map<String, Object> map = new HashMap<>();
        map.put("useYn", useYn);
        map.put("pvo", pvo);
        map.put("voList", voList);

        return map;
    }

    //2. 부서 상세 조회하기
    public Map<String, Object> selectDetail(String deptCode) {
        DeptVo vo = deptMapper.selectOne(deptCode);
        List<DeptMemberVo> memberList = deptMapper.selectMemberList(deptCode);

        log.info("deptCode = {}, memberList size = {}", deptCode, memberList.size());

        if (vo != null) {
            vo.setMemberCount(memberList.size());
        }

        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        map.put("memberList", memberList);

        return map;
    }

    //3.1 부서 비활성화 하기
    @Transactional
    public int disable(String deptCode) {
        return deptMapper.disable(deptCode);
    }

    //3.2 부서 활성화 하기
    @Transactional
    public int enable(String deptCode) {
        return deptMapper.enable(deptCode);
    }

    //4.1 부서 근무위치 수정하기
    @Transactional
    public int editAddress(String deptCode, String deptAddress) {
        return deptMapper.editAddress(deptCode, deptAddress);
    }

    //4.2 부서 관리자 수정하기
    @Transactional
    public int editManager(String deptCode, String managerEmpNo) {
        return deptMapper.editManager(deptCode, managerEmpNo);
    }




}