package com.kh.app.feature.hr.store;

import lombok.Data;

@Data
public class StoreVo {
    private String storeCode;
    private String statusCode;
    private String statusName;
    private String ownerEmpNo;
    private String managerName;
    private String storeName;
    private String storeAddress;
    private String createdAt;
    private String updatedAt;
}