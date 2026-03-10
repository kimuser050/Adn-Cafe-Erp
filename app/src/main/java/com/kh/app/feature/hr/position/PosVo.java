package com.kh.app.feature.hr.position;

import lombok.Data;

@Data
public class PosVo {

    private String pos_code;
    private String pos_name;
    private String pos_desc;
    private String base_salary;
    private String bonus_rate;
    private String use_yn;
    private String created_at;
    private String updated_at;
}
