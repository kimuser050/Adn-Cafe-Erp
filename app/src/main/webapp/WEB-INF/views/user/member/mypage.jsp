<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>커피프린스 - 마이페이지</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/user/member/join.css">

    <script defer src="/js/user/member/mypage.js"></script>
</head>

<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

        <div class="page-shell">
            <div class="home-hero-bg"></div>

            <div class="join-container">
                <div class="join-card">
                    <h1 class="join-title">마이페이지</h1>

                    <form id="edit-form" class="join-grid">
                        <div class="form-group">
                            <label>사번</label>
                            <input type="text" name="empNo" value="${loginMemberVo.empNo}" class="form-input" readonly>
                        </div>
                        <div class="form-group">
                            <label>사원명</label>
                            <input type="text" name="empName" value="${loginMemberVo.empName}" class="form-input">
                        </div>

                        <div class="form-group">
                            <label>새 비밀번호</label>
                            <input type="password" name="empPw" id="empPw" placeholder="변경할 비밀번호 입력" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>비밀번호 확인</label>
                            <input type="password" name="empPw2" id="empPw2" placeholder="비밀번호 재입력" class="form-input">
                            <div id="pw-match-msg" style="font-size: 12px; margin-top: 5px; min-height: 18px;"></div>
                        </div>

                        <div class="form-group">
                            <label>전화번호</label>
                            <input type="text" name="empPhone" value="${loginMemberVo.empPhone}" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>이메일주소</label>
                            <input type="text" name="empEmail" value="${loginMemberVo.empEmail}" class="form-input">
                        </div>

                        <div class="form-group full-width">
                            <label>주소</label>
                            <input type="text" name="empAddress" value="${loginMemberVo.empAddress}" class="form-input">
                        </div>

                        <div class="form-group full-width profile-edit-group">
                            <label>프로필사진</label>
                            <div class="profile-preview-container">
                                <img id="profile-preview"
                                    src="http://192.168.20.2:5500/member/${loginMemberVo.profileChangeName}"
                                     alt="현재 프로필"
                                     class="profile-img-large">
                                <div class="file-upload-wrapper">
                                    <input type="file" name="profile" id="profile-file" onchange="previewImage(this)">
                                    <label for="profile-file" class="btn-file">파일 선택</label>
                                    <span id="file-name">선택된 파일 없음</span>
                                </div>
                                <p class="helper-text">* 새로운 파일을 선택하면 프로필 사진이 교체됩니다.</p>
                            </div>
                        </div>

                        <div class="join-btn-area full-width">
                            <button type="button" class="btn-submit edit-btn" onclick="edit();">정보 수정 완료</button>
                            <button type="button" class="btn-submit quit-btn" onclick="quit();">회원 탈퇴</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>