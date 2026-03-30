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

    // [중요] 로그인한 사용자의 사번을 담기 위한 필드 추가
    // Mapper의 #{empNo}가 이 값을 사용해 진짜 매장코드(200115)를 찾습니다.
    private String empNo;

    // JOIN 품목
    private String itemName;
    private String unitPrice;

    // 1. 합계 금액 (단가 * 수량)
    private String totalPrice;

    // 2. 매장/부서 이름
    private String storeName;

    // 3. 품목 위치/카테고리
    private String location;

    // 4. 작성자 이름
    private String empName;
}