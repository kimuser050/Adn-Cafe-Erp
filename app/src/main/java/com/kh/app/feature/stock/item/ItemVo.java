package com.kh.app.feature.stock.item;

import lombok.Data;

@Data
public class ItemVo {
    private String activeYn;
    private String stock;
    private String unitPrice;
    private String itemNo;
    private String orderDate;
    private String createdAt;
    private String updatedAt;
    private String itemName;
    private String location;
}
