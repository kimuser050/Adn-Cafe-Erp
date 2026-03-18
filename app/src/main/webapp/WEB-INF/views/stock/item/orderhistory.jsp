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
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/orderSidebar.jsp" %>
        <main class="page-shell">
            <section class="page-content">
 <div class="tab-wrapper">
    <a href="javascript:void(0)" class="tab-btn active" onclick="switchTab('apply')">발주 신청</a>
    <a href="javascript:void(0)" class="tab-btn" onclick="switchTab('history')">발주 상태</a>
</div>

<div id="applySection" class="content-container">
    <div class="search-section">
        <div class="search-inner">
            <label for="productName">상품 명</label>
            <input type="text" id="productName" placeholder="검색어를 입력하세요">
            <button class="btn-brown-search" onclick="loadOrderList(1)">검색</button>
        </div>
        <div class="action-inner">
            <button type="button" class="btn-action-brown" style="background-color: #4a382e;" onclick="submitBulkOrder()">선택 상품 주문</button>
        </div>
    </div>

    <div class="table-wrapper">
        <table class="item-table">
            <thead>
                <tr>
                    <th><input type="checkbox" id="checkAll" onclick="toggleAll(this)"></th>
                    <th>번호</th>
                    <th>이름</th>
                    <th>단가</th>
                    <th>수량 조절</th>
                    <th>위치</th>
                </tr>
            </thead>
            <tbody id="itemList"></tbody>
        </table>
    </div>
    <div id="paginationArea" class="pagination-wrapper"></div>
</div>

<div id="historySection" class="content-container" style="display: none;">
    <div class="search-section">
        <div class="search-inner">
            <label for="historyKeyword">상품 명</label>
            <input type="text" id="historyKeyword" placeholder="검색어를 입력하세요">
            <button class="btn-brown-search" onclick="loadOrderHistory(1)">검색</button>
        </div>
    </div>

    <div class="table-wrapper">
        <table class="item-table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>이름</th>
                    <th>매장</th>
                    <th>수량</th>
                    <th>상태</th>
                    <th>요청일</th>
                </tr>
            </thead>
            <tbody id="historyList"></tbody>
        </table>
    </div>
    <div id="historyPaginationArea" class="pagination-wrapper"></div>
</div>
</body>
</html>