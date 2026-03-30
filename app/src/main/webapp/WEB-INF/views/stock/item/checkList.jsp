<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>반품 상태 조회 | Coffee Prince ERP</title>
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

        <main class="page-shell"> <div class="tab-wrapper">
                <div class="tab-btn active">반품 검수 목록</div>
            </div>

            <section class="content-container" id="list-section">
                <div class="search-section">
                    <div class="search-inner">
                        <select class="search-select">
                            <option>매장명</option>
                            <option>상품명</option>
                        </select>
                        <div class="search-box">
                            <input type="text" id="searchKeyword" class="search-box-input" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn" onclick="loadProducts(1)">🔍</button>
                        </div>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="item-table"> <thead>
                            <tr>
                                <th style="width: 80px;">번호</th>
                                <th>상품명</th>
                                <th style="width: 150px;">매장명</th>
                                <th style="width: 120px;">상태</th>
                                <th style="width: 120px;">처리결과</th>
                                <th style="width: 200px;">신청일</th>
                            </tr>
                        </thead>
                        <tbody id="list-body">
                            </tbody>
                    </table>
                </div>

                <div id="pagination" class="pagination-wrapper"></div>
            </section>

            <section id="detail-section" style="display: none;" class="content-container">
                <!-- <div class="modal-header" style="margin: -30px -30px 20px -30px;">
                    <h2 style="margin-left: 20px;">반품 검수 상세</h2>
                    <button type="button" onclick="closeDetail()" class="btn-back" style="margin-right: 20px; background: none; border: none; color: white; cursor: pointer;">✕ 닫기</button>
                </div> -->

                <!-- <form id="check-form" class="modal-body">
                    <input type="hidden" id="returnNo">
                    <div class="modal-grid">
                        <div class="f-group">
                            <label>매장 명</label>
                            <input type="text" id="storeName" class="form-input input-readonly" readonly>
                        </div>
                        <div class="f-group">
                            <label>수량</label>
                            <input type="number" id="quantity" class="form-input input-readonly" readonly>
                        </div>
                        <div class="f-group full">
                            <label>상품 명</label>
                            <input type="text" id="productName" class="form-input input-readonly" readonly>
                        </div>
                        <div class="f-group full">
                            <label>사유</label>
                            <textarea id="reason" class="form-input input-readonly" style="height: 80px;" readonly></textarea>
                        </div>
                        <div class="f-group">
                            <label>상태 변경</label>
                            <select id="status" class="form-select">
                                <option value="W">대기</option>
                                <option value="A">정상(승인)</option>
                                <option value="R">비정상(반려)</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" onclick="saveCheck()" class="btn btn-dark">검수 결과 저장</button>
                        <button type="button" onclick="closeDetail()" class="btn btn-outline">취소</button>
                    </div>
                </form> -->
            </section>
        </main>
    </div>
</body>
</html>