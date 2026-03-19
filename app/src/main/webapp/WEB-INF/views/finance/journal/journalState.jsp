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
        <link rel="stylesheet" href="/css/finance/journal/monthList.css">
        <script defer src="/js/finance/journalState.js"></script>
    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <main class="page-shell">
                    <section class="page-content">
                        <div class="page">

                            <div class="main-tab-group">
                                <button class="menu-btn active"
                                    onclick="location.href=`/journal/journalState`">재무상태표</button>
                                <button class="menu-btn" onclick="location.href=`/journal/incomeState`">손익계산서</button>
                            </div>
                            <div class="journal-card">
                                <div class="search-wrapper">
                                    <input type="date" id="journalDate" class="month-input">
                                </div>
                                <div class="list-container">
                                    <table class="summary-table">
                                        <thead>
                                            <tr>
                                                <th>계정과목</th>
                                                <th>금액</th>
                                            </tr>
                                        </thead>
                                        <tbody id="journalListBody"></tbody>
                                    </table>
                                </div>

                            </div>

                    </section>
                </main>
        </div>