<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>발주관리 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/stock/item/main.css">
    <link rel="stylesheet" href="/css/stock/item/order.css">
    <script defer src="/js/stock/order.js"></script>
</head>
<body>
    <input type="hidden" id="loginUserEmpName" value="${userEmpName}">
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/orderSidebar.jsp" %>

        <main class="page-shell">
            <section class="page-content">
                <div class="tab-wrapper">
                    <button type="button" class="tab-btn active">발주 신청</button>
                    <button type="button" class="tab-btn" onclick="location.href='/stock/history'">발주 상태</button>
                </div>

                <div class="content-container">
                    <div class="search-section">
                        <div class="search-inner">
                            <label for="orderKeyword">상품 명</label>
                            <input type="text" id="orderKeyword" placeholder="검색어를 입력하세요">
                            <button class="btn-brown-search" onclick="loadOrderItems(1)">검색</button>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <table class="item-table">
                            <thead>
                                <tr>
                                    <th style="width: 60px;"><input type="checkbox" id="checkAll"></th>
                                    <th style="width: 80px;">번호</th>
                                    <th>이름</th>
                                    <th>매장이름</th>
                                    <th style="width: 150px;">수량</th>
                                    <th>요청일</th>
                                </tr>
                            </thead>
                            <tbody id="orderBody">
                                </tbody>
                        </table>
                    </div>

                    <div id="pagination" class="pagination-wrapper"></div>
                </div>

                <div class="order-action-bar">
                    <button type="button" class="btn-final-order" onclick="submitBulkOrder()">주 문</button>
                </div>
            </section>
        </main>
    </div>
</body>
</html>
</html>