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

            <div class="org-top-spacer"></div>

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

            <div class="org-table-card">
                <div class="org-toolbar">
                    <div class="toolbar-left pay-toolbar-left">
                        <input type="month" id="month" class="form-input month-input">
                    </div>

                    <div class="toolbar-right">
                        <select id="search-type" class="form-select search-select">
                            <option value="all">전체</option>
                            <option value="name">이름</option>
                            <option value="confirmYn">상태</option>
                        </select>

                        <div class="search-box">
                            <input type="text" id="keyword" class="search-box-input" placeholder="검색어를 입력하세요">
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
                    <div id="pay-pagination-area" class="pagination"></div>
                    <button type="button" class="btn btn-sm btn-mid register-btn" onclick="goPayRegisterPage()">
                        급여등록
                    </button>
                </div>
            </div>

            <!-- 상세조회 모달 -->
            <div id="pay-modal-wrap" class="org-modal-wrap">
                <div class="org-modal pay-detail-modal">
                    <div class="org-modal-header">
                        <h2>○ 급여조회</h2>
                        <button type="button" class="modal-close-btn" onclick="closePayModal()">✕</button>
                    </div>

                    <div class="org-modal-body pay-detail-body">
                        <div class="org-detail-grid">
                            <div class="org-detail-item">
                                <div class="org-detail-label">이름</div>
                                <div class="org-detail-value" id="modal-pay-empName">-</div>
                            </div>
                            <div class="org-detail-item">
                                <div class="org-detail-label">부서</div>
                                <div class="org-detail-value" id="modal-pay-dept">-</div>
                            </div>
                            <div class="org-detail-item">
                                <div class="org-detail-label">사번</div>
                                <div class="org-detail-value" id="modal-pay-empNo">-</div>
                            </div>
                            <div class="org-detail-item">
                                <div class="org-detail-label">직급</div>
                                <div class="org-detail-value" id="modal-pay-pos">-</div>
                            </div>
                            <div class="org-detail-item">
                                <div class="org-detail-label">지급월</div>
                                <div class="org-detail-value" id="modal-pay-payYearMonth">-</div>
                            </div>
                            <div class="org-detail-item">
                                <div class="org-detail-label">상태</div>
                                <div class="org-detail-value">
                                    <span id="modal-pay-confirmYn" class="status status-pending">미확정</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section detail-section-pop">
                            <div class="detail-section-title">급여 요약</div>
                            <div class="pay-summary-box">
                                <div class="pay-summary-item">
                                    <div class="pay-summary-label">총 지급</div>
                                    <div class="pay-summary-value" id="modal-pay-totalEarnAmount">0</div>
                                </div>
                                <div class="pay-summary-item">
                                    <div class="pay-summary-label">총 공제</div>
                                    <div class="pay-summary-value" id="modal-pay-totalDeductAmount">0</div>
                                </div>
                                <div class="pay-summary-item pay-summary-item-strong">
                                    <div class="pay-summary-label">실지급액</div>
                                    <div class="pay-summary-value" id="modal-pay-netAmount">0</div>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section detail-section-pop">
                            <div class="detail-section-title">상세 항목</div>
                            <table class="org-table">
                                <thead>
                                <tr>
                                    <th>항목명</th>
                                    <th>구분</th>
                                    <th>과세여부</th>
                                    <th>금액</th>
                                    <th>비고</th>
                                </tr>
                                </thead>
                                <tbody id="modal-payDetail-list">
                                <tr class="empty-row">
                                    <td colspan="5">상세 항목이 없습니다.</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-mid" id="toggle-confirm-btn" onclick="toggleConfirmYn()">급여확정</button>
                        <button type="button" class="btn btn-sm btn-mid" id="open-edit-btn" onclick="openEditModal()">수정</button>
                        <button type="button" class="btn btn-sm btn-outline" id="delete-pay-btn" onclick="deletePay()">삭제</button>
                        <button type="button" class="btn btn-sm btn-outline" onclick="closePayModal()">닫기</button>
                    </div>
                </div>
            </div>

            <!-- 수정 모달 -->
            <div id="pay-edit-modal-wrap" class="org-modal-wrap">
                <div class="org-modal pay-edit-modal">
                    <div class="org-modal-header">
                        <h2>○ 급여수정</h2>
                        <button type="button" class="modal-close-btn" onclick="cancelEditModal()">✕</button>
                    </div>

                    <div class="org-modal-body pay-edit-body">
                        <input type="hidden" id="edit-pay-no">

                        <div class="detail-section detail-section-pop">
                            <div class="payList-header-row"></div>

                            <table class="org-table payList-edit-table">
                                <thead>
                                <tr>
                                    <th>항목명</th>
                                    <th>구분</th>
                                    <th>과세여부</th>
                                    <th>금액</th>
                                    <th>비고</th>
                                </tr>
                                </thead>
                                <tbody id="payList-edit-body"></tbody>
                            </table>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-mid" onclick="savePayEdit()">저장하기</button>
                        <button type="button" class="btn btn-sm btn-outline" onclick="cancelEditModal()">취소</button>
                    </div>
                </div>
            </div>

        </section>
    </main>
</div>
</body>
</html>