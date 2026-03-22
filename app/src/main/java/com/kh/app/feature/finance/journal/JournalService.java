package com.kh.app.feature.finance.journal;

import com.kh.app.feature.finance.account.AccountVo;
import com.kh.app.feature.finance.dailySales.DailySalesVo;
import com.kh.app.feature.hr.payroll.PayMasterVo;
import com.kh.app.feature.stock.Return_Req.ReqVo;
import com.kh.app.feature.stock.inbound.InboundVo;
import com.kh.app.feature.stock.oderReq.OderReqVo;
import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("Duplicates") // "중복 코드 알고 있으니 경고 띄우지 마"라는 뜻
@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Service
public class JournalService {

    private final JournalMapper journalMapper;

    @Transactional
    public int insertJournal(List<JournalVo> voList) {

        if (voList == null || voList.size() < 2) {
            throw new IllegalArgumentException("차변과 대변 내역이 모두 필요합니다.");
        }
        // 1. 시퀀스에서 공통 전표번호 하나 가져오기
        String sharedNo = journalMapper.getJournalNo();
        int totalResult = 0;

        // 2. 리스트를 돌면서 차변/대변 입력
        for (JournalVo vo : voList) {
            vo.setJournalNo(sharedNo);
            totalResult += journalMapper.insertJournal(vo);
        }

        return totalResult;
    }

    @Transactional
    public int updateJournal(List<JournalVo> voList) {

        if (voList == null || voList.size() < 2) {
            throw new IllegalArgumentException("차변과 대변 내역이 모두 필요합니다.");
        }

        String sharedNo = voList.get(0).getJournalNo();
        journalMapper.delJournalNo(sharedNo);

        int totalResult = 0;

        for (JournalVo vo : voList) {
            vo.setJournalNo(sharedNo);
            totalResult += journalMapper.insertJournal(vo);
        }

        return totalResult;
    }


    @Transactional
    public int delJournal(String journalNo){
        return journalMapper.delJournal(journalNo);
    }


    public List<JournalVo> selectJournal(String journalDate) {
        return journalMapper.selectJournal(journalDate);
    }


    public List<AccountVo> getAccountList() {
        return journalMapper.getAccountList();
    }

    public List<JournalVo> totalList(String accountNo) {
        return journalMapper.totalList(accountNo);
    }

    public List<JournalVo> monthList(String journalDate) {
        return journalMapper.monthList(journalDate);
    }

    public List<JournalVo> dailyList(String journalDate) {
        return journalMapper.dailyList(journalDate);
    }

    public List<JournalVo> journalState(String journalDate) {
        return journalMapper.journalState(journalDate);
    }

    public List<JournalVo> incomeState(String journalDate) {
        return journalMapper.incomeState(journalDate);
    }

