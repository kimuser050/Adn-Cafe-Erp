package com.kh.app.feature.stock.Return_Req;

import lombok.Data;

@Data
public class ReqVo {
    private String status;
    private String return_no;
    private String quantity;
    private String store_code;
    private String created_at;
    private String product_name;
    private String reason;
}
