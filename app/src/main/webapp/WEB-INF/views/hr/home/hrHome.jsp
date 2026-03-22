<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>인적자원HOME</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
    <link rel="stylesheet" href="/css/hr/home/hrHome.css">

    <script defer src="/js/hr/home/hrHome.js"></script>
</head>

<body>
<div class="app-shell">
    <%@ include file="/WEB-INF/views/hr/common/hrSidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content org-page hr-home-page">

            <!-- 상단 여백 -->
            <div class="hr-home-top-spacer"></div>

            <!-- 상단 영역 -->
            <section class="hr-home-top-grid">

                <!-- 왼쪽 : 프로필 + 결재요약 -->
                <article class="hr-home-profile-card">
                    <div class="hr-home-card-header">
                        <h2>내 정보</h2>
                    </div>

                    <div class="hr-home-profile-wrap">
                        <div class="hr-home-profile-img-box">
                            <img id="profile-img" src="/img/common/default-profile.png" alt="프로필 이미지">
                        </div>

                        <div class="hr-home-profile-info">
                            <div class="hr-home-profile-name" id="emp-name">-</div>
                            <div class="hr-home-profile-meta">
                                <span id="dept-name">-</span>
                                <span class="dot">·</span>
                                <span id="pos-name">-</span>
                            </div>
                            <div class="hr-home-profile-empno" id="emp-no">-</div>
                        </div>
                    </div>

                    <div class="hr-home-approval-summary">
                        <button type="button" class="approval-summary-btn" id="vacation-summary-btn">
                            <div class="approval-summary-label">전날 승인된 휴가</div>
                            <div class="approval-summary-value" id="approved-vacation-count">0</div>
                        </button>

                        <button type="button" class="approval-summary-btn" id="overtime-summary-btn">
                            <div class="approval-summary-label">전날 승인된 연장근무</div>
                            <div class="approval-summary-value" id="approved-overtime-count">0</div>
                        </button>
                    </div>
                </article>

                <!-- 오른쪽 : 최신 인사소식 -->
                <article class="hr-home-issue-card">
                    <div class="hr-home-card-header">
                        <h2>최신 인사소식</h2>
                        <span class="hr-home-card-sub" id="issue-count-text">최근 6건</span>
                    </div>

                    <div class="hr-home-issue-list" id="issue-list">
                        <!-- JS 렌더링 -->
                    </div>
                </article>
            </section>

            <!-- 하단 영역 -->
            <section class="hr-home-bottom-grid">

                <!-- 전날 근태 요약 -->
                <article class="hr-home-att-card">
                    <div class="hr-home-card-header">
                        <h2>전날 근태 현황</h2>
                        <span class="hr-home-card-sub" id="att-base-date">-</span>
                    </div>

                    <div class="hr-home-summary-grid att-summary-grid">
                        <div class="summary-card">
                            <div class="summary-title">전체직원</div>
                            <div class="summary-value" id="total-emp-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">출근</div>
                            <div class="summary-value" id="present-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">지각</div>
                            <div class="summary-value" id="late-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">결근</div>
                            <div class="summary-value" id="absent-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">휴가</div>
                            <div class="summary-value" id="vacation-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">연장근무</div>
                            <div class="summary-value" id="overtime-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">정상근태</div>
                            <div class="summary-value" id="normal-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">정상률</div>
                            <div class="summary-value" id="normal-rate">0%</div>
                        </div>
                    </div>
                </article>

                <!-- 급여 요약 -->
                <article class="hr-home-pay-card">
                    <div class="hr-home-card-header">
                        <h2>급여 현황</h2>
                        <span class="hr-home-card-sub" id="pay-month">-</span>
                    </div>

                    <div class="hr-home-summary-grid pay-summary-grid">
                        <div class="summary-card summary-card-wide">
                            <div class="summary-title">총 지급예정액</div>
                            <div class="summary-value" id="total-net-amount">0원</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">지급대상</div>
                            <div class="summary-value" id="target-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">확정</div>
                            <div class="summary-value" id="confirmed-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">미확정</div>
                            <div class="summary-value" id="unconfirmed-count">0</div>
                        </div>

                        <div class="summary-card">
                            <div class="summary-title">확정률</div>
                            <div class="summary-value" id="confirm-rate">0%</div>
                        </div>
                    </div>
                </article>
            </section>

        </section>
    </main>
</div>
</body>

</html>