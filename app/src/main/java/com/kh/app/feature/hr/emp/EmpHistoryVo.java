package com.kh.app.feature.hr.emp;

import lombok.Data;

@Data
public class EmpHistoryVo {
    private String hisNo;
    private String empNo;
    private String hisDate;
    private String hisEvent;
    private String hisContent;
    private String createdAt;
    private String updatedAt;
}
