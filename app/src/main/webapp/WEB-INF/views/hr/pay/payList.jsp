<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>급여관리</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">

    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
    <link rel="stylesheet" href="/css/hr/pay/payList.css">

    <script defer src="/js/hr/pay/payList.js"></script>
</head>

<body>
<div class="app-shell">
    <%@ include file="/WEB-INF/views/hr/common/paySidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content org-page pay-page">

            <div class="pay-top-spacer"></div>

            <!-- 요약 카드 -->
            <div class="org-summary-area">
                <div class="summary-card">
                    <div class="summary-title">총 등록 건수</div>
                    <div class="summary-value" id="total-count">0</div>
                </div>

                <div class="summary-card summary-card-wide">
                    <div class="summary-title">총 실지급액</div>
                    <div class="summary-value" id="total-net-amount">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">미확정</div>
                    <div class="summary-value" id="unconfirmed-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">확정</div>
                    <div class="summary-value" id="confirmed-count">0</div>
                </div>
            </div>

            <!-- 목록 카드 -->
            <div class="org-table-card">

                <div class="org-toolbar">
                    <div class="toolbar-left pay-toolbar-left">
                        <input type="month" id="month" class="form-input month-input">
                    </div>

                    <div class="toolbar-right">
                        <select id="search-type" class="form-select">
                            <option value="all">전체</option>
                            <option value="name">이름</option>
                            <option value="confirmYn">상태</option>
                        </select>

                        <div class="search-box">
                            <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn" id="search-btn">⌕</button>
                        </div>

                        <button type="button" class="btn btn-sm btn-dark" id="export-btn">EXPORT</button>
                    </div>
                </div>

                <table class="org-table pay-table">
                    <thead>
                    <tr>
                        <th>NO</th>
                        <th>이름</th>
                        <th>사번</th>
                        <th>직급</th>
                        <th>부서</th>
                        <th>지급월</th>
                        <th>실지급액</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody id="pay-list">
                    <tr class="empty-row">
                        <td colspan="8">조회된 급여 데이터가 없습니다.</td>
                    </tr>
                    </tbody>
                </table>

                <div class="org-bottom-area">
                    <button type="button" class="btn btn-sm btn-mid register-btn" onclick="goPayRegisterPage()">
                        급여등록
                    </button>
                </div>
            </div>

        </section>
    </main>
</div>
</body>

</html>