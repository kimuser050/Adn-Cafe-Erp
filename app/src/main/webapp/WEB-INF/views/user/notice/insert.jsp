<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%-- 1. JSTL 태그 라이브러리 선언 (필수: 이 선언이 없으면 카테고리가 중복 노출됩니다) --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Coffee Prince - 공지사항 작성</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/user/notice/insert.css">

    <%-- defer 속성으로 DOM 로드 후 실행 보장 --%>
    <script defer src="/js/user/notice/insert.js"></script>
</head>

<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

        <div class="page-shell">
            <div class="home-container">
                <div class="home-hero-bg"></div>
                <div class="home-content">
                    <div class="notice-wrap">
                        <h2 class="notice-title">공지사항 작성</h2>

                        <form id="noticeForm" class="notice-form">
                            <div class="row">
                                <label for="title">제목</label>
                                <%-- name="title" 확인 --%>
                                <input type="text" id="title" name="title" placeholder="제목을 입력하세요">

                                <label for="category">카테고리</label>
                                <select name="category" id="category">
                                    <c:choose>
                                        <%-- 경영혁신실(310100)은 마스터 권한으로 모든 카테고리 노출 --%>
                                        <c:when test="${sessionScope.loginMemberVo.deptCode eq '310100'}">
                                            <option value="공통">공통</option>
                                            <option value="재무">재무</option>
                                            <option value="인사">인사</option>
                                            <option value="품질">품질</option>
                                        </c:when>

                                        <%-- 일반 부서는 본인 부서 카테고리만 노출 --%>
                                        <c:when test="${sessionScope.loginMemberVo.deptCode eq '310101'}">
                                            <option value="인사">인사</option>
                                        </c:when>
                                        <c:when test="${sessionScope.loginMemberVo.deptCode eq '310102'}">
                                            <option value="재무">재무</option>
                                        </c:when>
                                        <c:when test="${sessionScope.loginMemberVo.deptCode eq '310103'}">
                                            <option value="품질">품질</option>
                                        </c:when>

                                        <%-- 그 외 부서(매장 등)는 공통 카테고리만 --%>
                                        <c:otherwise>
                                            <option value="공통">공통</option>
                                        </c:otherwise>
                                    </c:choose>
                                </select>
                            </div>

                            <div class="content-box">
                                <label for="content">내용</label>
                                <%-- name="content" 확인 --%>
                                <textarea id="content" name="content" placeholder="내용을 입력하세요"></textarea>
                            </div>

                            <div class="bottom-area">
                                <%-- 1. 파일 이름이 출력될 영역 (id 확인) --%>
                                <div id="file-name-display" style="margin-bottom:10px; font-size:14px; color:#8c7361; font-weight: bold;"></div>

                                <%-- 2. 실제 파일 컨트롤 (onchange 함수 연결 필수) --%>
                                <input type="file" id="notice-file" name="file" class="file-btn" style="display:none;" onchange="updateFileName(this)">

                                <%-- 3. 커스텀 버튼 --%>
                                <button type="button" class="btn-custom" onclick="document.querySelector('#notice-file').click()">파일선택</button>
                                <button type="button" class="submit-btn" onclick="insertNotice()">작성하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>