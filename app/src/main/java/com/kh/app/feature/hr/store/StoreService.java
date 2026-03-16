package com.kh.app.feature.hr.store;

import com.kh.app.feature.hr.dept.DeptVo;
import com.kh.app.feature.user.member.MemberVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    public List<StoreVo> selectList() {
        return storeMapper.selectList();
    }

    public List<StoreVo> selectListByName(String keyword) {
        return storeMapper.selectListByName(keyword);
    }

    public List<StoreVo> selectListByStatusName(String statusName) {
        return storeMapper.selectListByStatusName(statusName);
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