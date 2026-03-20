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
        // 세션에서 로그인한 사용자의 사번을 JS 변수로 저장 (권한 체크용)
        const loginMemberNo = "${sessionScope.loginMemberVo.empNo}";
    </script>
    <script defer src="/js/user/qna/question/detail.js"></script>
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

                        <div id="question-file-area" style="margin-top: 15px; padding: 15px; border-top: 1px dashed #dcd1c5;">
                            <span class="label" style="font-size: 14px; color: #888; font-weight: bold;">첨부파일</span>
                            <div id="file-name-display" style="margin-top: 10px;"></div>
                        </div>
                    </div>

                    <div id="answer-section" style="display: none; margin-top: 50px; padding-top: 30px; border-top: 2px solid #f0f0f0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <div class="qna-title-text" style="font-size: 18px; margin-bottom: 0; color: #5a4a3c;">Manager Answer</div>
                            <div id="answer-admin-btns" style="display: none;">
                                <button type="button" id="btn-answer-edit" class="btn-custom" style="padding: 5px 15px; font-size: 12px; background-color: #7a6a5e;">수정</button>
                                <button type="button" id="btn-answer-delete" class="btn-custom btn-danger" style="padding: 5px 15px; font-size: 12px;">삭제</button>
                            </div>
                        </div>

                        <div id="answerContent" class="round-display-area answer-style"></div>

                        <div id="answer-edit-area" style="display: none;">
                            <textarea id="answer-edit-input" class="round-display-area answer-style" style="min-height: 200px; width: 100%; resize: vertical;"></textarea>
                            <div style="text-align: right; margin-top: 10px;">
                                <button type="button" id="btn-answer-update" class="btn-custom" style="background-color: #5a4a3c;">저장</button>
                                <button type="button" id="btn-answer-cancel" class="btn-custom" style="background-color: #bbb;">취소</button>
                            </div>
                        </div>

                        <div id="answer-file-area" style="margin-top: 15px; padding-left: 10px;">
                            <span class="label" style="font-size: 14px; color: #888; font-weight: bold;">답변 첨부파일</span>
                            <div id="answer-file-display" style="margin-top: 10px;"></div>
                        </div>

                        <div id="comment-section" style="margin-top: 40px; background-color: #fafafa; padding: 30px; border-radius: 20px;">
                            <div class="qna-title-text" style="font-size: 16px; margin-bottom: 15px;">댓글</div>

                            <div class="comment-write-box" style="display: flex; gap: 10px; margin-bottom: 25px;">
                                <textarea id="comment-input" placeholder="답변에 대한 의견을 남겨주세요."
                                          style="flex: 1; height: 70px; padding: 15px; border: 1px solid #dcd1c5; border-radius: 10px; resize: none; font-size: 14px;"></textarea>
                                <button type="button" id="btn-comment-submit" class="btn-custom"
                                        style="width: 100px; background-color: #5a4a3c; border-radius: 10px;">등록</button>
                            </div>

                            <div id="comment-list-area">
                                </div>
                        </div>
                    </div>

                    <div class="btn-area" style="margin-top: 40px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #f0f0f0; padding-top: 20px;">
                        <button type="button" id="btn-answer" class="btn-custom btn-success" style="background-color: #7a6a5e; display: none;">답변하기</button>
                        <button type="button" class="btn-custom" style="background-color: #8c7361;" onclick="location.href='/qna/question/list'">목록으로</button>
                        <button type="button" id="btn-delete" class="btn-custom btn-danger" style="display:none;" onclick="deleteQuestion()">삭제하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>