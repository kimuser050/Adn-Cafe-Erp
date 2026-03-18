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
        <link rel="stylesheet" href="/css/finance/dailySales/dailySales.css">
        <script defer src="/js/finance/dailySales.js"></script>
    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <main class="page-shell">
                    <section class="page-content">
                        <div class="page">
                            <div class="title">매출등록</div>
                            <div class="header">
                                <input type="date" name="salesDate" id="salesDate">
                                <input type="text" class="storeInput" list="storeOptions" placeholder="매장명 선택">
                                <datalist id="storeOptions"></datalist>
                                <button onclick="insertDaily();">등록하기</button>
                            </div>
                            <div class="body">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>제품명</th>
                                            <th>단가</th>
                                            <th>수량</th>
                                            <th>결제방법</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input type="text" class="productInput" list="productOptions"
                                                    placeholder="제품 선택">
                                                <datalist id="productOptions"></datalist>
                                            </td>
                                            <td><input type="text" id="unitPrice"></td>
                                            <td><input type="text" id="quantity"></td>
                                            <td><input type="text" class="paymentInput" list="paymentOptions"
                                                    placeholder="결제방법">
                                                <datalist id="paymentOptions"></datalist>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </section>
                </main>
        </div>