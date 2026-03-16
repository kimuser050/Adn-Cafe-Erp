package com.kh.app.feature.stock.itemcheck;

import lombok.Data;

@Data
public class CheckVo {
    private Long itemReturnNo;
    private Long returnNo;
    private String status;
    private String processResult;
    // join 추가
    private String productName;
    private Long storeCode;
    private String storeName;
    private String createdAt;
}