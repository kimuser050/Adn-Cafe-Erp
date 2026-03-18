<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>공지사항 상세</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/user/notice/detail.css">

    <script defer src="/js/user/notice/detail.js"></script>
</head>

<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

    <div class="page-shell">
        <div class="home-container">

            <div class="home-hero-bg"></div>

            <div class="home-content">

                <div class="notice-wrap">

                    <h2 class="page-title">공지사항</h2>

                    <!-- 상단 메타 정보 -->
                    <div class="detail-info-grid">
                        <div class="info-item no">No. <span id="notice-no"></span></div>
                        <div class="info-item category" id="notice-category"></div>

                        <!-- 제목 보기 모드 -->
                        <div class="info-item title" id="notice-title"></div>
                        <!-- 제목 수정 모드 -->
                        <input type="text" id="edit-title" class="edit-input" style="display:none;" placeholder="제목">

                        <div class="info-item writer">작성자 : <span id="notice-writer"></span></div>
                        <div class="info-item hit">조회 : <span id="notice-hit"></span></div>
                        <div class="info-item date" id="notice-date"></div>
                    </div>

                    <!-- 본문 영역 -->
                                        <div class="detail-main-box">
                                            <div class="content-label">내용</div>

                                            <!-- 본문 보기 모드 -->
                                            <div class="content-area" id="notice-content"></div>
                                            <!-- 본문 수정 모드 -->
                                            <textarea id="edit-content" class="edit-textarea" style="display:none;"></textarea>

                                            <!-- 첨부파일 영역 -->
                                            <div class="file-section">
                                                <span class="file-label">첨부파일</span>
                                                <div id="file-list" class="file-names"></div>
                                                <input type="file" id="edit-file" style="display:none;">
                                            </div>
                                        </div>

                                        <!-- 댓글 영역 -->
                                        <div class="comment-section">
                                            <div class="comment-display" id="comment-area">
                                                <div class="comment-placeholder">댓글은 여기에 달립니다.</div>
                                            </div>
                                            <div class="comment-input-group">
                                                <input type="text" id="comment-input" placeholder="댓글을 입력하세요.">
                                                <button type="button" class="comment-submit">댓글 작성</button>
                                            </div>
                                        </div>

                                        <!-- 하단 버튼 -->
                                        <div class="detail-actions">
                                            <button type="button" class="back-btn" onclick="history.back()">목록으로</button>

                                            <div class="owner-actions" id="owner-actions" style="display:none;">
                                                <div id="view-btns" style="display:flex; gap:10px;">
                                                    <button type="button" class="edit-btn" id="edit-btn">수정</button>
                                                    <button type="button" class="delete-btn" id="delete-btn">삭제</button>
                                                </div>
                                                <div id="edit-btns" style="display:none; gap:10px;">
                                                    <button type="button" class="save-btn" id="save-btn">저장</button>
                                                    <button type="button" class="cancel-btn" id="cancel-btn">취소</button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    </body>
                    </html>