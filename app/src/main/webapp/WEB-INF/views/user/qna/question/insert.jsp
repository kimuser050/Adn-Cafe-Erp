<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Coffee Prince - 문의작성</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">

    <link rel="stylesheet" href="/css/user/qna/question/insert.css">

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer src="/js/user/qna/question/insert.js"></script>
</head>

<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

        <div class="page-shell">
            <div class="qna-wrap">
            <c:if test="${not empty sessionScope.loginMemberVo}">
                            <div class="top-user-bar">

                                <a href="/member/mypage">
                                    <img src="http://192.168.20.2:5500/member/${loginMemberVo.profileChangeName}"
                                         class="top-profile-img">
                                </a>

                                <span class="top-user-name">${loginMemberVo.empName}</span>

                                <button onclick="location.href='/member/logout'">로그아웃</button>
                            </div>
                        </c:if>
                <div class="qna-title-text">문의게시판</div>

                <div class="qna-form-box">
                    <div class="form-row">
                        <div class="form-group title-group">
                            <label>제목</label>
                            <input type="text" id="title" placeholder="제목을 입력하세요">
                        </div>

                        <div class="form-group type-group">
                            <label>카테고리</label>
                            <select name="categoryCode" id="typeCode">
                                <c:choose>
                                    <c:when test="${sessionScope.loginMemberVo.deptCode eq '310101'}">
                                        <option value="3" selected>인사</option>
                                    </c:when>
                                    <c:when test="${sessionScope.loginMemberVo.deptCode eq '310102'}">
                                        <option value="2" selected>재무</option>
                                    </c:when>
                                    <c:when test="${sessionScope.loginMemberVo.deptCode eq '310103'}">
                                        <option value="4" selected>품질</option>
                                    </c:when>
                                    <c:otherwise>
                                        <option value="5">공통</option>
                                    </c:otherwise>
                                </c:choose>
                            </select>
                        </div>

                        <div class="secret-group">
                            <label>
                                <input type="checkbox" id="secretYn" name="secretYn"> 비밀글 설정
                            </label>
                        </div>
                    </div>

                    <div class="content-group">
                        <label>내용</label>
                        <textarea id="content" placeholder="문의하실 내용을 입력해주세요."></textarea>
                    </div>

                    <div id="file-name-display" style="margin-bottom: 10px; font-size: 14px; color: #8c7361;"></div>

                    <div class="btn-area">
                        <input type="file" id="file-input" style="display: none;" multiple>
                        <button type="button" class="btn-custom" onclick="document.querySelector('#file-input').click()">파일첨부</button>
                        <button type="button" class="btn-custom" onclick="submitQuestion()">등록하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>