<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>Coffee Prince - 공지사항</title>
        <link rel="stylesheet" href="/css/common/reset.css">
        <link rel="stylesheet" href="/css/common/layout.css">
        <link rel="stylesheet" href="/css/common/sidebar.css">
        <link rel="stylesheet" href="/css/user/notice/list.css">
        <script defer src="/js/user/notice/list.js"></script>
    </head>

    <body>
        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>
                <div class="page-shell">
                    <div class="home-container">
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
                        <div class="home-hero-bg"></div>
                        <div class="home-content">
                            <div class="notice-wrap">
                                <h2 class="notice-title">공지사항</h2>

                                <div class="table-container">
                                    <table class="notice-table">
                                        <thead>
                                            <tr>
                                                <th width="8%">NO</th>
                                                <th width="12%">카테고리</th>
                                                <th width="45%">제목</th>
                                                <th width="15%">작성자</th>
                                                <th width="12%">작성일</th>
                                                <th width="8%">조회수</th>
                                            </tr>
                                        </thead>
                                        <tbody id="notice-tbody">
                                        </tbody>
                                    </table>
                                </div>

                                <div id="page-area" class="pagination"></div>

                                <div class="bottom-menu">
                                    <div class="search-box">
                                        <select id="search-type" class="search-select">
                                            <option value="title">제목</option>
                                            <option value="writer">작성자</option>
                                        </select>

                                        <input type="text" id="search-input" class="search-input" placeholder="검색어를 입력하세요">

                                        <button type="button" class="btn-search" onclick="loadNoticeList(1)">검색</button>
                                    </div>
                                    <button type="button" class="write-btn"
                                        onclick="location.href='/notice/insert'">작성하기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </body>

    </html>