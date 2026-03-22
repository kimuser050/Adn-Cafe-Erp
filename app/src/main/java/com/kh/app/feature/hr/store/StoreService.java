package com.kh.app.feature.hr.store;

import com.kh.app.feature.hr.dept.DeptVo;
import com.kh.app.feature.user.member.MemberVo;
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
public class StoreService {

    private final StoreMapper storeMapper;

    @Transactional
    public int insert(StoreVo vo) {
        return storeMapper.insert(vo);
    }

    public Map<String, Object> selectList(int currentPage, int pageLimit, int boardLimit) {
        int listCount = storeMapper.selectCount();
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<StoreVo> voList = storeMapper.selectListByPage(pvo);
        Map<String, Object> summary = storeMapper.selectSummary();

        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);
        map.put("pvo", pvo);
        map.put("summary", summary);

        return map;
    }

    public Map<String, Object> selectListByName(String keyword, int currentPage, int pageLimit, int boardLimit) {
        int listCount = storeMapper.selectCountByName(keyword);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<StoreVo> voList = storeMapper.selectListByNameByPage(keyword, pvo);
        Map<String, Object> summary = storeMapper.selectSummaryByName(keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("keyword", keyword);
        map.put("voList", voList);
        map.put("pvo", pvo);
        map.put("summary", summary);

        return map;
    }

    public Map<String, Object> selectListByStatusName(String statusName, int currentPage, int pageLimit, int boardLimit) {
        int listCount = storeMapper.selectCountByStatusName(statusName);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<StoreVo> voList = storeMapper.selectListByStatusNameByPage(statusName, pvo);
        Map<String, Object> summary = storeMapper.selectSummaryByStatusName(statusName);

        Map<String, Object> map = new HashMap<>();
        map.put("statusName", statusName);
        map.put("voList", voList);
        map.put("pvo", pvo);
        map.put("summary", summary);

        return map;
    }

    public StoreVo selectDetail(String storeCode) {
        return storeMapper.selectDetail(storeCode);
    }

    public List<MemberVo> selectManagerList() {
        return storeMapper.selectManagerList();
    }

    @Transactional
    public int updateStatus(String storeCode, int statusCode) {
        if (statusCode != 1 && statusCode != 2 && statusCode != 3) {
            throw new IllegalArgumentException("잘못된 상태코드입니다.");
        }

        StoreVo vo = storeMapper.selectDetail(storeCode);
        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 매장입니다.");
        }

        return storeMapper.updateStatus(storeCode, statusCode);
    }

    @Transactional
    public int editAddress(String storeCode, String storeAddress) {
        return storeMapper.editAddress(storeCode, storeAddress);
    }

    @Transactional
    public int editManager(String storeCode, String ownerEmpNo) {
        return storeMapper.editManager(storeCode, ownerEmpNo);
    }
}