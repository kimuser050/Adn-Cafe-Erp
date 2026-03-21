package com.kh.app.feature.stock.oderReq;

import lombok.Data;

@Data
public class OderReqVo {
    private String orderNo;
    private String itemNo;                  // FK
    private String storeCode;               // FK
    private String quantity;
    private String requestDate;
    private String status;                  // W(대기), C(취소), F(완료)
    // JOIN 품목
    private String itemName;
    private String unitPrice;
    // 1. 합계 금액 (단가 * 수량)
    private String totalPrice;
    // 2. 매장/부서 이름
    // 현재는 storeCode(숫자/코드)만 있는데, 발주 상태 창에서 '강남지점'처럼
    private String storeName;
    // 3. 품목 위치/카테고리
    private String location;
    // 4. 작성자 이름
    private String empName;
}