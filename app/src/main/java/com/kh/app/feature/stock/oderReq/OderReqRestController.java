package com.kh.app.feature.stock.oderReq;

import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/order")
@RestController
public class OderReqRestController {

    private final OderReqService oderReqService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    /**
     * [발주 물품 목록 조회]
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(required = false) String keyword,
            HttpSession session) {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        // ... 이하 로직 동일
        String empNo = (loginMemberVo != null) ? loginMemberVo.getEmpNo() : "";

        int listCount = oderReqService.selectCount(keyword);
        PageVo pagingInfo = new PageVo(listCount, currentPage, 10, 10);

        List<OderReqVo> voList = oderReqService.selectList(pagingInfo, keyword, empNo);

        Map<String, Object> map = new HashMap<>();
        map.put("pagingInfo", pagingInfo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    /**
     * [발주 이력 조회]
     * 수정: storeCode 파라미터 제거 및 세션 방어 로직 강화
     */
    @GetMapping("/history")
    public ResponseEntity<Map<String, Object>> selectHistory(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String empNo,
            HttpSession session) {

        // 1. 세션에서 로그인 정보 가져오기 (JS에서 누락될 경우 대비)
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        // 2. 사번이 넘어오지 않았거나 "false"인 경우 세션값으로 대체
        if (empNo == null || empNo.isEmpty() || "false".equals(empNo)) {
            empNo = (loginMemberVo != null) ? loginMemberVo.getEmpNo() : "";
        }

        log.info("발주 이력 조회 요청 - empNo: {}, keyword: {}", empNo, keyword);

        // 3. 서비스 호출 (이제 Mapper 내부에서 empNo로 본사/지점 판별함)
        int listCount = oderReqService.selectHistoryCount(keyword, empNo);
        PageVo pagingInfo = new PageVo(listCount, currentPage, 5, 10);
        List<OderReqVo> voList = oderReqService.selectHistory(pagingInfo, keyword, empNo);

        Map<String, Object> map = new HashMap<>();
        map.put("pagingInfo", pagingInfo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    /**
     * [발주 상태 수정]
     */
    @PutMapping("/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@RequestBody OderReqVo vo) {
        log.info("상태 수정 요청: {}", vo);
        int result = oderReqService.updateStatus(vo);

        if (result < 1) {
            return ResponseEntity.internalServerError().build();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    /**
     * [발주 상세조회]
     */
    @GetMapping("/{orderNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String orderNo) {
        OderReqVo vo = oderReqService.selectOne(orderNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        return ResponseEntity.ok(map);
    }

    /**
     * [다중 발주 등록]
     */
    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> orderReqBulk(
            @RequestBody List<OderReqVo> voList,
            HttpSession session) {

        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if (loginMemberVo == null) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("result", 0);
            errorMap.put("msg", "로그인 세션이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMap);
        }

        log.info("다중 발주 요청 처리 시작: {}건, 신청자: {}", voList.size(), loginMemberVo.getEmpNo());

        // 서비스 내부에서 empNo를 이용해 진짜 STORE_CODE를 찾아서 insert 하도록 설계됨
        int result = oderReqService.orderReqBulk(voList, loginMemberVo.getEmpNo());

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result", result);
        resultMap.put("msg", result > 0 ? "발주 성공" : "발주 실패");

        return ResponseEntity.ok(resultMap);
    }
}