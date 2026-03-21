package com.kh.app.feature.stock.item;

import com.kh.app.feature.stock.inbound.InboundMapper;
import com.kh.app.feature.stock.inbound.InboundVo;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional // 클래스 레벨에서 기본적으로 트랜잭션 적용 (등록/수정 실패 시 롤백)
public class ItemService {

    private final ItemMapper itemMapper;
    private final InboundMapper inboundMapper; // 입고 이력을 남기기 위해 주입

    /**
     * 신규 등록 시 초기 이력 생성
     */
    public int insert(ItemVo vo) {
        // 1. 품목 등록 (Mapper의 @SelectKey 덕분에 실행 후 vo.itemNo에 번호가 채워짐)
        int result = itemMapper.insert(vo);

        if (result > 0) {
            // 2. 신규 등록 시 입력한 초기 재고를 입고 이력으로 기록
            InboundVo logVo = new InboundVo();
            logVo.setItemNo(vo.getItemNo());      // @SelectKey로 받아온 신규 번호
            logVo.setQuantity(vo.getStock());     // ItemVo의 필드명인 stock 사용
            logVo.setUnitPrice(vo.getUnitPrice());
            logVo.setReason("신규 품목 등록 (초기 재고)");

            inboundMapper.insertInboundLog(logVo);
            log.info("신규 품목 등록 및 초기 이력 생성 완료: {}", vo.getItemName());
        }
        return result;
    }

    /**
     * 품목 정보 수정 (UPDATE) 및 변동 이력 기록
     */
    @Transactional
    public int updateByNo(ItemVo vo) {
        log.info("Service Update 실행: {}", vo);

        // 1. 수정 전의 기존 품목 정보 조회 (기존 재고 확인용)
        ItemVo oldItem = itemMapper.selectOne(vo.getItemNo());

        // 2. 변동 수량 계산 (새 수량 - 기존 수량)
        int newStock = Integer.parseInt(vo.getStock());
        int oldStock = Integer.parseInt(oldItem.getStock());
        int gap = newStock - oldStock;

        // 3. 품목 정보 업데이트 실행 (이름, 단가, 200개로 변경 등)
        int result = itemMapper.updateByNo(vo);

        // 4. 업데이트 성공 시, 변동이 있을 때만 이력 생성
        if (result > 0 && gap != 0) {
            InboundVo logVo = new InboundVo();
            logVo.setItemNo(vo.getItemNo());
            logVo.setQuantity(String.valueOf(gap)); // 200이 아닌 170(변동분)을 저장
            logVo.setUnitPrice(vo.getUnitPrice());

            // 수량이 늘었으면 '입고', 줄었으면 '재고 조정' 등으로 사유 구분 가능
            String reason = (gap > 0) ? "품목 수정 (추가 입고: " + gap + ")" : "품목 수정 (재고 차감: " + gap + ")";
            logVo.setReason(reason);

            inboundMapper.insertInboundLog(logVo);
            log.info("변동분({})만큼 이력 생성 완료", gap);
        }

        return result;
    }

    /**
     * 품목 삭제 (논리 삭제)
     */
    public int deleteByNo(ItemVo vo) {
        return itemMapper.deleteByNo(vo);
    }

    @Transactional(readOnly = true)
    public int selectCount(String keyword) {
        return itemMapper.selectCount(keyword);
    }

    @Transactional(readOnly = true)
    public List<ItemVo> selectList(PageVo pvo, String keyword) {
        return itemMapper.selectList(pvo, keyword);
    }

    @Transactional(readOnly = true)
    public ItemVo selectOne(String no) {
        return itemMapper.selectOne(no);
    }
}