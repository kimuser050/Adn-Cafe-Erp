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
@RequestMapping("/api/order") // ★ 앞에 슬래시(/) 추가! 절대경로 명시
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
            HttpSession session) { // 1. 세션 주입 받기

        // 2. 세션에서 로그인 객체 꺼내기
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        // 로그인이 안 되어 있을 경우에 대한 방어 로직 (선택)
        String empNo = (loginMemberVo != null) ? loginMemberVo.getEmpNo() : "";

        int listCount = oderReqService.selectCount(keyword);

        // PageVo 생성 (기존 로직 유지)
        PageVo pagingInfo = new PageVo(listCount, currentPage, 10, 10); // pageLimit, boardLimit 값 확인 필요

        // 3. 서비스 호출 시 empNo를 함께 전달 (여기서 빨간 줄 해결!)
        List<OderReqVo> voList = oderReqService.selectList(pagingInfo, keyword, empNo);

        Map<String, Object> map = new HashMap<>();
        map.put("pagingInfo", pagingInfo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    /**
     * [발주 이력 조회] - JS의 loadHistoryList에서 호출하는 주소
     */
    @GetMapping("/history") // 앞에 / 추가 권장
    public ResponseEntity<Map<String, Object>> selectHistory(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(required = false) String keyword) {

        int listCount = oderReqService.selectHistoryCount(keyword);
        // 이력 탭은 게시글 10개씩 노출
        PageVo pagingInfo = new PageVo(listCount, currentPage, 5, 10);
        List<OderReqVo> voList = oderReqService.selectHistory(pagingInfo, keyword);

        Map<String, Object> map = new HashMap<>();
        map.put("pagingInfo", pagingInfo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }

    /**
     * [발주 상태 수정]
     */
    @PutMapping("/status") // 앞에 / 추가 권장
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

    @PostMapping("/bulk")
    public ResponseEntity<Map<String, Object>> orderReqBulk(
            @RequestBody List<OderReqVo> voList,
            HttpSession session) { // 1. 세션 주입 받기

        // 2. 세션에서 로그인한 사용자 정보 가져오기
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        // 로그인 정보가 없을 경우 예외 처리
        if (loginMemberVo == null) {
            Map<String, Object> errorMap = new HashMap<>();
            errorMap.put("result", 0);
            errorMap.put("msg", "로그인 세션이 만료되었습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMap);
        }

        // 3. 리스트를 돌면서 비어있는 storeCode를 로그인 유저의 부서코드(deptCode)로 채우기
        // MemberVo의 필드명이 deptCode라면 아래와 같이 작성합니다.
        for (OderReqVo vo : voList) {
            vo.setStoreCode(loginMemberVo.getDeptCode());
            log.info("발주 품목: {}, 매장코드: {}", vo.getItemNo(), vo.getStoreCode());
        }

        log.info("다중 발주 요청 처리 시작: {}건", voList.size());
        int result = oderReqService.orderReqBulk(voList);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("result", result);
        resultMap.put("msg", result > 0 ? "발주 성공" : "발주 실패");

        return ResponseEntity.ok(resultMap);
    }
}