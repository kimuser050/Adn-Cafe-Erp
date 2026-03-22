package com.kh.app.feature.hr.payroll;

import com.kh.app.feature.finance.journal.JournalService;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
@Slf4j
@RequiredArgsConstructor
public class PayService {

    private final PayMapper payMapper;
    private final JournalService journalService;

    // 1. 급여 등록
    @Transactional
    public void insert(PayMasterVo vo) {

        if (vo.getDetailList() == null || vo.getDetailList().isEmpty()) {
            throw new IllegalStateException("급여 상세항목이 없습니다.");
        }

        // 중복체크
        int cnt = payMapper.checkDuplicate(vo);
        if (cnt > 0) {
            throw new IllegalStateException("이미 해당 사원의 해당 월 급여가 등록되어 있습니다.");
        }

        // 1.1 마스터 등록 (큰 판을 깔아주기)
        int masterResult = payMapper.insertMaster(vo);
        if (masterResult != 1) {
            throw new IllegalStateException("급여 마스터 등록 실패");
        }

        // 1.2 방금 등록한 payNo 가져오기
        String payNo = payMapper.selectCurrentPayNo();
        if (payNo == null || payNo.isBlank()) {
            throw new IllegalStateException("생성된 급여번호 조회 실패");
        }

        // 1.3 상세항목 등록
        for (PayDetailVo detailVo : vo.getDetailList()) {
            detailVo.setPayNo(payNo);

            int detailResult = payMapper.insertDetail(detailVo);
            if (detailResult != 1) {
                throw new IllegalStateException("급여 상세 등록 실패");
            }
        }
    }

    // 2. 월별 목록조회
    public Map<String, Object> selectList(String month, int currentPage, int pageLimit, int boardLimit) {
        month = getDefaultMonth(month);

        int listCount = payMapper.selectCount(month);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<PayMasterVo> voList = payMapper.selectListByPage(month, pvo);
        Map<String, Object> summaryMap = payMapper.selectSummaryByMonth(month);

        Map<String, Object> map = new HashMap<>();
        map.put("month", month);
        map.put("summaryMap", summaryMap);
        map.put("pvo", pvo);
        map.put("voList", voList);
        return map;
    }

    // 3. 상세조회
    public PayMasterVo selectOne(String payNo) {
        PayMasterVo masterVo = payMapper.selectOne(payNo);
        if (masterVo == null) {
            throw new IllegalArgumentException("존재하지 않는 급여입니다.");
        }

        List<PayDetailVo> detailList = payMapper.selectDetailList(payNo);
        masterVo.setDetailList(detailList);

        return masterVo;
    }

    // 4. 이름 검색
    public Map<String, Object> selectListByName(String month, String keyword, int currentPage, int pageLimit, int boardLimit) {
        month = getDefaultMonth(month);

        int listCount = payMapper.selectCountByName(month, keyword);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<PayMasterVo> voList = payMapper.selectListByNameByPage(month, keyword, pvo);
        Map<String, Object> summaryMap = payMapper.selectSummaryByMonth(month);

        Map<String, Object> map = new HashMap<>();
        map.put("month", month);
        map.put("keyword", keyword);
        map.put("summaryMap", summaryMap);
        map.put("pvo", pvo);
        map.put("voList", voList);
        return map;
    }

    // 5. 확정상태 검색
    public Map<String, Object> selectListByConfirmYn(String month, String confirmYn, int currentPage, int pageLimit, int boardLimit) {
        month = getDefaultMonth(month);

        int listCount = payMapper.selectCountByConfirmYn(month, confirmYn);
        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<PayMasterVo> voList = payMapper.selectListByConfirmYnByPage(month, confirmYn, pvo);
        Map<String, Object> summaryMap = payMapper.selectSummaryByMonth(month);

        Map<String, Object> map = new HashMap<>();
        map.put("month", month);
        map.put("confirmYn", confirmYn);
        map.put("summaryMap", summaryMap);
        map.put("pvo", pvo);
        map.put("voList", voList);
        return map;
    }
    // 6. 급여 확정
    @Transactional
    public int confirmY(String payNo) {
        PayMasterVo originVo = payMapper.selectOne(payNo);

        if (originVo == null) {
            throw new IllegalArgumentException("존재하지 않는 급여입니다.");
        }

        if ("Y".equals(originVo.getConfirmYn())) {
            return 1;
        }

        int result = payMapper.confirmY(payNo);
        if (result != 1) {
            throw new IllegalStateException("급여 확정 실패");
        }

        // return 전에 호출
        journalService.autoPayrollYInsert(originVo);

        return result;

    }

