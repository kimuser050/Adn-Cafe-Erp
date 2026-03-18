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
                    <a href="/stock/order" class="tab-btn active">발주 신청</a>
                    <a href="#" class="tab-btn">발주 상태</a>
                </div>

                <div class="content-container">
                    <div class="search-section">
                        <div class="search-inner">
                            <label for="productName">상품 명</label>
                            <input type="text" id="productName" placeholder="검색어를 입력하세요">
                            <button class="btn-brown-search" onclick="loadOrderList(1)">검색</button>
                        </div>

                        <div class="action-inner">
                            <button type="button" class="btn-action-brown" onclick="openInsertModal()">신규 품목 등록</button>
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
                                    <th>상태</th>
                                </tr>
                            </thead>
                            <tbody id="itemList">
                                </tbody>
                        </table>
                    </div>

                    <div id="paginationArea" class="pagination-wrapper"></div>
                </div>
            </section>
        </main>
    </div>

    <div id="itemDetailModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>품목 상세 정보 및 상태 관리</h3>
                <span class="close-modal" onclick="closeDetailModal()">&times;</span>
            </div>
            <form id="itemDetailForm">
                <input type="hidden" id="modalItemNo">
                <div class="modal-body">
                    <div class="form-row"><label>품목 명</label><input type="text" id="modalItemName" readonly></div>
                    <div class="form-row"><label>단가</label><input type="number" id="modalUnitPrice"></div>
                    <div class="form-row">
                        <label>현재 상태</label>
                        <select id="modalStatus">
                            <option value="WAIT">대기 (WAIT)</option>
                            <option value="APPROVE">승인 (APPROVE)</option>
                            <option value="REJECT">거절 (REJECT)</option>
                            <option value="COMPLETED">입고완료 (COMPLETED)</option>
                        </select>
                    </div>
                    <div class="form-row"><label>위치</label><input type="text" id="modalLocation"></div>
                    <div class="form-row"><label>비고</label><textarea id="modalReason" style="width:100%; height:60px;"></textarea></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-action-brown" onclick="updateItemStatus()">변경사항 저장</button>
                    <button type="button" class="btn-gray-close-modal" onclick="closeDetailModal()">닫기</button>
                </div>
            </form>
        </div>
    </div>

    <div id="itemInsertModal" class="modal">
        </div>
</body>
</html>