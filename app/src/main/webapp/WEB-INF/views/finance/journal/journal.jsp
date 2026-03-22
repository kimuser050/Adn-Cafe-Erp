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
        <div class="top-tab-group">
            <button class="tab-btn active" onclick="location.href='/journal/insertJournal'">분개장</button>
            <button class="tab-btn" onclick="location.href='/journal/totalList'">총계정원장</button>
            <button class="tab-btn" onclick="location.href='/journal/monthList'">월계표</button>
            <button class="tab-btn" onclick="location.href='/journal/dailyList'">일계표</button>
        </div>

        <div class="content-box panel journal-panel">
            
            <div class="panel-toolbar">
                <label for="journalDate" class="status" style="margin-right: 10px;">조회일자</label>
                <input type="date" id="journalDate" class="form-input" onchange="selectJournal();" style="width: 160px;">
            </div>

            <div class="list-container">
                <table class="summary-table">
                    <thead>
                        <tr>
                            <th>날짜</th>
                            <th>번호</th>
                            <th>계정과목 (차변/대변)</th>
                            <th>금액</th>
                            <th>작성자</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody id="journalListBody">
                        </tbody>
                </table>
            </div>

            <div class="balance-bar">
                <div class="bal-group">
                    <div class="bal-item">
                        <span>차변합계</span>
                        <input type="text" id="totalDebit" value="0" readonly>
                    </div>
                    <div class="bal-item">
                        <span>대변합계</span>
                        <input type="text" id="totalCredit" value="0" readonly>
                    </div>
                    <div class="bal-item diff">
                        <span>차이</span>
                        <input type="text" id="diffAmount" value="0" class="text-danger" readonly>
                    </div>
                </div>
                <button class="btn btn-dark btn-lg" onclick="insertJournal()">전표 확정 등록</button>
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
                        <input type="text" class="form-input debitInput account-select" list="accountOptions" placeholder="계정 검색">
                        <input type="text" id="debit" class="form-input amount-input debit" placeholder="0">

                        <input type="text" class="form-input creditInput account-select" list="accountOptions" placeholder="계정 검색">
                        <input type="text" id="credit" class="form-input amount-input credit" placeholder="0">
                    </div>
                </div>
                <datalist id="accountOptions"></datalist>
            </div>
        </div> 

        <div id="updateModal" class="modal">
            <div class="modalContainer panel">
                <div class="modalHeader">
                    <h3>전표 수정 <span class="no-badge">No.<input type="text" id="modalJournalNo" readonly></span></h3>
                    <input type="date" id="modalDate" class="form-input" style="height: 32px; width: 140px;">
                </div>

                <div class="modalBody">
                    <div class="inputGroup">
                        <label>차변 계정과목</label>
                        <input type="text" id="modalDebitAccountName" class="form-input" list="accountOptions">
                    </div>
                    <div class="inputGroup">
                        <label>차변 금액</label>
                        <input type="text" id="modalDebit" class="form-input text-right">
                    </div>

                    <div class="inputGroup">
                        <label>대변 계정과목</label>
                        <input type="text" id="modalCreditAccountName" class="form-input" list="accountOptions">
                    </div>
                    <div class="inputGroup">
                        <label>대변 금액</label>
                        <input type="text" id="modalCredit" class="form-input text-right">
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-dark btn-md" onclick="updateJournal()">수정완료</button>
                    <button type="button" class="btn btn-outline btn-md" onclick="closeModal()">취소</button>
                </div>
            </div>
        </div>
    </div>
        </section>
        </main>
        </div>