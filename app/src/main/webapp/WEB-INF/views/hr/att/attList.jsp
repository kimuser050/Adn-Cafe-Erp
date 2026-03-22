<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>근태관리</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">

    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
    <link rel="stylesheet" href="/css/hr/att/attList.css">

    <script defer src="/js/hr/att/attList.js"></script>
</head>
<body>
<div class="app-shell">
    <%@ include file="/WEB-INF/views/hr/common/attSidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content org-page att-page">

            <div class="att-top-spacer"></div>

            <!-- 요약 카드 -->
            <div class="org-summary-area">
                <div class="summary-card">
                    <div class="summary-title">출근</div>
                    <div class="summary-value" id="total-workingDay-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">지각</div>
                    <div class="summary-value" id="total-lateDay-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">결근</div>
                    <div class="summary-value" id="total-absentDay-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">휴가</div>
                    <div class="summary-value" id="total-vacationDay-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">연장근무</div>
                    <div class="summary-value" id="total-overWorkHour-count">0</div>
                </div>
            </div>

            <!-- 근태 목록 -->
            <div class="org-table-card">
                <div class="org-toolbar">
                    <div class="toolbar-left att-toolbar-left">
                        <input type="month" id="month" class="form-input month-input">
                    </div>

                    <div class="toolbar-right">
                        <select id="search-type" class="form-select">
                            <option value="all">전체</option>
                            <option value="name">이름</option>
                            <option value="dept">부서</option>
                        </select>

                        <div class="search-box">
                            <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn" id="search-btn">⌕</button>
                        </div>

                        <button type="button" class="btn btn-sm btn-dark" id="export-btn">EXPORT</button>
                    </div>
                </div>

                <table class="org-table att-table">
                    <thead>
                    <tr>
                        <th>NO</th>
                        <th>이름</th>
                        <th>직급</th>
                        <th>부서</th>
                        <th>출근</th>
                        <th>지각</th>
                        <th>결근</th>
                        <th>휴가</th>
                        <th>연장근무시간(h)</th>
                    </tr>
                    </thead>
                    <tbody id="att-list">
                    <tr class="empty-row">
                        <td colspan="9">조회된 근태 이력이 없습니다.</td>
                    </tr>
                    </tbody>
                </table>
                <div class="org-bottom-area">
                    <div id="att-pagination-area" class="pagination"></div>
                </div>
            </div>

            <!-- ========================= 상세조회 모달 ========================= -->
            
            
            <div id="att-modal-wrap" class="org-modal-wrap" style="display:none;">
                <div class="org-modal att-detail-modal">
                    <div class="org-modal-header">
                        <h2>○ 근태조회</h2>
                        <button type="button" class="modal-close-btn" onclick="closeAttModal()">✕</button>
                    </div>

                    <div class="org-modal-body att-detail-body">
                        <!-- 직원 정보 -->
                        <div class="attInfo-section">
                            <div class="attInfo-profile-area">
                                <div class="attInfo-profile-img">
                                    <img id="modal-profile-img" src="/img/common/default-profile.png" alt="프로필">
                                </div>

                                <div class="attInfo-grid">
                                    <div class="attInfo-row">
                                        <span class="attInfo-value" id="modal-att-empName">-</span>
                                    </div>
                                    <div class="attInfo-row">
                                        <span class="attInfo-label">부서</span>
                                        <span class="attInfo-value" id="modal-att-dept">-</span>
                                    </div>
                                    <div class="attInfo-row">
                                        <span class="attInfo-label">사번</span>
                                        <span class="attInfo-value" id="modal-att-empNo">-</span>
                                    </div>
                                    <div class="attInfo-row">
                                        <span class="attInfo-label">직급</span>
                                        <span class="attInfo-value" id="modal-att-pos">-</span>
                                    </div>
                                </div>

                                <div class="attInfo-period">
                                    <span id="modal-att-month-label">조회기간: -</span>
                                </div>
                            </div>
                        </div>

                        <!-- 월 요약 -->
                        <div class="attInfo-section">
                            <h3 class="attInfo-section-title">상태요약</h3>
                            <div class="attInfo-grid att-summary-grid">
                                <div class="attInfo-row">
                                    <span class="attInfo-label">출근</span>
                                    <span class="attInfo-value" id="modal-workingDay-count">0</span>
                                </div>
                                <div class="attInfo-row">
                                    <span class="attInfo-label">지각</span>
                                    <span class="attInfo-value" id="modal-lateDay-count">0</span>
                                </div>
                                <div class="attInfo-row">
                                    <span class="attInfo-label">결근</span>
                                    <span class="attInfo-value" id="modal-absentDay-count">0</span>
                                </div>
                                <div class="attInfo-row">
                                    <span class="attInfo-label">휴가</span>
                                    <span class="attInfo-value" id="modal-vacationDay-count">0</span>
                                </div>
                                <div class="attInfo-row">
                                    <span class="attInfo-label">연장근무(h)</span>
                                    <span class="attInfo-value" id="modal-overWorkHour-count">0</span>
                                </div>
                            </div>
                        </div>

                        <!-- 월 이력 -->
                        <div class="attInfo-section">
                            <h3 class="attInfo-section-title" id="modal-history-title">월 근태이력</h3>
                            <div class="att-table-scroll">
                            <table class="org-table att-history-table">
                                <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>상태</th>
                                    <th>출근시간</th>
                                    <th>퇴근시간</th>
                                    <th>연장근무시간(h)</th>
                                    <th>비고</th>
                                </tr>
                                </thead>
                                <tbody id="att-history-list">
                                <tr>
                                    <td colspan="6">이력 없음</td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-mid" onclick="openEditModal()">수정하기</button>
                        <button type="button" class="btn btn-sm btn-dark" onclick="closeAttModal()">닫기</button>
                    </div>
                </div>
            </div>

            <!-- ========================= 수정 모달 ========================= -->
            <div id="att-edit-modal-wrap" class="org-modal-wrap" style="display:none;">
                <div class="org-modal att-edit-modal">
                    <div class="org-modal-header">
                        <h2>○ 근태수정</h2>
                        <button type="button" class="modal-close-btn" onclick="cancelEditModal()">✕</button>
                    </div>

                    <div class="org-modal-body att-edit-body">
                        <div class="att-table-scroll">
                        <table class="org-table att-edit-table">
                            <thead>
                            <tr>
                                <th>날짜</th>
                                <th>상태</th>
                                <th>출근시간</th>
                                <th>퇴근시간</th>
                                <th>연장근무시간(h)</th>
                                <th>비고</th>
                            </tr>
                            </thead>
                            <tbody id="att-edit-list">
                            <tr>
                                <td colspan="6">수정할 데이터가 없습니다.</td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-mid" onclick="saveAttEdit()">저장하기</button>
                        <button type="button" class="btn btn-sm btn-dark" onclick="cancelEditModal()">취소</button>
                    </div>
                </div>
            </div>

        </section>
    </main>
</div>
</body>
</html>