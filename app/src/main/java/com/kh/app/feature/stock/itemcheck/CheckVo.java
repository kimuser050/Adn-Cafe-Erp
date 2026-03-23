package com.kh.app.feature.stock.itemcheck;

import lombok.Data;

@Data
public class CheckVo {
    private String returnNo;
    private String itemReturnNo;
    private String status;
    private String processResult;

    // 이 부분들이 중요합니다!
    private String itemName;    // DB의 ITEM_NAME과 매칭
    private String storeCode;
    private String storeName;
    private String createdAt;   // DB의 CREATED_AT과 매칭 (createAt 아님!)
    private int quantity;
    private String reason;
}