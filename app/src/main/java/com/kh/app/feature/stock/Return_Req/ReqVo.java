package com.kh.app.feature.stock.Return_Req;

import lombok.Data;

@Data
public class ReqVo {
    private String returnNo;      // PK (SEQ_RETURN_REQ.NEXTVAL)
    private String itemNo;        // [중요] 상품 고유 번호 (실제 DB 저장용 FK)
    private String storeCode;     // 매장 코드 (FK)
    private String quantity;      // 수량
    private String reason;        // 사유
    private String status;        // 상태 (W: 대기, F: 완료 등)
    private String createAt;       // 접수일

    // JOIN 결과용 (DB 테이블에는 없지만 화면 표시용)
    private String itemName;      // [수정] 상품명 (이미지의 '우유2L')
    private String storeName;     // 매장 이름 (이미지의 '강남지점')
    private String empNo;
}
