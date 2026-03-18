
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>발주 상태 관리 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/stock/item/main.css">
      <script defer src="/js/stock/orderhistory.js"></script>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/orderSidebar.jsp" %>

        <main class="page-shell">
            <section class="page-content">
                <div class="tab-wrapper">
                    <button type="button" class="tab-btn" onclick="location.href='/stock/order'">발주 신청</button>
                    <button type="button" class="tab-btn active">발주 상태</button>
                </div>

                <div class="content-container">
                    <div class="search-section">
                        <div class="search-inner">
                            <label for="orderKeyword">상품 명</label>
                            <input type="text" id="orderKeyword" placeholder="검색어를 입력하세요">
                            <button class="btn-brown-search" onclick="loadHistoryList(1)">검색</button>
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
                            <tbody id="orderBody">
                                </tbody>
                        </table>
                    </div>

                    <div id="pagination" class="pagination-wrapper"></div>
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
                <div class="form-row"><label>품목 명</label><input type="text" id="detailItemName" readonly></div>
                <div class="form-row"><label>수량</label><input type="text" id="detailQuantity" readonly></div>
                <div class="form-row"><label>상태 수정</label>
                    <select id="detailStatus">
                        <option value="W">대기</option>
                        <option value="F">완료</option>
                        <option value="C">취소</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-action-brown" onclick="updateOrderStatus()">저장하기</button>
                <button type="button" class="btn-gray-close-modal" onclick="closeOrderModal()">닫기</button>
            </div>
        </div>
    </div>
</body>
</html>
</html>