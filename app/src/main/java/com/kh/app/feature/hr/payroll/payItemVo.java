package com.kh.app.feature.hr.payroll;

import lombok.Data;

@Data
public class payItemVo {

    private String item_code;
    private String item_name;
    private String item_type;
    private String is_taxable;
    private String use_yn;
    private String created_at;
    private String updated_at;
}
