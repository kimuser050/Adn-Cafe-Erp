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
            <div class="top-profile">
                <img src="https://ui-avatars.com/api/?name=Admin&background=5D4037&color=fff" alt="profile">
            </div>

            <section class="page-content">
                
                <div class="tab-wrapper">
                    <button type="button" id="tabApply" class="tab-btn active" onclick="switchTab('apply')">발주 신청</button>
                    <button type="button" id="tabStatus" class="tab-btn" onclick="switchTab('status')">발주 상태</button>
                </div>

                <div class="content-container">
                    <div class="search-section">
                        <div class="search-inner">
                            <label>상품 명</label>
                            <input type="text" id="orderKeyword" placeholder="검색어를 입력하세요">
                            <button class="btn-brown-search" onclick="loadOrderList(1)">검색</button>
                        </div>

                        <div class="action-inner" id="orderFooter">
                            <button type="button" class="btn-action-brown" onclick="submitBulkOrder()">선택 상품 주문</button>
                        </div>
                    </div>

                    <div class="table-wrapper">
                        <table class="item-table">
                            <thead id="orderHead"></thead>
                            <tbody id="orderBody"></tbody>
                        </table>
                    </div>

                    <div id="pagination" class="coffee-pagination"></div>
                </div>
            </section>
        </main>
    </div>

    <div id="orderDetailModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>발주 상세 정보</h3>
                <span class="close-modal" onclick="closeOrderModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="form-row"><label>품목 명</label><input type="text" id="detailItemName" readonly class="readonly-input"></div>
                <div class="form-row"><label>단가</label><input type="text" id="detailUnitPrice" readonly class="readonly-input"></div>
                <div class="form-row"><label>수량</label><input type="number" id="detailQuantity" readonly class="readonly-input"></div>
                <div class="form-row">
                    <label>상태 관리</label>
                    <select id="detailStatus">
                        <option value="W">대기</option>
                        <option value="F">완료</option>
                        <option value="C">취소</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-save" onclick="updateOrderStatus()">저장</button>
                <button type="button" class="btn-close" onclick="closeOrderModal()">닫기</button>
            </div>
        </div>
    </div>
</body>
</html>
</html>