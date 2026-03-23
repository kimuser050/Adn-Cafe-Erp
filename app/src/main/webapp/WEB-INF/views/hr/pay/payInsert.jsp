<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>급여등록</title>

    <!-- 공통 스타일 -->
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">

    <!-- HR 공통 / 급여등록 전용 -->
    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
    <link rel="stylesheet" href="/css/hr/pay/payInsert.css">

    <script defer src="/js/hr/pay/payInsert.js"></script>
</head>

<body>
<div class="app-shell">
    <%@ include file="/WEB-INF/views/hr/common/paySidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content org-page pay-insert-page">
            <div class="pay-insert-wrap">
                <div class="pay-insert-card">

                    <!-- =========================================================
                         1. 상단 헤더
                         - 화면 제목
                         - 현재 선택한 직원 / 지급월 표시
                         ========================================================= -->
                    <div class="pay-insert-header">
                        <div class="pay-header-left">
                            <h1 class="pay-insert-title">급여 등록</h1>
                            <p class="pay-insert-subtitle">
                                지급월과 직원을 선택한 뒤 자동계산 또는 수기 입력으로 급여를 등록합니다.
                            </p>
                        </div>

                        <div class="pay-top-badge-area">
                            <span class="pay-top-badge" id="top-selected-emp">선택 직원 없음</span>
                            <span class="pay-top-badge" id="top-selected-month">지급월 -</span>
                        </div>
                    </div>

                    <!-- =========================================================
                         2. 본문 레이아웃
                         - 좌측 : 지급월 / 직원검색 / 직원정보
                         - 우측 : 급여항목 입력 / 합계 / 저장
                         ========================================================= -->
                    <div class="pay-main-layout">

                        <!-- 좌측 사이드 -->
                        <aside class="pay-side-column">

                            <!-- 지급월 선택 -->
                            <section class="pay-panel pay-month-panel">
                                <h3 class="panel-title">지급월 선택</h3>

                                <div class="month-row">
                                    <input type="month" id="pay-month" class="form-input month-input">
                                </div>
                            </section>

                            <!-- 직원 검색 -->
                            <section class="pay-panel pay-search-panel">
                                <h3 class="panel-title">직원검색</h3>

                                <div class="emp-search-row">
                                    <input type="text" id="keyword" class="form-input" placeholder="사번 또는 이름 검색">
                                    <button type="button" class="btn btn-sm btn-dark" id="search-emp-btn">검색</button>
                                </div>

                                <div id="emp-search-result" class="emp-search-result">
                                    <div class="emp-empty">
                                        직원명을 검색해 주세요.
                                    </div>
                                </div>
                            </section>

                            <!-- 선택 직원 정보 -->
                            <section class="pay-panel pay-emp-panel">
                                <h3 class="panel-title">직원정보</h3>

                                <div class="emp-info-grid compact">
                                    <div class="info-row">
                                        <span class="info-label">이름</span>
                                        <span class="info-value" id="emp-name">-</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">사번</span>
                                        <span class="info-value" id="emp-no">-</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">부서</span>
                                        <span class="info-value" id="emp-dept">-</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">직급</span>
                                        <span class="info-value" id="emp-pos">-</span>
                                    </div>
                                    <div class="info-row info-row-accent emp-info-span-2">
                                        <span class="info-label">지급월</span>
                                        <span class="info-value" id="info-pay-month">2026-03</span>
                                    </div>
                                </div>

                                <div class="emp-action-row">
                                    <button type="button" class="btn btn-mid btn-lg" id="auto-calc-btn">자동계산</button>
                                </div>
                            </section>
                        </aside>

                        <!-- 우측 콘텐츠 -->
                        <section class="pay-content-column">
                            <div class="pay-panel pay-item-panel">

                                <!-- 급여 항목 입력 영역 -->
                                <div class="pay-panel-head">
                                    <h3 class="panel-title">급여 항목 입력</h3>
                                </div>

                                <div class="pay-table-wrap">
                                    <table class="org-table pay-item-table">
                                        <thead>
                                        <tr>
                                            <th>항목명</th>
                                            <th>구분</th>
                                            <th>과세여부</th>
                                            <th>금액</th>
                                            <th>비고</th>
                                        </tr>
                                        </thead>
                                        <tbody id="pay-item-body">
                                        <tr class="empty-row">
                                            <td colspan="5">급여 항목을 불러오는 중입니다.</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- 하단 요약 / 버튼 -->
                                <div class="pay-bottom-row">
                                    <div class="summary-box" id="summary-box">
                                        <div class="summary-line">
                                            <span>총 지급액</span>
                                            <strong id="total-earn-amount">₩ 0</strong>
                                        </div>
                                        <div class="summary-line">
                                            <span>총 공제액</span>
                                            <strong id="total-deduct-amount">₩ 0</strong>
                                        </div>
                                        <div class="summary-line net">
                                            <span>실지급액</span>
                                            <strong id="net-amount">₩ 0</strong>
                                        </div>
                                    </div>

                                    <div class="pay-action-area">
                                        <button type="button" class="btn btn-dark btn-lg" id="save-btn">저장하기</button>
                                        <button type="button" class="btn btn-outline btn-lg" id="cancel-btn">취소</button>
                                    </div>
                                </div>

                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </section>
    </main>
</div>
</body>
</html>