package com.kh.app.feature.hr.hrHome;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

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
}
