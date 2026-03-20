package com.kh.app.feature.user.notice;

import com.kh.app.feature.user.member.MemberVo;
import com.kh.app.feature.util.PageVo;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("notice")
@Slf4j
@RequiredArgsConstructor
public class NoticeRestController {

    private final NoticeService noticeService;

    @Value("${page.pageLimit}")
    private int pageLimit;

    @Value("${page.boardLimit}")
    private int boardLimit;


    @PostMapping
    public ResponseEntity<Map<String, String>> insert(
            @RequestParam(required = false) MultipartFile file,
            NoticeVo vo,
            HttpSession session) throws Exception {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null){
            throw new IllegalStateException("login required");
        }

        // --- 🔥 [권한 검증 추가] ---
        String userDept = loginMemberVo.getDeptCode(); // 로그인 유저 부서 코드
        String category = vo.getCategory();           // 작성하려는 공지 카테고리 ("인사", "재무" 등)
        boolean isAuthorized = false;

        if ("310100".equals(userDept)) {
            // 경영혁신실은 모든 카테고리 가능
            isAuthorized = true;
        } else {
            // 일반 부서는 본인 부서 카테고리 또는 "공통"만 가능
            if ("공통".equals(category)) {
                isAuthorized = true;
            } else if ("인사".equals(category) && "310101".equals(userDept)) {
                isAuthorized = true;
            } else if ("재무".equals(category) && "310102".equals(userDept)) {
                isAuthorized = true;
            } else if ("품질".equals(category) && "310103".equals(userDept)) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            log.warn("권한 없는 공지 작성 시도: 유저부서={}, 카테고리={}", userDept, category);
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("result", "0");
            errorMap.put("msg", "해당 카테고리의 공지사항을 작성할 권한이 없습니다.");
            return ResponseEntity.status(403).body(errorMap); // 403 Forbidden 반환
        }
        // --- [권한 검증 끝] ---

        String loginMemberNo = loginMemberVo.getEmpNo();
        vo.setWriterNo(loginMemberNo);

        int result = noticeService.insert(vo, file);

        if (result != 1) {
            String errMsg = "[B-100] insert err...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        Map<String, String> map = new HashMap<>();
        map.put("result", result + "");
        return ResponseEntity.ok(map);
    }





    @GetMapping
    public ResponseEntity<Map<String, Object>> selectList(
            @RequestParam(defaultValue = "1") int currentPage,
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchValue
    ) {

        int listCount = noticeService.selectCount(searchType, searchValue);

        PageVo pvo = new PageVo(listCount, currentPage, pageLimit, boardLimit);

        List<NoticeVo> voList = noticeService.selectList(pvo, searchType, searchValue);

        Map<String, Object> map = new HashMap<>();
        map.put("pvo", pvo);
        map.put("voList", voList);

        return ResponseEntity.ok(map);
    }



    @GetMapping("/{no}")
    public ResponseEntity<Map<String, Object>> selectOne(@PathVariable String no, HttpSession session) {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if (loginMemberVo == null) {
            throw new IllegalArgumentException("로그인먼저");
        }

        NoticeVo vo = noticeService.selectOne(no);
        Map<String, Object> map = new HashMap<>();
        map.put("vo", vo);
        map.put("loginEmpNo", loginMemberVo.getEmpNo());
        return ResponseEntity.ok(map);
    }


    @PutMapping
    public ResponseEntity<Map<String, Object>> updateByNo( @RequestParam(required = false) MultipartFile file,
                                                           @RequestParam(required = false) String changeName,
                                                           NoticeVo vo,
                                                           HttpSession session) throws IOException
    {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null){
            throw new IllegalStateException("login required");
        }

        vo.setWriterNo(loginMemberVo.getEmpNo());
        int result = noticeService.updateByNo(vo,file,changeName);
        if (result != 1) {
            String errMsg = "[B-410] update err ...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }

    @DeleteMapping
    public ResponseEntity<Map<String, Object>> deleteByNo(@RequestBody NoticeVo vo
            , HttpSession session
    )
    {
        MemberVo loginMemberVo = (MemberVo) session.getAttribute("loginMemberVo");
        if(loginMemberVo == null){
            throw new IllegalStateException("login required");
        }
        vo.setWriterNo(loginMemberVo.getEmpNo());
        int result = noticeService.deleteByNo(vo);

        if (result != 1) {
            String errMsg = "[B-510] delete err ...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        return ResponseEntity.ok(map);
    }







}
