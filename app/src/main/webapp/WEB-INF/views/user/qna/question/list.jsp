<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Coffee Prince - 문의게시판</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/user/qna/question/list.css">

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script defer src="/js/user/qna/question/list.js"></script>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

        <div class="page-shell">
            <div class="qna-list-wrap">
                <div class="qna-header-text">문의게시판</div>

                <div class="qna-table-container">
                    <table class="qna-table">
                        <thead>
                            <tr>
                                <th style="width: 10%;">NO</th>
                                <th style="width: 15%;">카테고리</th>
                                <th style="width: 55%;">제목</th>
                                <th style="width: 20%;">작성자</th>
                            </tr>
                        </thead>
                        <tbody id="qna-list-body">
                            </tbody>
                    </table>

                    <div id="pagination-area" class="pagination">
                    </div>

                    <div class="list-footer">
                        <div class="search-box">
                            <select id="searchType" class="search-select">
                                <option value="all">전체</option>
                                <option value="title">제목</option>
                                <option value="writer">작성자</option>
                            </select>
                            <input type="text" id="searchKeyword" class="search-input" placeholder="검색어를 입력하세요">
                            <button type="button" class="btn-search" onclick="loadList(1)">검색</button>
                        </div>
                        <button type="button" class="btn-write" onclick="checkLogin()">작성하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>