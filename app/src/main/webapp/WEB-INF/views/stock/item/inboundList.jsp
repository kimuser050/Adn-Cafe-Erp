<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>입고 내역 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/stock/item/main.css">
    <script defer src="/js/stock/inbound.js"></script>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/itemSidebar.jsp" %>

        <main class="page-shell">
            <section class="page-content">
                <div class="tab-wrapper">
                    <a href="/stock/item" class="tab-btn">본사 품목</a>
                    <a href="/stock/inbound" class="tab-btn active">입고 내역</a>
                </div>

                <div class="content-container">
                    <div class="search-section">
                        <div class="search-inner">
                            <label>상품 명</label>
                            <input type="text" id="incomingSearch" placeholder="입고된 품목명을 입력하세요">
                            <button class="btn-brown-search">검색</button>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <table class="item-table">
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>이름</th>
                                    <th>단가</th>
                                    <th >수량</th>
                                    <th >총금액</th>
                                    <th >입고일</th>
                                    <th >품목코드</th>
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody id="incomingList">
                                </tbody>
                        </table>
                    </div>

                    <div id="paginationArea" class="pagination-wrapper"></div>
                </div>
            </section>
        </main>
    </div>
</body>
</html>