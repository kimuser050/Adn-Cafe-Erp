package com.kh.app.feature.stock.oderReq;

import lombok.Data;

@Data
public class OderReqVo {
    private String orderNo;
    private String itemNo;                  // FK
    private String storeCode;
    private String quantity;
    private String requestDate;
    private String status;                  // W(대기), C(취소), F(완료)

    // JOIN 품목
    private String itemName;
    private String unitPrice;
}
