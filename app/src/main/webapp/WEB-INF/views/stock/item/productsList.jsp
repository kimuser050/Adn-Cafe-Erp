<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>제품 조회 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/stock/item/products.css">
    <script defer src="/js/stock/products.js"></script>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/productsSidebar2.jsp" %>

<main class="main-content">
            <section class="content-container">
                <div class="header-box">
                    <h2>제품 조회</h2>
                </div>

                <div class="search-bar">
                    <label>상품 명</label>
                    <input type="text" id="searchKeyword" placeholder="검색어를 입력하세요">
                    <button type="button" class="btn-search" onclick="loadProducts(1)">검색</button>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제품명</th>
                            <th>단가</th>
                            <th>사용여부</th>
                            <th>등록일</th>
                        </tr>
                    </thead>
                    <tbody id="product-list-body"></tbody>
                </table>

                <div id="pagination" class="pagination-container"></div>

                
            </section>
        </main>
    </div>

   
        </div>
    </div>
</body>
</html>