package com.kh.app.feature.stock.Return_Req;

import lombok.Data;

@Data
public class ReqVo {
    private String returnNo;      // PK (시퀀스 자동생성)
    private String productName;   // 상품명 (이미지의 '원두 커피')
    private String quantity;      // 수량
    private String reason;        // 사유
    private String status;        // 상태 (기본값 'W')
    private String createdAt;     // 접수일 (SYSDATE)
    private String storeCode;     // 매장 코드 (FK)

    // JOIN 결과용
    private String storeName;     // 매장 이름 (강남 지점 등)
}
