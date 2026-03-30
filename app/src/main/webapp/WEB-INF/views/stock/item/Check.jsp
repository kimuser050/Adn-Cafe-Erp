<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>반품 검수 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/stock/item/check.css">
    <script defer src="/js/stock/check.js"></script>
    <style>
        /* 모달 초기 상태 제어 */
        .modal-overlay { display: none; align-items: center; justify-content: center; position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); z-index: 1000; }
        .status-on { color: #2ecc71; font-weight: bold; }   /* 승인 */
        .status-off { color: #e74c3c; font-weight: bold; }  /* 반려 */
        .status-wait { color: #f1c40f; font-weight: bold; } /* 대기 */
    </style>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/checkListSidebar.jsp" %>

        <main class="page-shell">
            <div class="tab-wrapper">
                <a href="/stock/return/check" class="tab-btn active">반품 검수 목록</a>
            </div>

            <div class="content-container panel">
                <div class="search-section">
                    <div class="search-inner">
                        <select id="searchType" class="form-select" style="width: 120px;">
                            <option value="itemName">상품명</option>
                            <option value="storeName">매장명</option>
                        </select>
                        <input type="text" id="searchKeyword" class="form-input" placeholder="검색어를 입력하세요">
                        <button type="button" class="btn btn-dark" onclick="loadList(1)">조회</button>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="item-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>상품명</th>
                                <th>매장명</th>
                                <th>상태</th>
                                <th>처리결과</th>
                                <th>신청일</th>
                            </tr>
                        </thead>
                        <tbody id="list-body">
                            </tbody>
                    </table>
                </div>

                <div id="paginationArea" class="pagination-wrapper"></div>
            </div>
        </main>
    </div>

<div id="checkModal" class="modal-overlay">
    <div class="modal-content">
        <div class="modal-header">
            <h3>반품 검수 상세</h3>
            <button type="button" class="close-x" onclick="closeDetail()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="check-form">
                <input type="hidden" id="returnNo">
                <div class="modal-grid">
                    <div class="f-group">
                        <label>매장명</label>
                        <input type="text" id="storeName" class="form-input input-readonly" readonly>
                    </div>
                    <div class="f-group">
                        <label>반품 수량</label>
                        <input type="text" id="itemQty" class="form-input input-readonly" readonly>
                    </div>
                    <div class="f-group full">
                        <label>상품명</label>
                        <input type="text" id="productName" class="form-input input-readonly" readonly>
                    </div>
                    <div class="f-group">
                        <label>신청일시</label>
                        <input type="text" id="regDate" class="form-input input-readonly" readonly>
                    </div>
                    <div class="f-group">
                        <label>검수 상태</label>
                        <select id="checkStatus" class="form-select">
                            <option value="W">대기</option>
                            <option value="A">승인</option>
                            <option value="R">반려</option>
                        </select>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-dark" onclick="saveCheck()">검수 결과 저장</button>
            <button type="button" class="btn btn-outline" onclick="closeDetail()">취소</button>
        </div>
    </div>
</div>
</body>
</html>