package com.kh.app.feature.hr.hrHome;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class HrHomeService {

    private final HrHomeMapper hrHomeMapper;

    public HrHomeProfileVo selectProfile(String loginEmpNo) {
        HrHomeProfileVo vo = hrHomeMapper.selectProfile(loginEmpNo);

        if (vo == null) {
            throw new IllegalArgumentException("프로필 정보를 찾을 수 없습니다.");
        }

        return vo;
    }

    // 전날 승인 결재 요약 조회
    public HrHomeApprovalSummaryVo selectApprovalSummary() {

        String baseDate = LocalDate.now().minusDays(1).toString();

        int vacationCnt = hrHomeMapper.selectApprovedVacationCount(baseDate);
        int overtimeCnt = hrHomeMapper.selectApprovedOvertimeCount(baseDate);

        HrHomeApprovalSummaryVo vo = new HrHomeApprovalSummaryVo();
        vo.setBaseDate(baseDate);
        vo.setApprovedVacationCount(vacationCnt);
        vo.setApprovedOvertimeCount(overtimeCnt);

        return vo;
    }

    public HrHomeDayAttSummaryVo selectDayAttSummary() {
        String baseDate = LocalDate.now().minusDays(1).toString();

        HrHomeDayAttSummaryVo vo = hrHomeMapper.selectDayAttSummary(baseDate);

        if (vo == null) {
            vo = new HrHomeDayAttSummaryVo();
            vo.setBaseDate(baseDate);
            vo.setTotalEmpCount(0);
            vo.setPresentCount(0);
            vo.setLateCount(0);
            vo.setAbsentCount(0);
            vo.setVacationCount(0);
            vo.setOvertimeCount(0);
            vo.setNormalCount(0);
            vo.setNormalRate(0);
            return vo;
        }

        vo.setBaseDate(baseDate);

        if (vo.getTotalEmpCount() == 0) {
            vo.setNormalRate(0);
        } else {
            double rate = (double) vo.getNormalCount() * 100 / vo.getTotalEmpCount();
            vo.setNormalRate(Math.round(rate * 10) / 10.0);
        }

        return vo;
    }

    public List<HrHomeIssueVo> selectRecentIssueList() {
        return hrHomeMapper.selectRecentIssueList();
    }

    public HrHomePaySummaryVo selectPaySummary() {
        String payMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        HrHomePaySummaryVo vo = hrHomeMapper.selectPaySummary(payMonth);

        if (vo == null) {
            vo = new HrHomePaySummaryVo();
            vo.setPayMonth(payMonth);
            vo.setTotalNetAmount(0);
            vo.setTargetCount(0);
            vo.setConfirmedCount(0);
            vo.setUnconfirmedCount(0);
            vo.setConfirmRate(0);
            return vo;
        }

        vo.setPayMonth(payMonth);

        if (vo.getTargetCount() == 0) {
            vo.setConfirmRate(0);
        } else {
            int rate = vo.getConfirmedCount() * 100 / vo.getTargetCount();
            vo.setConfirmRate(rate);
        }

        return vo;
    }

    //조합하기
    public HrHomeResponseVo selectHrHome(String loginEmpNo) {

        HrHomeProfileVo profileVo = selectProfile(loginEmpNo);
        HrHomeApprovalSummaryVo approvalSummaryVo = selectApprovalSummary();
        HrHomeDayAttSummaryVo attSummaryVo = selectDayAttSummary();
        HrHomePaySummaryVo paySummaryVo = selectPaySummary();
        List<HrHomeIssueVo> issueVoList = selectRecentIssueList();

        HrHomeResponseVo responseVo = new HrHomeResponseVo();
        responseVo.setProfileVo(profileVo);
        responseVo.setApprovalSummaryVo(approvalSummaryVo);
        responseVo.setAttSummaryVo(attSummaryVo);
        responseVo.setPaySummaryVo(paySummaryVo);
        responseVo.setIssueVoList(issueVoList);

        return responseVo;
    }
}
