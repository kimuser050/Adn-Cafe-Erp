package com.kh.app.feature.hr.hrHome;

import lombok.Data;

import java.util.List;

@Data
public class HrHomeResponseVo {
    private HrHomeProfileVo profileVo;
    private HrHomeApprovalSummaryVo approvalSummaryVo;
    private HrHomeDayAttSummaryVo attSummaryVo;
    private HrHomePaySummaryVo paySummaryVo;
    private List<HrHomeIssueVo> issueVoList;
}

