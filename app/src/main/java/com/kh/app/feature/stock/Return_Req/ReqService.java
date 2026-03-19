package com.kh.app.feature.stock.Return_Req;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class ReqService {

    private final ReqMapper reqMapper;

    public List<ReqVo> list(ReqVo vo) {
        return reqMapper.list(vo);
    }

    public int reqinsert(ReqVo vo) {
        return reqMapper.reqinsert(vo);
    }
}