package com.kh.app.feature.stock.Return_Req;

import com.kh.app.feature.user.member.MemberVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/reqreturn")
@RestController
public class ReqRestController {

    private final ReqService reqService;

    @GetMapping("item-list")
    public ResponseEntity<List<ReqVo>> getItemList() {
        return ResponseEntity.ok(reqService.getItemList());
    }

    @GetMapping("store-name")
    public ResponseEntity<Map<String, String>> getStoreName(HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        // 화면에는 '대전점' 같은 이름을 보여줍니다.
        String storeName = reqService.getStoreNameByEmpNo(loginMemberVo.getEmpNo());
        return ResponseEntity.ok(Map.of("storeName", storeName));
    }

    @GetMapping("list")
    public ResponseEntity<Map<String, Object>> list(ReqVo vo){
        List<ReqVo> voList = reqService.list(vo);
        Map<String, Object> map = new HashMap<>();
        map.put("voList", voList);
        map.put("result", "1");
        return ResponseEntity.ok(map);
    }

    @PostMapping("insert")
    public ResponseEntity<Map<String, Object>> insertReturn(@RequestBody ReqVo vo, HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");

        if (loginMemberVo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // [핵심] 이름('대전점')이 아니라 숫자 코드('10')를 조회합니다.
        String realStoreCode = reqService.getStoreCodeByEmpNo(loginMemberVo.getEmpNo());

        if (realStoreCode == null) {
            return ResponseEntity.badRequest().body(Map.of("result", "0", "msg", "매장 정보가 없습니다."));
        }

        vo.setStoreCode(realStoreCode); // 이제 진짜 숫자가 들어갑니다.
        log.info("반품 신청 데이터: {}", vo);

        int result = reqService.reqinsert(vo);

        if(result > 0) {
            return ResponseEntity.ok(Map.of("result", "1", "msg", "반품 신청이 완료되었습니다."));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("result", "0", "msg", "신청 실패"));
        }
    }
}