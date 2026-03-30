<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>발주관리 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
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
                    <button type="button" class="tab-btn active" onclick="location.href='/stock/order'">발주 신청</button>
                    <button type="button" class="tab-btn" onclick="location.href='/stock/product/history'">발주 상태</button>
                </div>

                <div class="content-container panel" style="padding: 30px; min-height: 700px; border-top-left-radius: 0;">
                    
                    <div class="search-section" style="margin-bottom: 25px; display: flex; align-items: center; gap: 15px;">
                        <label style="font-weight: 700; color: var(--color-dark); font-size: 14px;">상품 명</label>
                        <div class="search-box">
                            <input type="text" id="orderKeyword" class="search-box-input" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn" onclick="loadOrderList(1)">⌕</button>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <table class="item-table">
                            <thead>
                                <tr>
                                    <th style="width: 50px;"><input type="checkbox" id="checkAll"></th>
                                    <th style="width: 70px;">번호</th>
                                    <th style="width: auto;">이름</th>
                                    <th style="width: 120px;">매장이름</th>
                                    <th style="width: 140px;">수량</th>
                                    <th style="width: 180px;">요청일</th>
                                </tr>
                            </thead>
                            <tbody id="orderBody"></tbody>
                        </table>
                    </div>

                    <div id="pagination" class="pagination-wrapper" style="margin-top: 30px; text-align: center;"></div>
                </div>

                <div class="order-action-bar" style="margin-top: 20px; display: flex; justify-content: flex-end;">
                    <button type="button" class="btn btn-lg btn-dark" onclick="submitBulkOrder()" style="padding: 0 60px;">주 문</button>
                </div>
            </section>
        </main>
    </div>
</body>
</html>