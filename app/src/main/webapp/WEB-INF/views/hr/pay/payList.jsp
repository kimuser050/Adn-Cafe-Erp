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

                        <!-- 급여목록 테이블 -->
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
                                    <tr class="payty-row">
                                        <td colspan="8">조회된 급여 데이터가 없습니다.</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="org-bottom-area">
                                <button type="button" class="btn btn-sm btn-mid register-btn"
                                    onclick="goPayRegisterPage()">
                                    급여등록
                                </button>
                            </div>
                        </div>

                        <!-- ========================= 1) 상세조회 모달 ========================= -->
                        <div id="pay-modal-wrap" class="org-modal-wrap">
                            <div class="org-modal pay-detail-modal">
                                <!-- 모달 헤더 -->
                                <div class="org-modal-header">
                                    <h2>○ 급여조회</h2> <button type="button" class="modal-close-btn" onclick="closePayModal()">✕</button>
                                </div>
                                <!-- 모달 바디 -->
                                <div class="org-modal-body pay-detail-body">
                                   
                                    <!-- 모달 1번째 영역 -->
                                    <div class="payInfo-section">
                                        <h3 class="payInfo-section-title">직원정보</h3>
                                        <div class="payInfo-profile-area">
                                            <div class="payInfo-profile-img">
                                                 <img id="modal-profile-img" src="/img/common/default-profile.png" alt="프로필"> 
                                            </div>
                                            <div class="payInfo-grid">
                                                <div class="payInfo-row">
                                                     <span class="payInfo-value" id="modal-pay-empName">-</span>
                                                </div>
                                                <div class="payInfo-row">
                                                     <span class="payInfo-label">부서</span> 
                                                     <span class="payInfo-value" id="modal-pay-dept">-</span>
                                                </div>
                                                <div class="payInfo-row">
                                                     <span class="payInfo-label">사번</span> 
                                                     <span class="payInfo-value" id="modal-pay-empNo">-</span>
                                                </div>
                                                <div class="payInfo-row">
                                                     <span class="payInfo-label">직급</span> 
                                                     <span class="payInfo-value" id="modal-pay-pos">-</span>
                                                </div>
                                        </div>
                                        </div>
                                    </div>

                                    <!-- 모달 2번째 영역 -->
                                    <div class="payInfo-section">
                                        <h3 class="payInfo-section-title">급여상태</h3>
                                            <div class="payInfo-grid">
                                                <div class="payInfo-row">
                                                    <span class="payInfo-label">지급월</span> 
                                                     <span class="payInfo-value" id="modal-pay-payYearMonth">-</span>
                                                </div>
                                                <div class="payInfo-row">
                                                     <span class="payInfo-label">상태</span> 
                                                     <span class="payInfo-value" id="modal-pay-confirmYn">-</span>
                                                </div>
                                        </div>
                                        </div>
                                    
                                    <!-- 모달 3번째 영역 -->
                                    <div class="payInfo-section">
                                        <h3 class="payInfo-section-title">요약</h3>
                                            <div class="paySummary-grid">
                                                <div class="payInfo-row">
                                                    <span class="payInfo-label">총 지급 금액</span> 
                                                     <span class="payInfo-value" id="modal-pay-totalEarnAmount">-</span>
                                                </div>
                                                <div class="payInfo-row">
                                                     <span class="payInfo-label">총 공제 금액</span> 
                                                     <span class="payInfo-value" id="modal-pay-totalDeductAmount">-</span>
                                                </div>
                                                <div class="payInfo-row">
                                                     <span class="payInfo-label">실 지급액(총액)</span> 
                                                     <span class="payInfo-value" id="modal-pay-netAmount">-</span>
                                                </div>
                                        </div>
                                        </div>

                                    <!-- 모달 4번째 영역 -->
                                     <hr>
                                    <div class="payInfo-section">
                                        <h3 class="payInfo-section-title">항목상세</h3>
                                            <table class = "payDetail-grid">
                                                <thead>
                                                    <tr>
                                                        <th>항목명</th>
                                                        <th>구분</th>
                                                        <th>과세여부</th>
                                                        <th>금액</th>
                                                        <th>비고</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="modal-payDetail-list"></tbody>
                                            </table>
                                        </div>
  
                                <div class="org-modal-footer"> 
                                    <button type="button" class="btn btn-sm btn-mid" id="open-edit-btn" onclick="openEditModal()">수정하기</button>
                                     <button type="button" class="btn btn-sm btn-dark" id="toggle-confirm-btn" onclick="toggleConfirmYn()"></button> 
                                     <button type="button" class="btn btn-sm btn-mid" id="delete-pay-btn" onclick="deletePay()">삭제하기</button>
                                     <button type="button" class="btn btn-sm btn-dark" onclick="closePayModal()">닫기</button>
                                
                                    

                                    </div>
                            </div>
                        </div>
                    </div>

                    <!-- ========================= 2) 수정 모달 ========================= -->
                        <div id="pay-edit-modal-wrap" class="org-modal-wrap">
                            <div class="org-modal pay-edit-modal">
                                <!-- 수정 모달 타이틀 -->
                                <div class="org-modal-header">
                                    <h2>○ 급여수정</h2> 
                                    <button type="button" class="modal-close-btn" onclick="cancelEditModal()">✕</button>
                                </div>
                                <!-- 수정 모달 내용 -->
                                <div class="org-modal-body pay-edit-body"> 
                                    <input type="hidden" id="edit-pay-no">
                                    <div class="detail-section">
                                        <div class="payList-header-row">
                                    </div>
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
                                    <button type="button" class="btn btn-sm btn-mid" onclick="cancelEditModal()">취소</button> </div>
                            </div>
                        </div>
                    </section>
                </main>
        </div>
    </body>

    </html>