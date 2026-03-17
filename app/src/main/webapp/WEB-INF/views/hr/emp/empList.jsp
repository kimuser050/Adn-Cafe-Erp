<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>직원관리</title>
        <link rel="stylesheet" href="/css/common/reset.css">
        <link rel="stylesheet" href="/css/common/layout.css">
        <link rel="stylesheet" href="/css/common/sidebar.css">
        <link rel="stylesheet" href="/css/common/component.css">
        <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
        <link rel="stylesheet" href="/css/hr/emp/empList.css">
        <script defer src="/js/hr/emp/empList.js"></script>
    </head>

    <body>
        <div class="app-shell">
            <%@ include file="/WEB-INF/views/hr/common/empSidebar.jsp" %>
                <main class="page-shell">
                    <section class="page-content org-page emp-page">
                        <div class="emp-top-spacer"></div> <!-- 요약 카드 -->
                        <div class="org-summary-area">
                            <div class="summary-card">
                                <div class="summary-title">재직</div>
                                <div class="summary-value" id="working-count">0</div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-title">출장</div>
                                <div class="summary-value" id="business-trip-count">0</div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-title">교육</div>
                                <div class="summary-value" id="training-count">0</div>
                            </div>
                            <div class="summary-card">
                                <div class="summary-title">휴직</div>
                                <div class="summary-value" id="leave-count">0</div>
                            </div>
                        </div> <!-- 목록 카드 -->
                        <div class="org-table-card">
                            <div class="org-toolbar">
                                <div class="toolbar-left"></div>
                                <div class="toolbar-right"> <select id="search-type" class="form-select">
                                        <option value="all">전체</option>
                                        <option value="empName">이름</option>
                                        <option value="posName">직급</option>
                                        <option value="status">상태</option>
                                    </select>
                                    <div class="search-box"> <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                                        <button type="button" class="search-btn" onclick="searchEmp()">검색</button>
                                    </div> <button type="button" class="btn btn-sm btn-dark">EXPORT</button>
                                </div>
                            </div>
                            <table class="org-table emp-table">
                                <thead>
                                    <tr>
                                        <th>NO</th>
                                        <th>이름</th>
                                        <th>사번</th>
                                        <th>직급</th>
                                        <th>소속</th>
                                        <th>연락처</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody id="emp-list"></tbody>
                            </table>
                            <div class="org-bottom-area">
                                <div class="pagination"> <button class="page-btn active">1</button> <button
                                        class="page-btn">2</button> <button class="page-btn">3</button> <button
                                        class="page-btn">4</button> <button class="page-btn">5</button> <button
                                        class="page-btn">▶</button> </div>
                            </div>
                        </div> <!-- ========================= 1) 상세조회 모달 ========================= -->
                        <div id="emp-modal-wrap" class="org-modal-wrap">
                            <div class="org-modal emp-detail-modal">
                                <div class="org-modal-header">
                                    <h2>직원조회</h2> <button type="button" class="modal-close-btn"
                                        onclick="closeEmpModal()">✕</button>
                                </div>
                                <div class="org-modal-body emp-detail-body">
                                    <div class="detail-section">
                                        <h3 class="detail-section-title">기본정보</h3>
                                        <div class="detail-profile-area">
                                            <div class="detail-profile-img"> <img id="modal-profile-img"
                                                    src="/img/common/default-profile.png" alt="프로필"> </div>
                                            <div class="detail-info-grid">
                                                <div class="detail-row"> <span class="detail-label">이름</span> <span
                                                        class="detail-value" id="modal-emp-name">-</span> </div>
                                                <div class="detail-row"> <span class="detail-label">사번</span> <span
                                                        class="detail-value" id="modal-emp-no">-</span> </div>
                                                <div class="detail-row"> <span class="detail-label">직급</span> <span
                                                        class="detail-value" id="modal-pos-name">-</span> </div>
                                                <div class="detail-row"> <span class="detail-label">부서</span> <span
                                                        class="detail-value" id="modal-org-name">-</span> </div>
                                                <div class="detail-row"> <span class="detail-label">입사일</span> <span
                                                        class="detail-value" id="modal-hire-date">-</span> </div>
                                                <div class="detail-row"> <span class="detail-label">연락처</span> <span
                                                        class="detail-value" id="modal-emp-phone">-</span> </div>
                                                <div class="detail-row"> <span class="detail-label">이메일</span> <span
                                                        class="detail-value" id="modal-emp-email">-</span> </div>
                                                <div class="detail-row detail-row-address"> <span
                                                        class="detail-label">주소</span> <span class="detail-value"
                                                        id="modal-emp-address">-</span> </div>
                                                <div class="detail-row"> <span class="detail-label">상태</span> <span
                                                        class="detail-value" id="modal-emp-status">-</span> </div>
                                                <div class="detail-row"> <span class="detail-label">퇴사일</span> <span
                                                        class="detail-value" id="modal-resign-date">-</span> </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="detail-section">
                                        <h3 class="detail-section-title">급여정보</h3>
                                        <div class="salary-info-grid">
                                            <div class="detail-row"> <span class="detail-label">기본급</span> <span
                                                    class="detail-value" id="modal-base-salary">-</span> </div>
                                            <div class="detail-row"> <span class="detail-label">보너스율</span> <span
                                                    class="detail-value" id="modal-bonus-rate">-</span> </div>
                                            <div class="detail-row"> <span class="detail-label">예상월급</span> <span
                                                    class="detail-value" id="modal-expected-salary">-</span> </div>
                                        </div>
                                    </div>
                                    <div class="detail-section">
                                        <h3 class="detail-section-title">근태정보(전달)</h3>
                                        <div class="Attandance-info-grid">
                                            <div class="detail-row"> <span class="detail-label">출근일 수</span> <span
                                                    class="detail-value" id="modal-workingDay-count">-</span> </div>
                                            <div class="detail-row"> <span class="detail-label">연장근무시간(h)</span> <span
                                                    class="detail-value" id="modal-overWorkingDay-count">-</span> </div>
                                            <div class="detail-row"> <span class="detail-label">지각</span> <span
                                                    class="detail-value" id="modal-lateDay-count">-</span> </div>
                                            <div class="detail-row"> <span class="detail-label">결근</span> <span
                                                    class="detail-value" id="modal-absenceDay-count">-</span> </div>
                                        </div>
                                    </div>
                                    <div class="detail-section">
                                        <h3 class="detail-section-title">인사이력</h3>
                                        <table class="org-table emp-history-table">
                                            <thead>
                                                <tr>
                                                    <th>날짜</th>
                                                    <th>이벤트</th>
                                                    <th>설명</th>
                                                </tr>
                                            </thead>
                                            <tbody id="emp-history-list">
                                                <tr>
                                                    <td colspan="3">이력 없음</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="org-modal-footer"> <button type="button" class="btn btn-sm btn-mid"
                                        onclick="openEditModal()">수정하기</button> <button type="button"
                                        class="btn btn-sm btn-mid" onclick="closeEmpModal()">닫기</button> </div>
                            </div>
                        </div> <!-- ========================= 2) 수정 모달 ========================= -->
                        <div id="emp-edit-modal-wrap" class="org-modal-wrap">
                            <div class="org-modal emp-edit-modal">
                                <div class="org-modal-header">
                                    <h2>직원수정</h2> <button type="button" class="modal-close-btn"
                                        onclick="closeEditModal()">✕</button>
                                </div>
                                <div class="org-modal-body emp-edit-body"> <input type="hidden" id="edit-emp-no">
                                    <div class="detail-section">
                                        <h3 class="detail-section-title">기본정보 수정</h3>
                                        <div class="edit-grid">
                                            <div class="edit-row"> <label>이름</label> <input type="text"
                                                    id="edit-emp-name" readonly> </div>
                                            <div class="edit-row"> <label>사번</label> <input type="text"
                                                    id="edit-emp-no-view" readonly> </div>
                                            <div class="edit-row"> <label>직급</label> <select
                                                    id="edit-pos-code"></select> </div>
                                            <div class="edit-row"> <label>부서</label> <select
                                                    id="edit-dept-code"></select> </div>
                                            <div class="edit-row"> <label>상태</label> <select
                                                    id="edit-emp-status-no"></select> </div>
                                            <div class="edit-row"> <label>입사일</label> <input type="text"
                                                    id="edit-hire-date" readonly> </div>
                                        </div>
                                    </div>
                                    <div class="detail-section">
                                        <div class="history-header-row">
                                            <h3 class="detail-section-title">인사이력 수정</h3> <button type="button"
                                                class="btn btn-sm btn-mid" onclick="addHistoryRow()">+ 행 추가</button>
                                        </div>
                                        <table class="org-table emp-history-edit-table">
                                            <thead>
                                                <tr>
                                                    <th>날짜</th>
                                                    <th>이벤트</th>
                                                    <th>설명</th>
                                                </tr>
                                            </thead>
                                            <tbody id="history-edit-body"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="org-modal-footer"> <button type="button" class="btn btn-sm btn-mid"
                                        onclick="saveEmpEdit()">저장하기</button> <button type="button"
                                        class="btn btn-sm btn-mid" onclick="closeEditModal()">닫기</button> </div>
                            </div>
                        </div>
                    </section>
                </main>
        </div>
    </body>

    </html>


    <!--  -->
 