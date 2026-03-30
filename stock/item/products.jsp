<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>제품등록 및 조회 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/stock/item/products.css">
    <script defer src="/js/stock/products.js"></script>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/productsSidebar.jsp" %>

<main class="main-content">
            <section class="content-container">
                <div class="header-box">
                    <h2>제품등록 및 조회</h2>
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

                <div class="action-buttons">
                    <button class="btn-register" onclick="openInsertModal()">등록 하기</button>
                </div>
            </section>
        </main>
    </div>

    <div id="productModal" class="modal-overlay">
        <div class="modal-window">
            <div class="modal-header">
                <h3 id="modalTitle">제품 정보</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="m-productsNo">
                <div class="input-form">
                    <div class="input-group">
                        <label>제품명</label>
                        <input type="text" id="m-productsName">
                    </div>
                    <div class="input-group">
                        <label>금액</label>
                        <input type="number" id="m-salePrice">
                    </div>
                   <div class="input-group">
                    <label>사용여부</label>
                    <div class="status-btn-group">
                        <button type="button" class="btn-status" data-value="Y" onclick="selectStatus('Y')">Y</button>
                        <button type="button" class="btn-status" data-value="N" onclick="selectStatus('N')">N</button>
                        <input type="hidden" id="m-useYn" value="Y"> </div>
                </div>
                </div>
                <div class="modal-footer">
    <button type="button" class="btn-save" id="btn-insert" onclick="submitProduct('POST')">등록하기</button>
    
    <button type="button" class="btn-edit" id="btn-update" onclick="submitProduct('PUT')">수정하기</button>
    
    </div>
            </div>
        </div>
    </div>
</body>
</html>