package com.kh.app.feature.hr.att;

import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.DayOfWeek;
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

    // =========================================================
    // 1. 특정 날짜 전 직원 기본 근태 row 생성
    // =========================================================
    // - 특정 날짜(workDate)에 대해
    // - 재직 중인 직원들 중
    // - 아직 ATTENDANCE row가 없는 직원만 조회
    // - 기본 row insert
    // - 반환값은 생성 건수
    @Transactional
    public int initDailyAttendance(String workDate) {
        //주말 방어하기-> 그 다음 실행
        LocalDate date = LocalDate.parse(workDate);
    
        if (date.getDayOfWeek() == DayOfWeek.SATURDAY
                || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return 0;
        }


        List<String> empNoList = attMapper.selectEmpNoListForDailyInit(workDate);

        int cnt = 0;
        for (String empNo : empNoList) {
            cnt += attMapper.insertDailyAttendanceRow(empNo, workDate);
        }

        return cnt;
    }

    // =========================================================
    // 2. 월별 전체 근태 조회
    // =========================================================
    // - month(yyyy-MM)를 기준으로
    // - 상단 카드용 전체 summary 조회
    // - 직원별 월간 집계 리스트 조회
    // - map으로 묶어 반환
    public Map<String, Object> selectMonthAttendance(String month, int currentPage, int pageLimit, int boardLimit) {
        Map<String, Object> map = new HashMap<>();

        int listCount = attMapper.selectMonthListCount();
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        AttSummaryVo summary = attMapper.selectMonthSummary(month);
        List<AttListVo> voList = attMapper.selectMonthListByPage(month, pvo);

        map.put("summary", summary);
        map.put("pvo", pvo);
        map.put("voList", voList);

        return map;
    }

    // =========================================================
    // 3. 사원별 월간 상세 조회
    // =========================================================
    // - empNo(선택한 사원), month(내가 선택한 달)을 기준으로
    // - 사원 기본정보 조회
    // - 사원 월간 요약 조회
    // - 사원 일별 이력 조회
    public Map<String, Object> selectEmpMonthDetail(String empNo, String month) {
        Map<String, Object> map = new HashMap<>();

        AttListVo memberInfo = attMapper.selectMemberInfo(empNo);
        AttSummaryVo summary = attMapper.selectEmpMonthSummary(empNo, month);
        List<AttDetailVo> historyList = attMapper.selectEmpMonthHistory(empNo, month);

        map.put("memberInfo", memberInfo);
        map.put("summary", summary);
        map.put("historyList", historyList);

        return map;
    }

    // =========================================================
    // 4. 근태 수정
    // =========================================================
    // - attNo 기준으로 단건 수정
    // - 상태코드, 출근시간, 퇴근시간, 비고, 신청OT, 인정OT 수정
    // - 수정 결과가 1건이 아니면 예외
    @Transactional
    public void updateAttendance(AttVo vo) {
        int result = attMapper.updateAttendance(vo);

        if (result != 1) {
            throw new IllegalStateException("근태 수정 실패");
        }
    }


    // =========================================================
    // 5. 출근 처리
    // =========================================================
    @Transactional
    public void checkIn(String empNo) {
        String workDate = LocalDate.now().toString();

        // 1) 오늘 근태 row 조회
        AttVo vo = attMapper.selectAttendanceByEmpNoAndDate(empNo, workDate);

        // 2) row 없으면 오늘 내 row 먼저 생성
        if (vo == null) {
            int insertResult = attMapper.insertTodayAttendanceRow(empNo, workDate);

            if (insertResult != 1) {
                throw new IllegalStateException("오늘 근태 row 생성 실패");
            }

            // 다시 조회
            vo = attMapper.selectAttendanceByEmpNoAndDate(empNo, workDate);

            if (vo == null) {
                throw new IllegalStateException("오늘 근태 row 조회 실패");
            }
        }

        // 3) 휴가 상태면 출근 불가
        if ("4".equals(vo.getStatusCode())) {
            throw new IllegalStateException("오늘은 휴가 상태라 출근할 수 없습니다.");
        }

        // 4) 이미 출근시간 있으면 중복 출근 불가
        if (vo.getCheckInAt() != null) {
            throw new IllegalStateException("이미 출근 처리되었습니다.");
        }

        // 5) 현재 시간 기준 출근(1) / 지각(2) 판정
        int statusCode = LocalTime.now().isAfter(LocalTime.of(9, 0)) ? 2 : 1;

        // 6) 출근 update
        int result = attMapper.updateCheckIn(empNo, workDate, statusCode);

        if (result != 1) {
            throw new IllegalStateException("출근 처리 실패");
        }
    }

    // =========================================================
    // 6. 퇴근 처리
    // =========================================================
    @Transactional
    public void checkOut(String empNo) {
        String workDate = LocalDate.now().toString();

        // 1) 오늘 근태 row 조회
        AttVo vo = attMapper.selectAttendanceByEmpNoAndDate(empNo, workDate);

        // 2) row 없으면 예외
        if (vo == null) {
            throw new IllegalStateException("오늘 근태 정보가 없습니다.");
        }

        // 3) 출근시간 없으면 퇴근 불가
        if (vo.getCheckInAt() == null) {
            throw new IllegalStateException("출근처리가 되어야 퇴근 가능합니다.");
        }

        // 4) 이미 퇴근시간 있으면 중복 퇴근 불가
        if (vo.getCheckOutAt() != null) {
            throw new IllegalStateException("이미 퇴근 처리되었습니다.");
        }

        // 5) 승인 OT 시간 확인
        int approvedHours = vo.getOtApprovedHours() == null ? 0 : vo.getOtApprovedHours();

        // 6) 인정 OT 시간 계산
        int confirmedHours = 0;

        if (approvedHours > 0) {
            LocalTime standardEnd = LocalTime.of(18, 0);
            LocalTime now = LocalTime.now();
            LocalTime targetEnd = standardEnd.plusHours(approvedHours);

            // 승인 시간만큼 다 채웠을 때만 인정
            if (!now.isBefore(targetEnd)) {
                confirmedHours = approvedHours;
            }
        }

        // 7) 퇴근 update
        int result = attMapper.updateCheckOut(empNo, workDate, confirmedHours);

        if (result != 1) {
            throw new IllegalStateException("퇴근 처리 실패");
        }
    }


    //전자 결재 내용 끌어오고 , 어떤 문서인지 분류해서 보내버리기
    @Transactional
    public void applyApproval(String docNo) {
        String categoryNo = attMapper.selectApprovalCategoryByDocNo(docNo);

        if ("1".equals(categoryNo)) {
            applyVacationApproval(docNo);
        } else if ("2".equals(categoryNo)) {
            applyOvertimeApproval(docNo);
        }
    }

    //이거 휴가건이라면?
    @Transactional
    public void applyVacationApproval(String docNo) {
        ApprovedVacationVo vo = attMapper.selectApprovedVacationByDocNo(docNo);

        if (vo == null) {
            throw new IllegalStateException("승인된 휴가 문서를 찾을 수 없습니다.");
        }

        LocalDate startDate = LocalDate.parse(vo.getStartDate());
        LocalDate endDate = LocalDate.parse(vo.getEndDate());

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            String workDate = date.toString();

            int cnt = attMapper.checkAttendanceExists(vo.getWriterNo(), workDate);

            if (cnt == 0) {
                attMapper.insertVacationAttendance(vo.getWriterNo(), workDate);
            } else {
                attMapper.updateVacationAttendance(vo.getWriterNo(), workDate);
            }
        }
    }


    //2. 이거 연장근무건이라면?
    @Transactional
    public void applyOvertimeApproval(String docNo) {
        ApprovedOvertimeVo vo = attMapper.selectApprovedOvertimeByDocNo(docNo);

        if (vo == null) {
            throw new IllegalStateException("승인된 연장근무 문서를 찾을 수 없습니다.");
        }

        int approvedHours = Integer.parseInt(vo.getWorkHour());
        int cnt = attMapper.checkAttendanceExists(vo.getWriterNo(), vo.getWorkDate());

        if (cnt == 0) {
            attMapper.insertOvertimeAttendance(vo.getWriterNo(), vo.getWorkDate(), approvedHours);
        } else {
            attMapper.updateOvertimeAttendance(vo.getWriterNo(), vo.getWorkDate(), approvedHours);
        }
    }


    // =========================================================
    // 9. 결근 마감 처리
    // =========================================================
    // - 특정 날짜를 기준으로
    // - 상태 null + 출근시간 null인 row는 결근(3)으로 update
    // - 또는 row 자체가 없는 재직자에 대해서는 결근 row insert 가능
    // - 평일만 처리할지 여부는 나중에
    @Transactional
    public int markAbsent(String workDate) {
        List<String> empNoList = attMapper.selectAbsentTargetEmpNoList(workDate);

        int cnt = 0;
        for (String empNo : empNoList) {
            cnt += attMapper.updateAbsentAttendance(empNo, workDate);
        }

        return cnt;
    }

    public Map<String, Object> selectListByName(String month, String keyword, int currentPage, int pageLimit, int boardLimit) {
        int listCount = attMapper.selectListCountByName(keyword);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<AttListVo> voList = attMapper.selectListByNameWithPage(month, keyword, pvo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return map;
    }

    public Map<String, Object> selectListByDeptName(String month, String deptName, int currentPage, int pageLimit, int boardLimit) {
        int listCount = attMapper.selectListCountByDeptName(deptName);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<AttListVo> voList = attMapper.selectListByDeptNameWithPage(month, deptName, pvo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return map;
    }
}
