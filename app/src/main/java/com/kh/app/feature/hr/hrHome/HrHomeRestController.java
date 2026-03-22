package com.kh.app.feature.hr.hrHome;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/hr/Home")
public class HrHomeRestController {

    private final HrHomeService hrHomeService;

    @GetMapping("/profile")
    public ResponseEntity<HrHomeProfileVo> selectProfile(HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        String loginEmpNo = loginMemberVo.getEmpNo();

        HrHomeProfileVo vo = hrHomeService.selectProfile(loginEmpNo);
        return ResponseEntity.ok(vo);
    }

    // 프로필 아래 결재 요약
    @GetMapping("/approval-summary")
    public ResponseEntity<HrHomeApprovalSummaryVo> selectApprovalSummary() {
        return ResponseEntity.ok(hrHomeService.selectApprovalSummary());
    }

    @GetMapping("/att-summary")
    public ResponseEntity<HrHomeDayAttSummaryVo> selectDayAttSummary() {
        HrHomeDayAttSummaryVo vo = hrHomeService.selectDayAttSummary();
        return ResponseEntity.ok(vo);
    }

    @GetMapping("/issue-list")
    public ResponseEntity<List<HrHomeIssueVo>> selectRecentIssueList() {
        return ResponseEntity.ok(hrHomeService.selectRecentIssueList());
    }
}