    //급여확정 전표자동생성
    @Transactional
    public int autoPayrollYInsert(PayMasterVo Pvo){

        String sharedNo = journalMapper.getJournalNo();

        //리스트생성
        List<JournalVo> jVoList = new ArrayList<>();

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        debitVo.setAccountNo("5010");
        debitVo.setDebit(Pvo.getNetAmount());
        debitVo.setCredit("0");
        debitVo.setWriterNo(Pvo.getEmpNo());
        debitVo.setJournalDate(Pvo.getUpdatedAt());
        jVoList.add(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("1120");
        creditVo.setDebit("0");
        creditVo.setCredit(Pvo.getNetAmount());
        creditVo.setWriterNo(Pvo.getEmpNo());
        creditVo.setJournalDate(Pvo.getUpdatedAt());
        jVoList.add(creditVo);

        int totalResult = 0;
        for (JournalVo vo : jVoList) {
            totalResult += journalMapper.insertJournal(vo);
        }

        if (totalResult != jVoList.size()) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }

    //급여취소 전표자동생성
    @Transactional
    public int autoPayrollNInsert(PayMasterVo Pvo){

        String sharedNo = journalMapper.getJournalNo();

        //리스트생성
        List<JournalVo> jVoList = new ArrayList<>();

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        debitVo.setAccountNo("1120");
        debitVo.setDebit(Pvo.getNetAmount());
        debitVo.setCredit("0");
        debitVo.setWriterNo(Pvo.getEmpNo());
        debitVo.setJournalDate(Pvo.getUpdatedAt());
        jVoList.add(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("5010");
        creditVo.setDebit("0");
        creditVo.setCredit(Pvo.getNetAmount());
        creditVo.setWriterNo(Pvo.getEmpNo());
        creditVo.setJournalDate(Pvo.getUpdatedAt());
        jVoList.add(creditVo);

        int totalResult = 0;
        for (JournalVo vo : jVoList) {
            totalResult += journalMapper.insertJournal(vo);
        }

        if (totalResult != jVoList.size()) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }

    //매출등록 전표자동생성
    @Transactional
    public int autoSalesInsert(DailySalesVo Dvo, HttpSession session){

        //작성자 사번 받아오기
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if (loginMemberVo == null) {
            throw new RuntimeException("로그인 세션이 만료되었습니다.");
        }

        //리스트생성
        String sharedNo = journalMapper.getJournalNo();

        int totalResult = 0;

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        if ("D".equals(Dvo.getPaymentCd())) {
            debitVo.setAccountNo("1130"); // 외상매출금(카드결제)
        } else {
            debitVo.setAccountNo("1120"); // 보통예금(현금결제)
        }
        debitVo.setDebit(Dvo.getTotalSales());
        debitVo.setCredit("0");
        debitVo.setWriterNo(loginMemberVo.getEmpNo());
        debitVo.setJournalDate(Dvo.getSalesDate());
        totalResult += journalMapper.insertJournal(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("4010"); //제품매출
        creditVo.setDebit("0");
        creditVo.setCredit(Dvo.getTotalSales());
        creditVo.setWriterNo(loginMemberVo.getEmpNo());
        creditVo.setJournalDate(Dvo.getSalesDate());
        totalResult += journalMapper.insertJournal(creditVo);

        if (totalResult != 2 ) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }

    //입고확정(거래처에서 본사로 입고) 전표자동생성
    @Transactional
    public int autoInboundYInsert(InboundVo IVo){

        String sharedNo = journalMapper.getJournalNo();

        //리스트생성
        List<JournalVo> jVoList = new ArrayList<>();

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        debitVo.setAccountNo("1140"); // '원재료'코드
        debitVo.setDebit(IVo.getTotalPrice());
        debitVo.setCredit("0");
        debitVo.setWriterNo("입고관리팀");
        debitVo.setJournalDate(IVo.getUpdatedAt());
        jVoList.add(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("1120"); //'보통예금'코드
        creditVo.setDebit("0");
        creditVo.setCredit(IVo.getTotalPrice());
        creditVo.setWriterNo("입고관리팀");
        creditVo.setJournalDate(IVo.getUpdatedAt());
        jVoList.add(creditVo);

        int totalResult = 0;
        for (JournalVo vo : jVoList) {
            totalResult += journalMapper.insertJournal(vo);
        }

        if (totalResult != jVoList.size()) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }

    //입고취소(거래처에서 본사로 입고) 전표자동생성
    @Transactional
    public int autoInboundNInsert(InboundVo IVo){

        String sharedNo = journalMapper.getJournalNo();

        //리스트생성
        List<JournalVo> jVoList = new ArrayList<>();

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        debitVo.setAccountNo("1120"); // '보통예금'코드
        debitVo.setDebit(IVo.getTotalPrice());
        debitVo.setCredit("0");
        debitVo.setWriterNo("입고관리팀");
        debitVo.setJournalDate(IVo.getUpdatedAt());
        jVoList.add(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("1140"); //'원재료'코드
        creditVo.setDebit("0");
        creditVo.setCredit(IVo.getTotalPrice());
        creditVo.setWriterNo("입고관리팀");
        creditVo.setJournalDate(IVo.getUpdatedAt());
        jVoList.add(creditVo);

        int totalResult = 0;
        for (JournalVo vo : jVoList) {
            totalResult += journalMapper.insertJournal(vo);
        }

        if (totalResult != jVoList.size()) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }


    //발주확정(본사재고 내에서 점주가 발주) 전표 자동생성
    @Transactional
    public int autoOrderYInsert(OderReqVo oderReqVo){

        String sharedNo = journalMapper.getJournalNo();

        //리스트생성
        List<JournalVo> jVoList = new ArrayList<>();

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        debitVo.setAccountNo("1140"); // '원재료'코드
        debitVo.setDebit(oderReqVo.getTotalPrice());
        debitVo.setCredit("0");
        debitVo.setWriterNo("발주관리팀");
        debitVo.setJournalDate(oderReqVo.getRequestDate());
        jVoList.add(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("5020"); //'제조원가'코드
        creditVo.setDebit("0");
        creditVo.setCredit(oderReqVo.getTotalPrice());
        creditVo.setWriterNo("발주관리팀");
        creditVo.setJournalDate(oderReqVo.getRequestDate());
        jVoList.add(creditVo);

        int totalResult = 0;
        for (JournalVo vo : jVoList) {
            totalResult += journalMapper.insertJournal(vo);
        }

        if (totalResult != jVoList.size()) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }

    //발주취소(본사재고 내에서 점주가 발주) 전표 자동생성
    @Transactional
    public int autoOrderNInsert(OderReqVo oderReqVo){

        String sharedNo = journalMapper.getJournalNo();

        //리스트생성
        List<JournalVo> jVoList = new ArrayList<>();

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        debitVo.setAccountNo("5020"); // '제조원가'코드
        debitVo.setDebit(oderReqVo.getTotalPrice());
        debitVo.setCredit("0");
        debitVo.setWriterNo("발주관리팀");
        debitVo.setJournalDate(oderReqVo.getRequestDate());
        jVoList.add(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("1140"); //'원재료'코드
        creditVo.setDebit("0");
        creditVo.setCredit(oderReqVo.getTotalPrice());
        creditVo.setWriterNo("발주관리팀");
        creditVo.setJournalDate(oderReqVo.getRequestDate());
        jVoList.add(creditVo);

        int totalResult = 0;
        for (JournalVo vo : jVoList) {
            totalResult += journalMapper.insertJournal(vo);
        }

        if (totalResult != jVoList.size()) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }


    //반품확정(매장에서 본사에게 원재료 반품신청) 전표 자동생성
    @Transactional
    public int autoReturnYInsert(ReqVo RVo){

        String ReqTotalPrice = journalMapper.ReqTotalPrice(RVo.getReturnNo());
        String sharedNo = journalMapper.getJournalNo();

        //리스트생성
        List<JournalVo> jVoList = new ArrayList<>();

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        debitVo.setAccountNo("5020"); // '재고자산폐기손실'코드
        debitVo.setDebit(ReqTotalPrice);
        debitVo.setCredit("0");
        debitVo.setWriterNo("반품관리팀");
        debitVo.setJournalDate(RVo.getCreateAt());
        jVoList.add(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("1140"); //'원재료'코드
        creditVo.setDebit("0");
        creditVo.setCredit(ReqTotalPrice);
        creditVo.setWriterNo("반품관리팀");
        creditVo.setJournalDate(RVo.getCreateAt());
        jVoList.add(creditVo);

        int totalResult = 0;
        for (JournalVo vo : jVoList) {
            totalResult += journalMapper.insertJournal(vo);
        }

        if (totalResult != jVoList.size()) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }

    //반품취소(매장에서 본사에게 원재료 반품신청) 전표 자동생성
    @Transactional
    public int autoReturnNInsert(ReqVo RVo){

        String ReqTotalPrice = journalMapper.ReqTotalPrice(RVo.getReturnNo());
        String sharedNo = journalMapper.getJournalNo();

        //리스트생성
        List<JournalVo> jVoList = new ArrayList<>();

        //차변
        JournalVo debitVo = new JournalVo();
        debitVo.setJournalNo(sharedNo);
        debitVo.setAccountNo("1140"); // '원재료'코드
        debitVo.setDebit(ReqTotalPrice);
        debitVo.setCredit("0");
        debitVo.setWriterNo("반품관리팀");
        debitVo.setJournalDate(RVo.getCreateAt());
        jVoList.add(debitVo);

        //대변
        JournalVo creditVo = new JournalVo();
        creditVo.setJournalNo(sharedNo);
        creditVo.setAccountNo("5020"); //'재고자산폐기손실'코드
        creditVo.setDebit("0");
        creditVo.setCredit(ReqTotalPrice);
        creditVo.setWriterNo("반품관리팀");
        creditVo.setJournalDate(RVo.getCreateAt());
        jVoList.add(creditVo);

        int totalResult = 0;
        for (JournalVo vo : jVoList) {
            totalResult += journalMapper.insertJournal(vo);
        }

        if (totalResult != jVoList.size()) {
            throw new RuntimeException("전표 저장 중 일부 데이터가 누락되었습니다.");
        }

        return totalResult;
    }
}


