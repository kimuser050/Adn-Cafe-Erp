package com.kh.app.feature.stock.itemcheck;

import lombok.Data;

@Data
public class CheckVo {
    private String returnNo;      // 반품 번호
    private String itemReturnNo;  // 검수 번호
    private String status;        // 상태 (반품대기, 승인 등)
    private String processResult; // 검수 결과 (양호, 불량 등)

    // JOIN을 통해 가져오는 중요 정보
    private String itemName;      // 상품명 (SQL의 itemName과 매칭)
    private String storeCode;     // 매장 코드 (R.STORE_CODE)
    private String storeName;     // 매장 이름 (S.STORE_NAME)
    private String createdAt;     // 신청 일자 (R.CREATED_AT)
    private String empNo;

    // 상세 조회 시 필요한 정보
    private int quantity;         // 수량
    private String reason;        // 사유
}