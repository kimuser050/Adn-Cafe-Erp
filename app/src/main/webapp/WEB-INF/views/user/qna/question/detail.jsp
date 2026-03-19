<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Coffee Prince - 문의상세</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/user/qna/question/detail.css">



    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        // 세션에서 로그인한 사용자의 사번을 JS 변수로 저장 (삭제 권한 체크용)
        const loginMemberNo = "${sessionScope.loginMemberVo.empNo}";
    </script>
    <script defer src="/js/user/qna/question/detail.js"></script>
</head>

<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

        <div class="page-shell">
            <div class="qna-wrap">
                <div class="qna-title-text">문의게시판</div>

                <div class="qna-form-box">
                    <div class="detail-header-row">
                        <div class="info-item">
                            <span class="label">NO</span>
                            <span id="inquiryNo" class="value"></span>
                        </div>
                        <div class="info-item">
                            <span class="label">카테고리</span>
                            <span id="typeName" class="value"></span>
                        </div>
                        <div class="info-item flex-fill">
                            <span class="label">제목</span>
                            <span id="title" class="value-title"></span>
                        </div>
                        <div class="info-item">
                            <span class="label">작성자</span>
                            <span id="writerName" class="value"></span>
                        </div>
                    </div>

                    <div class="content-display-group">
                        <label>내용</label>
                        <div id="content" class="round-display-area"></div>
                    </div>

                    <div id="answer-section" style="display: none; margin-top: 40px;">
                        <div class="qna-title-text" style="font-size: 16px; margin-bottom: 15px;">답변내용</div>
                        <div id="answerContent" class="round-display-area answer-style"></div>
                    </div>

                    <div class="btn-area">
                        <div class="file-list-part">
                            <span class="label">첨부파일</span>
                            <div id="file-name-display" class="file-name-display"></div>
                        </div>
                        <div class="action-btns">
                            <button type="button" class="btn-custom" onclick="location.href='/qna/question/list'">목록으로</button>
                            <button type="button" id="btn-delete" class="btn-custom btn-danger" style="display:none;" onclick="deleteQuestion()">삭제하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>