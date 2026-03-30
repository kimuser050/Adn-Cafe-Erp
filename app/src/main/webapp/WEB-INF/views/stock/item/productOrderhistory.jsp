<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>발주 상태 관리 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/stock/item/orderhistory2.css">

    <script>
        var loginEmpNo = "${loginMember.empNo}" || "";
        var loginStoreCode = "${loginMember.deptCode}" || "";
    </script>
    <script defer src="/js/stock/orderhistory.js"></script>
</head>

<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/productOrderhistorySidebar.jsp" %>

        <main class="page-shell">
            <section class="page-content">
                <div class="tab-wrapper">
                    <button type="button" class="tab-btn" onclick="location.href='/stock/order'">발주 신청</button>
                    <button type="button" class="tab-btn active" onclick="location.href='/stock/product/history'">발주 상태</button>
                </div>

                <div class="content-container panel">
                    <div class="search-section">
                        <div class="search-box">
                            <input type="text" id="orderKeyword" class="search-box-input" placeholder="상품명을 입력하세요">
                            <button type="button" class="search-btn" onclick="loadHistoryList(1)">⌕</button>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <table class="item-table">
                            <thead>
                                <tr>
                                    <th style="width: 80px;">번호</th>
                                    <th style="width: auto;">이름</th>
                                    <th style="width: 150px;">매장</th>
                                    <th style="width: 100px;">수량</th>
                                    <th style="width: 120px;">상태</th>
                                    <th style="width: 180px;">요청일</th>
                                </tr>
                            </thead>
                            <tbody id="orderBody"></tbody>
                        </table>
                    </div>

                    <div id="pagination" class="pagination-wrapper"></div>
                </div>
            </section>
        </main>
    </div>
</body>
</html>