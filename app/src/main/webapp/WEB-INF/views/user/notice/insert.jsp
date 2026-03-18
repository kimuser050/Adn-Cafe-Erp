<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>헬로월드</title>
        <link rel="stylesheet" href="/css/common/reset.css">
        <link rel="stylesheet" href="/css/common/layout.css">
        <link rel="stylesheet" href="/css/common/sidebar.css">
        <link rel="stylesheet" href="/css/common/component.css">
        <link rel="stylesheet" href="/css/user/notice/insert.css">

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

                               <h2 class="notice-title">공지사항</h2>

                               <form id="noticeForm" class="notice-form">

                                   <div class="row">
                                       <label>제목</label>
                                       <input type="text" name="title" placeholder="제목을 입력하세요">

                                       <label>카테고리</label>
                                       <select name="category">
                                           <option value="공통">공통</option>
                                           <option value="재무">재무</option>
                                           <option value="인사">인사</option>
                                           <option value="품질">품질</option>
                                       </select>
                                   </div>

                                   <div class="content-box">
                                       <label>내용</label>
                                       <textarea name="content" placeholder="내용을 입력하세요"></textarea>
                                   </div>

                                   <div class="bottom-area">
                                       <input type="file" name="file" class="file-btn">
                                       <button type="button" class="submit-btn" onclick="insertNotice()">작성하기</button>
                                   </div>

                               </form>

                           </div>

                    </div>
                </div>
        </div>

    </body>

    </html>