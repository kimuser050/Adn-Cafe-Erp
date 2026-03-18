<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>공용</title>

        <link rel="stylesheet" href="/css/common/reset.css">
        <link rel="stylesheet" href="/css/common/layout.css">
        <link rel="stylesheet" href="/css/common/sidebar.css">
        <link rel="stylesheet" href="/css/common/component.css">
        <link rel="stylesheet" href="/css/hr/dept/deptList.css">
        <link rel="stylesheet" href="/css/finance/dailySales/dailyList.css">
        <script defer src="/js/finance/dailySales.js"></script>
    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <main class="page-shell">
                    <section class="page-content">
                        <div class="page">
                            <div class="page-content-box">
                                <div class="title">매출 조회</div>
                                <div class="header">
                                    <input type="date" name="salesDate" id="salesDate">
                                    <input type="text" class="storeInput" list="storeOptions" placeholder="매장명 선택"
                                        onchange="salesList();">
                                    <datalist id="storeOptions"></datalist>
                                    <button onclick="location.href='/dailySales/insertDaily'">매출 등록</button>
                                </div>
                                <div class="body">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>날짜</th>
                                                <th>총 판매금액</th>
                                                <th>제품명</th>
                                                <th>단가</th>
                                                <th>수량</th>
                                                <th>현금(C)/카드(D)</th>
                                                <th></th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>

                            <div id="updateModal" class="modal">
                                <div class="modalContainer">
                                    <div class="modalHeader">
                                        <input type="hidden" id="modalStoreNo">
                                        <h3>매출 수정 (번호:<input type="text" id="modalSalesNo" readonly>)
                                        </h3>
                                        <input type="date" id="modalSalesDate">
                                    </div>

                                    <div class="modalBody">
                                        <div class="inputGroup">
                                            <label>제품이름</label>
                                            <input type="text" id="modalProductName" list="productOptions"
                                                placeholder="제품선택">
                                            <datalist id="productOptions"></datalist>
                                        </div>
                                        <div class="inputGroup">
                                            <label>단가</label>
                                            <input type="text" id="modalUnitPrice" placeholder="금액 입력">
                                        </div>
                                        <div class="inputGroup">
                                            <label>수량</label>
                                            <input type="text" id="modalQuantity" placeholder="수량 입력">
                                        </div>
                                        <div class="inputGroup">
                                            <label>결제방법</label>
                                            <input type="text" id="modalPayment" list="paymentOptions"
                                                placeholder="결제방법선택">
                                            <datalist id="paymentOptions"></datalist>
                                        </div>
                                    </div>

                                    <div class="modal-footer">
                                        <button type="button" class="menu-btn-sm btn-dark"
                                            onclick="editSales()">수정완료</button>
                                        <button type="button" class="menu-btn-sm" onclick="closeModal()">취소</button>
                                    </div>
                                </div>
                            </div>
                    </section>
                </main>
        </div>