package com.kh.app.feature.finance.dailySales;

import com.kh.app.feature.finance.journal.JournalService;
import com.kh.app.feature.hr.store.StoreVo;
import com.kh.app.feature.stock.Products.ProductVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class DailySalesService {

    private final JournalService journalService;
    private final DailySalesMapper dailySalesMapper;

    public String engStoreName(String koreanStoreName) throws Exception {
        return switch (koreanStoreName) {
            case "부산점" -> "BUSAN";
            case "대구점" -> "DAEGU";
            case "인천점" -> "INCHEON";
            case "광주점" -> "GWANGJU";
            case "대전점" -> "DAEJEON";
            case "울산점" -> "ULSAN";
            case "강남점" -> "GANGNAM";
            case "역삼점" -> "YEOKSAM";
            case "춘천점" -> "CHUNCHEON";
            case "수원점" -> "SUWON";
            default -> throw new Exception("등록되지 않은 지점명입니다.");
        };
    }


    @Transactional
    public int insertDaily(List<DailySalesVo> voList, HttpSession session) throws Exception {

        String storeNo = voList.get(0).getStoreNo();
        String koreanStoreName = dailySalesMapper.getkoreanStoreName(storeNo);
        String tableName = engStoreName(koreanStoreName) + "_DAILY_SALES";

        int total = 0;
        for(DailySalesVo vo : voList){
            vo.setStoreNo(storeNo);

            if(vo.getUnitPrice() != null && vo.getQuantity() != null) {
                int calcTotal = Integer.parseInt(vo.getUnitPrice()) * Integer.parseInt(vo.getQuantity());
                vo.setTotalSales(String.valueOf(calcTotal));
            }

            total += dailySalesMapper.insertDaily(vo, tableName);
            total += dailySalesMapper.insertTotalSalesReal(vo);
            journalService.autoSalesInsert(vo, session);
        }

        return total;
    }

    @Transactional
    public int editDaily(DailySalesVo vo, HttpSession session) throws Exception {

        String koreanStoreName = dailySalesMapper.getkoreanStoreName(vo.getStoreNo());

        String tableName = engStoreName(koreanStoreName) + "_DAILY_SALES";

        // 원본 가져오기 (전표 역분개용)
        DailySalesVo originalVo = dailySalesMapper.getDailySales(vo, tableName);

        // 역분개 전표에 넣을 기존 총금액 계산
        if(originalVo.getUnitPrice() != null && originalVo.getQuantity() != null) {
            int originalTotal = Integer.parseInt(originalVo.getUnitPrice()) * Integer.parseInt(originalVo.getQuantity());
            originalVo.setTotalSales(String.valueOf(originalTotal));
        }

        // 신규 전표에 넣을 수정된 총금액 계산
        if(vo.getUnitPrice() != null && vo.getQuantity() != null) {
            int calcTotal = Integer.parseInt(vo.getUnitPrice()) * Integer.parseInt(vo.getQuantity());
            vo.setTotalSales(String.valueOf(calcTotal));
        }

        // 지점 테이블 수정하고 결과값을 변수에 저장
        int result = dailySalesMapper.editDaily(vo, tableName);

        // 토탈 테이블 수정
        dailySalesMapper.editTotalSalesReal(vo);

        // 전표 역분개 & 재등록
        journalService.autoSalesEdit(originalVo, vo, session);

        return result;
    }

    @Transactional
    public int delDaily(DailySalesVo vo, HttpSession session) throws Exception {

        String koreanStoreName = dailySalesMapper.getkoreanStoreName(vo.getStoreNo());

        String tableName = engStoreName(koreanStoreName) + "_DAILY_SALES";

        // 역분개 전표를 만들기 위해 원본 데이터 가져오기
        DailySalesVo originalVo = dailySalesMapper.getDailySales(vo, tableName);

        if (originalVo == null) {
            throw new Exception("삭제할 매출 데이터를 찾을 수 없습니다.");
        }

        // 역분개 전표에 넣을 총금액(TotalSales) 계산
        if(originalVo.getUnitPrice() != null && originalVo.getQuantity() != null) {
            int originalTotal = Integer.parseInt(originalVo.getUnitPrice()) * Integer.parseInt(originalVo.getQuantity());
            originalVo.setTotalSales(String.valueOf(originalTotal));
        }

        // 전표 역분개 처리
        journalService.autoSalesDel(originalVo, session);

        // 지점 테이블 매출 내역 삭제 (결과값 저장)
        int result = dailySalesMapper.delDaily(vo, tableName);

        // TOTAL_SALES 통합 테이블 매출 내역 삭제
        dailySalesMapper.delTotalSalesReal(originalVo);

        return result;
    }

    public List<DailySalesVo> listDaily(DailySalesVo vo) throws Exception {
        String koreanStoreName = dailySalesMapper.getkoreanStoreName(vo.getStoreNo());

        String tableName = engStoreName(koreanStoreName) + "_DAILY_SALES";

        return dailySalesMapper.listDaily(vo, tableName);
    }


    public List<DailySalesVo> storeIncome(String salesDate) {
        return dailySalesMapper.storeIncome(salesDate);
    }


    public List<DailySalesVo> productIncome(String salesDate) {
        return dailySalesMapper.productIncome(salesDate);
    }

    public List<ProductVo> getProductList() {
        return dailySalesMapper.getProductList();
    }


    public List<DailySalesVo> getStoreList() {
        return dailySalesMapper.getStoreList();
    }

    public DailySalesVo getMyStore(String empNo) {
        return dailySalesMapper.getMyStore(empNo);
    }
}
