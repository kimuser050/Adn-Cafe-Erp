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
        <link rel="stylesheet" href="/css/finance/journal/journal.css">
        <script defer src="/js/finance/journal.js"></script>
    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <main class="page-shell">
                    <section class="page-content">
                        <div class="page">

                            <div class="main-tab-group">
                                <button class="menu-btn active"
                                    onclick="location.href=`http://127.0.0.1/journal/insertJournal`">분개장</button>
                                <button class="menu-btn"
                                    onclick="location.href=`http://127.0.0.1/journal/totalList`">총계정원장</button>
                                <button class="menu-btn"
                                    onclick="location.href=`http://127.0.0.1/journal/monthList`">월계표</button>
                                <button class="menu-btn"
                                    onclick="location.href=`http://127.0.0.1/journal/dailyList`">일계표</button>
                            </div>

                            <div class="journal-card">
                                <div class="card-header">
                                    <div class="date-picker-wrap">
                                        <input type="date" id="journalDate" value="2026-03-12" class="date-input"
                                            onchange="selectJournal();">
                                    </div>
                                    <div class="action-btns">
                                        <button class="menu-btn-sm" onclick="updateJournal()">수정하기</button>
                                        <button class="menu-btn-sm" onclick="delJournal()">삭제하기</button>
                                    </div>
                                </div>

                                <div class="list-container">
                                    <table class="summary-table">
                                        <thead>
                                            <tr>
                                                <th width="40"><input type="checkbox" readonly></th>
                                                <th>날짜</th>
                                                <th>번호</th>
                                                <th>계정과목</th>
                                                <th>금액</th>
                                                <th>작성자</th>
                                            </tr>
                                        </thead>
                                        <tbody id="journalListBody"></tbody>
                                    </table>
                                </div>

                                <div class="balance-bar">
                                    <div class="bal-group">
                                        <div class="bal-item">차변합계 <input type="text" id="totalDebit" value="0"
                                                readonly></div>
                                        <div class="bal-item">대변합계 <input type="text" id="totalCredit" value="0"
                                                readonly></div>
                                        <div class="bal-item">차이금액 <input type="text" id="diffAmount" value="0"
                                                class="text-danger" readonly></div>
                                    </div>
                                    <button class="menu-btn-sm btn-dark" onclick="insertJournal()">등록</button>
                                </div>

                                <div class="entry-section">
                                    <div class="entry-header-row">
                                        <div class="grid-h">차변 계정과목</div>
                                        <div class="grid-h">차변 금액</div>
                                        <div class="grid-h">대변 계정과목</div>
                                        <div class="grid-h">대변 금액</div>
                                    </div>
                                    <div id="entryRowContainer" class="entry-scroll-area">
                                        <div class="entry-row">
                                            <input type="text" class="debitInput account-select" list="accountOptions"
                                                placeholder="계정선택">
                                            <input type="text" id="debit" class="amount-input debit">

                                            <input type="text" class="creditInput account-select" list="accountOptions"
                                                placeholder="계정선택">
                                            <input type="text" id="credit" class="amount-input credit">
                                        </div>
                                    </div>
                                    <datalist id="accountOptions"></datalist>
                                </div>
                            </div>
                        </div>
        </div>
        </section>
        </main>
        </div>