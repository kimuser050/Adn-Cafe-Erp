package com.kh.app.feature.stock.itemcheck;

import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("api/itemcheck")
@RestController
public class CheckRestController {
    private final CheckService checkService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;

    // 검수 조회 (세션 활용 버전)
    @GetMapping("list")
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(required = false, defaultValue = "1") int currentPage,
            @RequestParam(required = false) String keyword,
            HttpSession session) {

        // 1. 세션에서 로그인 정보 가져오기
        MemberVo loginMember = (MemberVo) session.getAttribute("loginMemberVo");

        // [중요] 사번(empNo)과 부서코드(deptCode)를 모두 꺼냅니다.
        String empNo = (loginMember != null) ? loginMember.getEmpNo() : "";
        String deptCode = (loginMember != null) ? loginMember.getDeptCode() : "";

        // 2. 전체 개수 조회 및 페이징 계산
        // Mapper/Service 수정사항에 맞춰 deptCode, empNo 추가 전달
        int listCount = checkService.selectCount(keyword, deptCode, empNo);
        PageVo pvo = new PageVo(listCount, currentPage, this.pageLimit, this.boardLimit);

        // 3. [핵심] 서비스 호출 시 권한 식별을 위해 deptCode도 함께 전달
        List<CheckVo> voList = checkService.selectList(pvo, keyword, deptCode, empNo);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        // 로그 출력 (부서와 사번을 함께 표시하여 디버깅 용이)
        log.info("검수 조회 요청 - 부서: {}, 사번: {}, 결과수: {}", deptCode, empNo, voList.size());

        return ResponseEntity.ok(map);
    }

    /**
     * [반품 상세 조회]
     */
    @GetMapping("{returnNo}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String returnNo) {
        CheckVo vo = checkService.selectOne(returnNo);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        return ResponseEntity.ok(map);
    }

    /**
     * [검수 상태 수정]
     */
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateByNo(@RequestBody CheckVo vo) {
        int result = checkService.updateByNo(vo);

        if(result != 1) {
            return ResponseEntity.internalServerError().build();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }
}
