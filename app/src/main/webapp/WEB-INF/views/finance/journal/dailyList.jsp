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
        <script defer src="/js/finance/journal.js"></script>
    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <main class="page-shell">
                    <section class="page-content">
                        <div class="page">

                            <div class="main-tab-group">
                                <button class="menu-btn"
                                    onclick="location.href=`http://127.0.0.1/journal/insertJournal`">분개장</button>
                                <button class="menu-btn"
                                    onclick="location.href=`http://127.0.0.1/journal/totalList`">총계정원장</button>
                                <button class="menu-btn"
                                    onclick="location.href=`http://127.0.0.1/journal/monthList`">월계표</button>
                                <button class="menu-btn active"
                                    onclick="location.href=`http://127.0.0.1/journal/dailyList`">일계표</button>
                            </div>
                            <div class="journal-card">
                                <div class="search-wrapper">
                                    <input type="date" id="journalDate" value="2026-03" class="month-input">
                                    <button class="menu-btn active" onclick="findDailyAccount()">검색</button>
                                </div>

                                <datalist id="accountOptions"></datalist>

                                <div class="list-container">
                                    <table class="summary-table">
                                        <thead>
                                            <tr>
                                                <th>차변금액</th>
                                                <th>계정명</th>
                                                <th>대변금액</th>
                                            </tr>
                                        </thead>
                                        <tbody id="journalListBody"></tbody>
                                </div>

                            </div>

                    </section>
                </main>
        </div>