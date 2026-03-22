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
@RequestMapping("/api/hr/home")
public class HrHomeRestController {

    private final HrHomeService hrHomeService;

    @GetMapping("/profile")
    public ResponseEntity<HrHomeProfileVo> selectProfile(HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            throw new IllegalStateException("로그인 정보가 없습니다.");
        }
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

    @GetMapping("/pay-summary")
    public ResponseEntity<HrHomePaySummaryVo> selectPaySummary() {
        return ResponseEntity.ok(hrHomeService.selectPaySummary());
    }

    @GetMapping
    public ResponseEntity<HrHomeResponseVo> selectHrHome(HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            throw new IllegalStateException("로그인 정보가 없습니다.");
        }
        String loginEmpNo = loginMemberVo.getEmpNo();

        HrHomeResponseVo vo = hrHomeService.selectHrHome(loginEmpNo);
        return ResponseEntity.ok(vo);
    }
}