    // 7. 급여 확정 취소
    @Transactional
    public int confirmN(String payNo) {
        PayMasterVo originVo = payMapper.selectOne(payNo);

        if (originVo == null) {
            throw new IllegalArgumentException("존재하지 않는 급여입니다.");
        }

        if ("N".equals(originVo.getConfirmYn())) {
            return 1;
        }

        int result = payMapper.confirmN(payNo);
        if (result != 1) {
            throw new IllegalStateException("급여 확정 취소 실패");
        }


        journalService.autoPayrollNInsert(originVo);

        return result;
    }

    // 8. 급여 삭제
    @Transactional
    public int delete(String payNo) {
        PayMasterVo originVo = payMapper.selectOne(payNo);

        if (originVo == null) {
            throw new IllegalArgumentException("존재하지 않는 급여입니다.");
        }

        if ("Y".equals(originVo.getConfirmYn())) {
            throw new IllegalStateException("확정된 급여는 삭제할 수 없습니다.");
        }

        int result = payMapper.delete(payNo);
        if (result != 1) {
            throw new IllegalStateException("급여 삭제 실패");
        }

        return result;
    }

    // 9. 급여 수정
    @Transactional
    public int update(String payNo, PayMasterVo vo) {

        PayMasterVo originVo = payMapper.selectOne(payNo);
        if (originVo == null) {
            throw new IllegalArgumentException("존재하지 않는 급여입니다.");
        }

        if ("Y".equals(originVo.getConfirmYn())) {
            throw new IllegalStateException("확정된 급여는 수정할 수 없습니다.");
        }

        if (vo.getDetailList() == null || vo.getDetailList().isEmpty()) {
            throw new IllegalStateException("급여 상세항목이 없습니다.");
        }

        vo.setPayNo(payNo);

        int masterResult = payMapper.updateMaster(vo);
        if (masterResult != 1) {
            throw new IllegalStateException("급여 마스터 수정 실패");
        }

        payMapper.deleteDetailByPayNo(payNo);

        for (PayDetailVo detailVo : vo.getDetailList()) {
            detailVo.setPayNo(payNo);

            int detailResult = payMapper.insertDetail(detailVo);
            if (detailResult != 1) {
                throw new IllegalStateException("급여 상세 재등록 실패");
            }
        }

        return 1;
    }

    // 10. 등록/수정용 항목 목록
    public List<PayItemVo> selectItemList() {
        return payMapper.selectItemList();
    }

    // 11. 사원 검색
    public List<PayEmpVo> searchEmp(String keyword) {
        return payMapper.searchEmp(keyword);
    }

    // 12. 사원 1명 조회
    public PayEmpVo selectEmpOne(String empNo) {
        PayEmpVo vo = payMapper.selectEmpOne(empNo);
        if (vo == null) {
            throw new IllegalArgumentException("존재하지 않는 사원입니다.");
        }
        return vo;
    }

    // 공통
    private String getDefaultMonth(String month) {
        if (month == null || month.isBlank()) {
            return LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        }
        return month;
    }

    public Map<String, Object> selectAttendanceSummary(String empNo, String month) {
        Map<String, Object> map = new HashMap<>();

        int otHours = payMapper.selectConfirmedOtHoursByMonth(empNo, month);
        map.put("otHours", otHours);

        return map;
    }
}