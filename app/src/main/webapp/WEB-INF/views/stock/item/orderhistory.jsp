<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>발주 상태 관리 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/stock/item/orderhistory.css">
    <link rel="stylesheet" href="/css/common/component.css"> <link rel="stylesheet" href="/css/stock/item/main.css"> <script defer src="/js/stock/orderhistory.js"></script>
</head>

<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/orderhistorySidebar.jsp" %>

        <main class="page-shell">
            <div class="tab-wrapper">
                <button type="button" class="tab-btn active">발주 상태</button>
            </div>

            <div class="content-container panel">
                <div class="search-section">
                    <div class="search-inner">
                        <select class="form-select search-select" id="searchType">
                            <option value="name">상품명</option>
                            <option value="branch">매장명</option>
                        </select>
                        
                        <div class="search-box">
                            <input type="text" id="orderKeyword" class="search-box-input" placeholder="검색어를 입력하세요" onkeyup="if(window.event.keyCode==13){loadOrderList(1)}">
                            <button type="button" class="search-btn" onclick="loadOrderList(1)">⌕</button>
                        </div>
                    </div>
                    <div class="action-inner">
                        </div>
                </div>

                <div class="table-wrapper">
                    <table class="item-table">
                        <thead>
                            <tr>
                                <th style="width: 80px;">번호</th>
                                <th>이름</th>
                                <th>매장</th>
                                <th>수량</th>
                                <th style="width: 120px;">상태</th>
                                <th>요청일</th>
                            </tr>
                        </thead>
                        <tbody id="orderBody">
                            </tbody>
                    </table>
                </div>

                <div id="pagination" class="pagination-wrapper"></div>
            </div>
        </main>
    </div>

    <div id="orderDetailModal" class="modal">
        <div class="modal-content card">
            <div class="modal-header">
                <h3>발주 상세 정보</h3>
                <span class="close-modal" onclick="closeOrderModal()">&times;</span>
            </div>

            <form id="orderDetailForm">
                <div class="modal-body">
                    <div class="form-row">
                        <label>품목 명</label>
                        <input type="text" id="detailItemName" class="form-input" readonly>
                    </div>
                    <div class="form-row">
                        <label>수량</label>
                        <input type="text" id="detailQuantity" class="form-input" readonly>
                    </div>
                    <div class="form-row">
                        <label>상태 수정</label>
                        <select id="detailStatus" class="form-select">
                            <option value="W">대기 (Wait)</option>
                            <option value="F">완료 (Finish)</option>
                            <option value="C">취소 (Cancel)</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-md btn-dark" onclick="updateOrderStatus()">저장하기</button>
                    <button type="button" class="btn btn-md btn-outline btn-gray-close-modal" onclick="closeOrderModal()">닫기</button>
                </div>  
            </form>
        </div>
    </div>
</body>
</html>