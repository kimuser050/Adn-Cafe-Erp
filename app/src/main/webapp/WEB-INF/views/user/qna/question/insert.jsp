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
                <div class="qna-title-text">문의게시판</div>

                <div class="qna-form-box">
                    <div class="form-row">
                        <div class="form-group title-group">
                            <label>제목</label>
                            <input type="text" placeholder="제목을 입력하세요">
                        </div>

                        <div class="form-group type-group">
                            <label>카테고리</label>
                            <select name="categoryCode" id="categorySelect">
                                <c:choose>
                                    <c:when test="${sessionScope.loginMemberVo.deptCode eq '310101'}">
                                        <option value="310101" selected>인사</option>
                                    </c:when>
                                    <c:when test="${sessionScope.loginMemberVo.deptCode eq '310102'}">
                                        <option value="310102" selected>재무</option>
                                    </c:when>
                                    <c:when test="${sessionScope.loginMemberVo.deptCode eq '310103'}">
                                        <option value="310103" selected>품질</option>
                                    </c:when>
                                    <c:otherwise>
                                        <option value="common">공통</option>
                                    </c:otherwise>
                                </c:choose>
                            </select>
                        </div>

                        <div class="secret-group">
                            <label>
                                <input type="checkbox" name="secretYn"> 비밀글 설정
                            </label>
                        </div>
                    </div>

                    <div class="content-group">
                        <label>내용</label>
                        <textarea placeholder="문의하실 내용을 입력해주세요."></textarea>
                    </div>

                    <div class="btn-area">
                        <button type="button" class="btn-custom">파일첨부</button>
                        <button type="button" class="btn-custom">등록하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>