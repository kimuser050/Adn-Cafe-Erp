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
                        <select class="form-select search-select" id="searchType">
                            <option value="productName">상품명</option>
                            <option value="storeName">매장명</option>
                        </select>
                        <div class="search-box">
                            <input type="text" id="checkSearch" class="search-box-input" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn">⌕</button>
                        </div>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="item-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>상품명</th>
                                <th >매장명</th>
                                <th >상태</th>
                                <th >처리결과</th>
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
                            <input type="text" id="storeName" class="f-input readonly" readonly>
                        </div>
                        <div class="f-group">
                            <label>반품 수량</label>
                            <input type="text" id="itemQty" class="f-input readonly" readonly>
                        </div>
                        <div class="f-group full">
                            <label>상품명</label>
                            <input type="text" id="productName" class="f-input readonly" readonly>
                        </div>
                        <div class="f-group">
                            <label>신청일시</label>
                            <input type="text" id="regDate" class="f-input readonly" readonly>
                        </div>
                        <div class="f-group">
                            <label>검수 상태</label>
                          <select id="checkStatus" class="f-select">
    <option value="W">대기</option>
    <option value="A">승인</option>
    <option value="R">반려</option>
</select>
                        </div>
                        <div class="f-group full">
                            <label>검수 의견</label>
                            <textarea id="checkReason" class="f-textarea" placeholder="검수 의견을 입력하세요."></textarea>
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