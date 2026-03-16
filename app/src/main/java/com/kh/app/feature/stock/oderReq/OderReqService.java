package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.stock.item.ItemVo;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class OderReqService {
    private final OderReqMapper oderReqMapper;

    public int selectCount() {
        return oderReqMapper.selectCount();
    }

    public List<OderReqVo> selectList(PageVo pvo) {
        return oderReqMapper.selectList(pvo);
    }

    public OderReqVo selectOne(String orderNo) {
        return oderReqMapper.selectOne(orderNo);
    }

    //재고차감
    @Transactional
    public int updateStatus(OderReqVo vo) {

        int result = oderReqMapper.updateByNo(vo);

        if("F".equals(vo.getStatus())){
            oderReqMapper.decreaseStock(vo.getOrderNo());
        }
        return result;
    }


    public int orderReq(Map<String, Object> map) {
        return oderReqMapper.orderReq(map);
    }
}

