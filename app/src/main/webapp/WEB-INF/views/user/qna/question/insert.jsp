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
                    <form id="insertForm" enctype="multipart/form-data">
                        <div class="form-row">
                            <div class="form-group title-group">
                                <label for="title">제목</label>
                                <input type="text" id="title" name="title" placeholder="제목을 입력하세요">
                            </div>

                            <div class="form-group secret-group">
                                <input type="checkbox" id="secretYn" name="secretYn" value="Y">
                                <label for="secretYn">비밀글 설정</label>
                            </div>

                            <div class="form-group type-group">
                                <label for="typeCode">카테고리</label>
                                <select id="typeCode" name="typeCode">
                                    <option value="1">시스템</option>
                                    <option value="2">재무</option>
                                    <option value="3">인사</option>
                                    <option value="4">품질</option>
                                    <option value="5">공통</option>
                                </select>
                            </div>
                        </div>

                        <div class="content-group">
                            <label for="content">내용</label>
                            <textarea id="content" name="content" placeholder="문의하실 내용을 입력해주세요."></textarea>
                        </div>

                        <div class="btn-area">
                            <div class="file-upload-part">
                                <button type="button" class="btn-custom" onclick="$('#file-input').click();">파일첨부</button>
                                <input type="file" id="file-input" name="file" multiple>
                                <span id="file-name-display" class="file-name-display"></span>
                            </div>
                            <button type="button" class="btn-custom" onclick="submitQuestion();">등록하기</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</body>
</html>