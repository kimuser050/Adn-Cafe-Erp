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
                                <div class="summary-value" id="total-count">0</div>
                            </div>

                            <div class="summary-card summary-card-wide">
                                <div class="summary-title">지각</div>
                                <div class="summary-value" id="total-net-amount">0</div>
                            </div>

                            <div class="summary-card">
                                <div class="summary-title">결근</div>
                                <div class="summary-value" id="unconfirmed-count">0</div>
                            </div>

                            <div class="summary-card">
                                <div class="summary-title">휴가</div>
                                <div class="summary-value" id="confirmed-count">0</div>
                            </div>

                            <div class="summary-card">
                                <div class="summary-title">연장근무</div>
                                <div class="summary-value" id="confirmed-count">0</div>
                            </div>
                        </div>

                        <!-- 근태목록 테이블 -->
                        <div class="org-table-card">

                            <div class="org-toolbar">
                                <div class="toolbar-left att-toolbar-left">
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

                            <table class="org-table att-table">
                                <thead>
                                    <tr>
                                        <th>NO</th>
                                        <th>이름</th>
                                        <th>직급</th>
                                        <th>소속</th>
                                        <th>출근</th>
                                        <th>지각</th>
                                        <th>결근</th>
                                        <th>휴가</th>
                                        <th>연장근무시간(h)</th>
                                    </tr>
                                </thead>
                                <tbody id="att-list">
                                    <tr class="att-row">
                                        <td colspan="8">조회된 근태 이력이 없습니다.</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="org-bottom-area">
                                <button type="button" class="btn btn-sm btn-mid register-btn" onclick="goPayRegisterPage()">급여등록</button>
                            </div>
                        </div>

                        <!-- ========================= 1) 상세조회 모달 ========================= -->
                        <div id="att-modal-wrap" class="org-modal-wrap">
                            <div class="org-modal att-detail-modal">
                                <!-- 모달 헤더 -->
                                <div class="org-modal-header">
                                    <h2>○ 근태조회</h2>
                                    <button type="button" class="modal-close-btn" onclick="closePayModal()">✕</button>
                                </div>
                                <!-- 모달 바디 -->
                                <div class="org-modal-body att-detail-body">
                                   
                                    <!-- 모달 1번째 영역 -->
                                    <div class="attInfo-section">
                                        <h3 class="attInfo-section-title">직원정보</h3>
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
                                        </div>
                                    </div>

                                    <!-- 모달 2번째 영역 -->
                                    <div class="attInfo-section">
                                        <h3 class="attInfo-section-title">급여상태</h3>
                                            <div class="attInfo-grid">
                                                <div class="attInfo-row">
                                                    <span class="attInfo-label">지급월</span> 
                                                     <span class="attInfo-value" id="modal-att-attYearMonth">-</span>
                                                </div>
                                                <div class="attInfo-row">
                                                     <span class="attInfo-label">상태</span> 
                                                     <span class="attInfo-value" id="modal-att-confirmYn">-</span>
                                                </div>
                                        </div>
                                        </div>
                                    
                                    <!-- 모달 3번째 영역 -->
                                    <div class="attInfo-section">
                                        <h3 class="attInfo-section-title">요약</h3>
                                            <div class="attSummary-grid">
                                                <div class="attInfo-row">
                                                    <span class="attInfo-label">총 지급 금액</span> 
                                                     <span class="attInfo-value" id="modal-att-totalEarnAmount">-</span>
                                                </div>
                                                <div class="attInfo-row">
                                                     <span class="attInfo-label">총 공제 금액</span> 
                                                     <span class="attInfo-value" id="modal-att-totalDeductAmount">-</span>
                                                </div>
                                                <div class="attInfo-row">
                                                     <span class="attInfo-label">실 지급액(총액)</span> 
                                                     <span class="attInfo-value" id="modal-att-netAmount">-</span>
                                                </div>
                                        </div>
                                        </div>

                                    <!-- 모달 4번째 영역 -->
                                     <hr>
                                    <div class="attInfo-section">
                                        <h3 class="attInfo-section-title">항목상세</h3>
                                            <table class = "attDetail-grid">
                                                <thead>
                                                    <tr>
                                                        <th>항목명</th>
                                                        <th>구분</th>
                                                        <th>과세여부</th>
                                                        <th>금액</th>
                                                        <th>비고</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="modal-attDetail-list"></tbody>
                                            </table>
                                        </div>
  
                                <div class="org-modal-footer"> 
                                    <button type="button" class="btn btn-sm btn-mid" id="open-edit-btn" onclick="openEditModal()">수정하기</button>
                                     <button type="button" class="btn btn-sm btn-dark" id="toggle-confirm-btn" onclick="toggleConfirmYn()"></button> 
                                     <button type="button" class="btn btn-sm btn-mid" id="delete-att-btn" onclick="deletePay()">삭제하기</button>
                                     <button type="button" class="btn btn-sm btn-dark" onclick="closePayModal()">닫기</button>
                                
                                    

                                    </div>
                            </div>
                        </div>
                    </div>

                    <!-- ========================= 2) 수정 모달 ========================= -->
                        <div id="att-edit-modal-wrap" class="org-modal-wrap">
                            <div class="org-modal att-edit-modal">
                                <!-- 수정 모달 타이틀 -->
                                <div class="org-modal-header">
                                    <h2>○ 급여수정</h2> 
                                    <button type="button" class="modal-close-btn" onclick="cancelEditModal()">✕</button>
                                </div>
                                <!-- 수정 모달 내용 -->
                                <div class="org-modal-body att-edit-body"> 
                                    <input type="hidden" id="edit-att-no">
                                    <div class="detail-section">
                                        <div class="attList-header-row">
                                    </div>
                                        <table class="org-table attList-edit-table">
                                            <thead>
                                                <tr>
                                                    <th>항목명</th>
                                                    <th>구분</th>
                                                    <th>과세여부</th>
                                                    <th>금액</th>
                                                    <th>비고</th>
                                                </tr>
                                            </thead>
                                            <tbody id="attList-edit-body"></tbody>
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