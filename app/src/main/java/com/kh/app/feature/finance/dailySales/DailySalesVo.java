package com.kh.app.feature.finance.dailySales;

import lombok.Data;
import org.apache.ibatis.annotations.Select;

@Data
public class DailySalesVo {

    private String salesNo;
    private String storeNo;
    private String productNo;
    private String unitPrice;
    private String quantity;
    private String paymentCd;
    private String salesDate;
    private String totalSales;

}
