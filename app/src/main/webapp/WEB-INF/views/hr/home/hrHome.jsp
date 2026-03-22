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
    <link rel="stylesheet" href="/css/hr/home/hrHome.css">

    <script defer src="/js/hr/home/hrHome.js"></script>
</head>

<body>
<div class="app-shell">
    <%@ include file="/WEB-INF/views/hr/common/hrSidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content org-page hr-home-page">

            <div class="hr-home-top-spacer"></div>

            <section class="hr-home-top-grid">

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
                                <span class="meta-divider">·</span>
                                <span id="pos-name">-</span>
                            </div>
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

                <article class="hr-home-issue-card">
                    <div class="hr-home-card-header">
                        <h2>최신 인사소식</h2>
                        <span class="hr-home-card-sub" id="issue-count-text">최근 6건</span>
                    </div>

                    <div class="hr-home-issue-list" id="issue-list"></div>
                </article>
            </section>

            <section class="hr-home-bottom-grid">

                <article class="hr-home-att-card">
                    <div class="hr-home-card-header">
                        <h2>전날 근태 현황</h2>
                        <span class="hr-home-card-sub" id="att-base-date">-</span>
                    </div>

                    <div class="hr-home-att-layout">
                        <div class="hr-home-att-left">
                            <div class="hr-home-att-top-mini">
                                <div class="mini-stat-box">
                                    <div class="mini-stat-title">전체직원</div>
                                    <div class="mini-stat-value" id="total-emp-count">0</div>
                                </div>
                            </div>

                            <div class="hr-home-att-status-box">
                                <div class="att-status-item">
                                    <span class="att-dot green"></span>
                                    <span class="att-label">출근</span>
                                    <span class="att-value" id="present-count">0</span>
                                </div>
                                <div class="att-status-item">
                                    <span class="att-dot yellow"></span>
                                    <span class="att-label">지각</span>
                                    <span class="att-value" id="late-count">0</span>
                                </div>
                                <div class="att-status-item">
                                    <span class="att-dot red"></span>
                                    <span class="att-label">결근</span>
                                    <span class="att-value" id="absent-count">0</span>
                                </div>
                                <div class="att-status-item">
                                    <span class="att-dot blue"></span>
                                    <span class="att-label">휴가</span>
                                    <span class="att-value" id="vacation-count">0</span>
                                </div>
                                <div class="att-status-item">
                                    <span class="att-dot purple"></span>
                                    <span class="att-label">연장근무</span>
                                    <span class="att-value" id="overtime-count">0</span>
                                </div>
                                <div class="att-status-item">
                                    <span class="att-dot beige"></span>
                                    <span class="att-label">기타</span>
                                    <span class="att-value" id="other-count">0</span>
                                </div>
                            </div>
                        </div>

                        <div class="hr-home-att-right">
                            <div class="vertical-rate-wrap">
                                <div class="vertical-rate-top">
                                    <span class="vertical-rate-percent" id="att-progress-text">0%</span>
                                </div>
                                <div class="vertical-rate-bar">
                                    <div class="vertical-rate-fill" id="att-progress-fill"></div>
                                </div>
                                <div class="vertical-rate-bottom">
                                    <span class="vertical-rate-label">근태 정상률</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                <article class="hr-home-pay-card">
                    <div class="hr-home-card-header">
                        <h2>급여 현황</h2>
                        <span class="hr-home-card-sub" id="pay-month">-</span>
                    </div>

                    <div class="pay-total-box">
                        <div class="pay-total-label">이번 달 총 지급액</div>
                        <div class="pay-total-value" id="total-net-amount">0원</div>
                    </div>

                    <div class="pay-mini-grid">
                        <div class="mini-stat-box pay-mini-card">
                            <div class="mini-stat-title">지급대상</div>
                            <div class="mini-stat-value" id="target-count">0명</div>
                        </div>
                        <div class="mini-stat-box pay-mini-card">
                            <div class="mini-stat-title">확정</div>
                            <div class="mini-stat-value" id="confirmed-count">0명</div>
                        </div>
                        <div class="mini-stat-box pay-mini-card">
                            <div class="mini-stat-title">미확정</div>
                            <div class="mini-stat-value" id="unconfirmed-count">0명</div>
                        </div>
                    </div>

                    <div class="hr-home-progress-area pay-progress-area">
                        <div class="hr-home-progress-label">
                            <span class="progress-title">확정률</span>
                            <span class="progress-percent" id="pay-progress-text">0%</span>
                        </div>
                        <div class="hr-home-progress-bar-wrap">
                            <div class="hr-home-progress-bar-fill" id="pay-progress-fill"></div>
                        </div>
                    </div>
                </article>

            </section>

        </section>
    </main>
</div>
</body>

</html>