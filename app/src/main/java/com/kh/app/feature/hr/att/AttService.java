package com.kh.app.feature.hr.att;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AttService {

    private final AttMapper attMapper;

//    // 1. 월별 전체조회 (기본적으로 오늘날짜에서 달을 빼오기)
//    public Map<String, Object> selectList(String month) {
//        Map<String, Object> map = new HashMap<>();
//
//        map.put("summary", attMapper.selectMonthSummary(month));
//        map.put("voList", attMapper.selectMonthList(month));
//
//        return map;
//    }
//
//    // 2. 사원 상세조회
//    public Map<String, Object> selectDetail(String empNo, String month) {
//        Map<String, Object> map = new HashMap<>();
//        map.put("memberInfo", attMapper.selectMemberInfo(empNo));
//        map.put("summary", attMapper.selectEmpMonthSummary(empNo, month));
//        map.put("historyList", attMapper.selectEmpMonthHistory(empNo, month));
//        return map;
//    }
//
//    // 3. 근태 수정
//    @Transactional
//    public void updateAttendance(AttVo vo) {
//        int result = attMapper.updateAttendance(vo);
//        if (result != 1) {
//            throw new IllegalStateException("근태 수정 실패");
//        }
//    }
//
//    // 4. 휴가 승인 반영
//    @Transactional
//    public void applyVacationApproval(String docNo) {
//        ApprovedVacationVo vo = attMapper.selectApprovedVacationByDocNo(docNo);
//
//        if (vo == null) {
//            throw new IllegalStateException("승인된 휴가 문서가 없습니다.");
//        }
//
//        LocalDate startDate = LocalDate.parse(vo.getStartDate());
//        LocalDate endDate = LocalDate.parse(vo.getEndDate());
//
//        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
//            String workDate = date.toString();
//
//            int cnt = attMapper.checkAttendanceByEmpNoAndDate(vo.getWriterNo(), workDate);
//
//            if (cnt == 0) {
//                attMapper.insertVacationAttendance(vo.getWriterNo(), workDate);
//            } else {
//                attMapper.updateVacationAttendance(vo.getWriterNo(), workDate);
//            }
//        }
//    }
//
//    // 5. 연장근무 승인 반영
//    @Transactional
//    public void applyOvertimeApproval(String docNo) {
//        ApprovedOvertimeVo vo = attMapper.selectApprovedOvertimeByDocNo(docNo);
//
//        if (vo == null) {
//            throw new IllegalStateException("승인된 연장근무 문서가 없습니다.");
//        }
//
//        int approvedHours = Integer.parseInt(vo.getWorkHour());
//        int cnt = attMapper.checkAttendanceByEmpNoAndDate(vo.getWriterNo(), vo.getWorkDate());
//
//        if (cnt == 0) {
//            attMapper.insertOvertimeAttendance(vo.getWriterNo(), vo.getWorkDate(), approvedHours);
//        } else {
//            attMapper.updateOvertimeAttendance(vo.getWriterNo(), vo.getWorkDate(), approvedHours);
//        }
//    }
//
//    // 6. 출근 버튼
//    @Transactional
//    public void checkIn(String empNo) {
//        String workDate = LocalDate.now().toString();
//        AttVo vo = attMapper.selectAttendanceByEmpNoAndDate(empNo, workDate);
//
//        // 이미 휴가면 출근 불가
//        if (vo != null && "4".equals(vo.getStatusCode())) {
//            throw new IllegalStateException("오늘은 휴가 상태입니다.");
//        }
//
//        // 이미 출근시간 있으면 중복 방지
//        if (vo != null && vo.getCheckInAt() != null) {
//            throw new IllegalStateException("이미 출근 처리되었습니다.");
//        }
//
//        int statusCode = LocalTime.now().isAfter(LocalTime.of(9, 0)) ? 2 : 1;
//
//        if (vo == null) {
//            int result = attMapper.insertCheckIn(empNo, statusCode);
//            if (result != 1) {
//                throw new IllegalStateException("출근 처리 실패");
//            }
//        } else {
//            int result = attMapper.updateCheckIn(empNo, workDate, statusCode);
//            if (result != 1) {
//                throw new IllegalStateException("출근 처리 실패");
//            }
//        }
//    }
//
//    // 7. 퇴근 버튼
//    @Transactional
//    public void checkOut(String empNo) {
//        String workDate = LocalDate.now().toString();
//        AttVo vo = attMapper.selectAttendanceByEmpNoAndDate(empNo, workDate);
//
//        if (vo == null) {
//            throw new IllegalStateException("오늘 근태 기록이 없습니다.");
//        }
//
//        if (vo.getCheckInAt() == null) {
//            throw new IllegalStateException("출근 처리 후 퇴근할 수 있습니다.");
//        }
//
//        if (vo.getCheckOutAt() != null) {
//            throw new IllegalStateException("이미 퇴근 처리되었습니다.");
//        }
//
//        int approvedHours = vo.getOtApprovedHours() == null ? 0 : vo.getOtApprovedHours();
//        int confirmedHours = 0;
//
//        if (approvedHours > 0) {
//            LocalTime standardEnd = LocalTime.of(18, 0);
//            LocalTime now = LocalTime.now();
//            LocalTime targetEnd = standardEnd.plusHours(approvedHours);
//
//            if (!now.isBefore(targetEnd)) {
//                confirmedHours = approvedHours;
//            }
//        }
//
//        int result = attMapper.updateCheckOut(empNo, workDate, confirmedHours);
//        if (result != 1) {
//            throw new IllegalStateException("퇴근 처리 실패");
//        }
//    }
//
//    // 8. 결근 마감
//    @Transactional
//    public void markAbsent(String workDate) {
//
//        // 1) row는 있는데 상태가 아직 null이고 출근 안 한 경우 -> 결근 update
//        List<String> updateTargetList = attMapper.selectAbsentTargetEmpList(workDate);
//        for (String empNo : updateTargetList) {
//            AttVo vo = attMapper.selectAttendanceByEmpNoAndDate(empNo, workDate);
//
//            if (vo == null) {
//                attMapper.insertAbsentAttendance(empNo, workDate);
//            } else if (vo.getCheckInAt() == null && vo.getStatusCode() == null) {
//                attMapper.updateAbsentAttendance(empNo, workDate);
//            }
//        }
//    }
}