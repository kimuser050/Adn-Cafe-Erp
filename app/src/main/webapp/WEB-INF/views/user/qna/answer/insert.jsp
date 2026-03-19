<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Coffee Prince - 답변작성</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/user/qna/answer/insert.css">

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer src="/js/user/qna/answer/insert.js"></script>
</head>

<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

        <div class="page-shell">
            <div class="qna-wrap">
                <div class="qna-title-text">답변게시판</div>

                <div class="qna-form-box">
                    <div class="question-summary-row">
                        <span id="info-no" class="info-val"></span>
                        <span id="info-category" class="info-val"></span>
                        <span id="info-title" class="info-val title-flex"></span>
                        <span id="info-writer" class="info-val"></span>
                    </div>

                    <form id="answerForm" enctype="multipart/form-data">
                        <input type="hidden" id="inquiryNo" name="inquiryNo">

                        <div class="content-group">
                            <label for="response">답변내용</label>
                            <div class="textarea-container">
                                <textarea id="response" name="response" placeholder="답변 내용을 입력해주세요."></textarea>
                                <div class="file-upload-row">
                                    <button type="button" class="btn-file" onclick="$('#file-input').click();">파일첨부</button>
                                    <input type="file" id="file-input" name="file" multiple style="display:none;">
                                    <span id="file-name-display" class="file-name-display"></span>
                                </div>
                            </div>
                        </div>

                        <div class="btn-area">
                            <button type="button" class="btn-submit" onclick="submitAnswer();">답변작성하기</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>