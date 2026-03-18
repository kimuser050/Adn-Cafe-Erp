<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>급여등록</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">

    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
    <link rel="stylesheet" href="/css/hr/pay/payInsert.css">

    <script defer src="/js/hr/pay/payInsert.js"></script>
</head>

<body>
<div class="app-shell">
    <%@ include file="/WEB-INF/views/hr/common/paySidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content pay-insert-page">

            <div class="pay-insert-card">
                <h2 class="page-title">○ 급여등록</h2>

                <div class="pay-insert-layout">

                    <!-- =========================
                         좌측 영역
                         1) 지급월 선택
                         2) 직원 검색
                         3) 직원 정보
                         ========================= -->
                    <div class="pay-left-area">

                        <!-- 지급월 선택 -->
                        <div class="pay-panel">
                            <h3 class="panel-title">지급월 선택</h3>
                            <div class="month-box">
                                <input type="month" id="pay-month" class="month-input">
                            </div>
                        </div>

                        <!-- 직원 검색 -->
                        <div class="pay-panel">
                            <h3 class="panel-title">직원검색</h3>

                            <div class="emp-search-row">
                                <input type="text" id="keyword" class="form-input" placeholder="사번 또는 이름 검색">
                                <button type="button" class="btn btn-sm btn-dark" id="search-emp-btn">검색</button>
                            </div>

                            <div id="emp-search-result" class="emp-search-result">
                                검색 결과가 없습니다.
                            </div>
                        </div>

                        <!-- 직원 정보 -->
                        <div class="pay-panel">
                            <h3 class="panel-title">직원정보</h3>

                            <div class="emp-info-grid">
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
                                <div class="info-row">
                                    <span class="info-label">지급월</span>
                                    <span class="info-value" id="info-pay-month">-</span>
                                </div>
                            </div>

                            <div class="auto-btn-wrap">
                                <button type="button" class="btn btn-sm btn-mid" id="auto-calc-btn">자동계산</button>
                            </div>
                        </div>
                    </div>

                    <!-- =========================
                         우측 영역
                         급여 항목 입력
                         ========================= -->
                    <div class="pay-right-area">
                        <div class="pay-panel pay-item-panel">
                            <h3 class="panel-title">급여 항목 입력</h3>

                            <table class="pay-item-table">
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

                            <div class="summary-box">
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
                        </div>
                    </div>

                </div>

                <!-- 하단 버튼 -->
                <div class="bottom-btn-area">
                    <button type="button" class="btn btn-dark" id="save-btn">저장하기</button>
                    <button type="button" class="btn btn-gray" id="cancel-btn">취소</button>
                </div>
            </div>

        </section>
    </main>
</div>
</body>
</html>