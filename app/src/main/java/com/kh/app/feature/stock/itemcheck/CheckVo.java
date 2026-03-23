package com.kh.app.feature.stock.itemcheck;

import lombok.Data;

@Data
public class CheckVo {
    private String returnNo;
    private String itemReturnNo;
    private String status;
    private String processResult;
    private String itemName;
    private String storeCode;
    private String storeName;
    private String empName;     // [추가] EMP_NO로 조인해서 가져올 사원명
    private String regDate;     // DB의 CREATED_AT (Mapper에서 별칭 사용)
    private int quantity;
    private String reason;
}