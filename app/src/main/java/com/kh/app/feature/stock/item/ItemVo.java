package com.kh.app.feature.stock.item;

import lombok.Data;

@Data
public class ItemVo {
    private String activeYn;
    private int stock;
    private String unitPrice;
    private String stockNo;
    private String orderDate;
    private String createdAt;
    private String updatedAt;
    private String stockName;
    private String location;
}
