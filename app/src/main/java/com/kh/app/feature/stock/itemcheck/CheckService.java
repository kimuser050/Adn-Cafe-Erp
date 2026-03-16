package com.kh.app.feature.stock.itemcheck;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service

public class CheckService {
    private final CheckMapper checkMapper;

    @Transactional
    public int selectCount() {
        return checkMapper.selectCount();
    }

    public List<CheckVo> selectList(PageVo pvo) {
        return checkMapper.selectList(pvo);
    }

    public CheckVo selectOne(String returnNo) {
        return checkMapper.selectOne(returnNo);
    }

    public int updateByNo(CheckVo vo) {
        return checkMapper.updateByNo(vo);
    }
}
