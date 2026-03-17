<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>헬로월드 - 회원가입</title>
        <link rel="stylesheet" href="/css/common/reset.css">
        <link rel="stylesheet" href="/css/common/layout.css">
        <link rel="stylesheet" href="/css/common/sidebar.css">
        <link rel="stylesheet" href="/css/common/component.css">
        <link rel="stylesheet" href="/css/user/member/join.css">

        <script defer src="/js/user/member/join.js"></script>
    </head>

    <body>
        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <div class="page-shell">
                    <div class="home-hero-bg"></div>

                    <div class="join-container">
                        <div class="join-card">
                            <h1 class="join-title">회원가입</h1>

                            <form id="join-form" class="join-grid">
                                <div class="form-group">
                                    <label>사번</label>
                                    <input type="text" name="empNo" placeholder="아이디 입력" class="form-input">
                                </div>


                                <div class="form-group">
                                    <label>비밀번호</label>
                                    <input type="password" name="empPw" placeholder="비밀번호" class="form-input">
                                </div>

                                <div class="form-group">
                                    <label>사원명</label>
                                    <input type="text" name="empName" placeholder="이름" class="form-input">
                                </div>

                                <div class="form-group">
                                    <label>전화번호</label>
                                    <input type="text" name="empPhone" placeholder="전화번호" class="form-input">
                                </div>

                                <div class="form-group resd-group-wrap">
                                    <label>주민번호</label>
                                    <div class="resd-input-area">
                                        <input type="text" name="resdNo1" class="form-input resd-no" maxlength="6">
                                        <span class="hyphen">-</span>
                                        <input type="password" name="resdNo2" class="form-input resd-no" maxlength="7">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label>이메일주소</label>
                                    <input type="text" name="empEmail" placeholder="이메일" class="form-input">
                                </div>

                                <div class="form-group">
                                    <label>부서코드</label>
                                    <input type="text" name="deptCode" placeholder="부서 코드" class="form-input">
                                </div>




                                <div class="form-group">
                                    <label>직급코드</label>
                                    <input type="text" name="posCode" placeholder="직급 코드" class="form-input">
                                </div>


                                <div class="form-group full-width">
                                    <label>주소</label>
                                    <input type="text" name="empAddress" placeholder="주소" class="form-input">
                                </div>

                                <div class="form-group">
                                    <label>프로필사진</label>
                                    <input type="file" name="profile" class="form-file">
                                </div>

                                <div class="join-btn-area full-width">
                                    <button type="button" class="btn-submit" onclick="join();">회원가입 완료</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </div>


    </body>

    </html>