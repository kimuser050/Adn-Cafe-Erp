package com.kh.app.feature.finance.dailySales;

import com.kh.app.feature.hr.store.StoreVo;
import com.kh.app.feature.stock.Products.ProductVo;
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
    public int insertDaily(List<DailySalesVo> voList) throws Exception {

        String storeNo = voList.get(0).getStoreNo();
        String koreanStoreName = dailySalesMapper.getkoreanStoreName(storeNo);
        String tableName = engStoreName(koreanStoreName) + "_DAILY_SALES";

        int total = 0;
        for(DailySalesVo vo : voList){
            vo.setStoreNo(storeNo);
            total += dailySalesMapper.insertDaily(vo, tableName);
            total += dailySalesMapper.insertTotalSales(vo);
        }

        return total;
    }

    @Transactional
    public int editDaily(DailySalesVo vo) throws Exception {

        String koreanStoreName = dailySalesMapper.getkoreanStoreName(vo.getStoreNo());

        String tableName = engStoreName(koreanStoreName) + "_DAILY_SALES";

        return dailySalesMapper.editDaily(vo, tableName);
    }

    @Transactional
    public int delDaily(DailySalesVo vo) throws Exception {

        String koreanStoreName = dailySalesMapper.getkoreanStoreName(vo.getStoreNo());

        String tableName = engStoreName(koreanStoreName) + "_DAILY_SALES";

        return dailySalesMapper.delDaily(vo, tableName);
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
}
