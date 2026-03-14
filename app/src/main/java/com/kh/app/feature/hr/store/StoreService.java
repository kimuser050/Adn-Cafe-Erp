package com.kh.app.feature.hr.store;

import com.kh.app.feature.user.member.MemberVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreMapper storeMapper;

    public int insert(StoreVo vo) {
        return storeMapper.insert(vo);
    }

    public List<StoreVo> selectList() {
        return storeMapper.selectList();
    }

    public StoreVo selectDetail(String storeCode) {
        return storeMapper.selectDetail(storeCode);
    }

    public List<MemberVo> selectManagerList() {
        return storeMapper.selectManagerList();
    }

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

    public int editAddress(String storeCode, String storeAddress) {
        return storeMapper.editAddress(storeCode, storeAddress);
    }

    public int editManager(String storeCode, String ownerEmpNo) {
        return storeMapper.editManager(storeCode,ownerEmpNo);
    }
}