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
        <link rel="stylesheet" href="/css/finance/dailySales/productIncome.css">
        <script src="/js/finance/store.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <main class="page-shell">
                    <section class="page-content">
                        <div class="page">
                            <div class="main-tab-group">
                                <button class="menu-btn active"
                                    onclick="location.href=`/dailySales/storeIncome`">지점별매출</button>
                                <button class="menu-btn"
                                    onclick="location.href=`/dailySales/productIncome`">상품별매출</button>
                            </div>

                            <div class="search-wrapper">
                                <input type="month" id="salesDate" value="2026-03" class="month-input">
                            </div>


                            <div class="sales-dashboard">
                                <div class="chart-item">
                                    <h3>📊 지점별 매출 비중</h3>
                                    <div class="chart-container">
                                        <canvas id="storeDoughnutChart"></canvas>
                                    </div>
                                </div>

                                <div class="chart-item">
                                    <h3>💰 지점별 총 매출액</h3>
                                    <div class="chart-container">
                                        <canvas id="storeBarChart"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
        </div>

    </body>

    </html>