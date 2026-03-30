package com.kh.app.feature.stock.inbound;

import lombok.Data;

@Data
public class InboundVo {
    private String deletedYn;
    private String inDate;
    private String quantity;
    private String unitPrice;
    private String itemNo;
    private String inNo;
    private String totalPrice;
    private String updatedAt;
    private String reason;
    //JOIN
    private String itemName;
    private String location;
}
