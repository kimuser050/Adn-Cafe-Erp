package com.kh.app.feature.stock.request;

import lombok.Data;

@Data
public class ReqVo {
    private String returnNo;
    private String productName;
    private String quantity;
    private String reason;
    private String status;
    private String createdAt;
    private String storeCode;
}

