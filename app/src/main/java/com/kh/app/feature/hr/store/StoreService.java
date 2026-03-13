package com.kh.app.feature.hr.store;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class StoreService {

    private final StoreMapper storeMapper;

    //0. 신규부서 등록하기
    @Transactional
    public int insert(StoreVo vo) {
        return storeMapper.insert(vo);
    }

    public List<StoreVo> selectList() {
        return storeMapper.selectList();
    }


}
