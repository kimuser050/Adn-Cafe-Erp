<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

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

            <!-- 아무것도 없지만 비우는 공간으로 쓸려고 함 -->
            <div class="emp-top-spacer"></div>

            <!-- 요약 카드 -->
            <div class="org-summary-area">
                <div class="summary-card">
                    <div class="summary-title">재직</div>
                    <div class="summary-value" id="working-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">휴직</div>
                    <div class="summary-value" id="leave-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">출장</div>
                    <div class="summary-value" id="business-trip-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">교육</div>
                    <div class="summary-value" id="training-count">0</div>
                </div>
            </div>

            <!-- 목록 카드 -->
            <div class="org-table-card">

                <!-- 툴바 -->
                <div class="org-toolbar">
                    <div class="toolbar-left"></div>

                    <div class="toolbar-right">
                        <select id="search-type" class="form-select">
                            <option value="all">전체</option>
                            <option value="empName">이름</option>
                            <option value="posName">직급</option>
                            <option value="status">상태</option>
                        </select>

                        <div class="search-box">
                            <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn" onclick="searchEmp()">검색</button>
                        </div>

                        <button type="button" class="btn btn-sm btn-dark">EXPORT</button>
                    </div>
                </div>

                <!-- 테이블 -->
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

                <!-- 하단 -->
                <div class="org-bottom-area">
                    <div class="pagination">
                        <button class="page-btn active">1</button>
                        <button class="page-btn">2</button>
                        <button class="page-btn">3</button>
                        <button class="page-btn">4</button>
                        <button class="page-btn">5</button>
                        <button class="page-btn">▶</button>
                    </div>
                </div>
            </div>

            <!-- 상세조회 모달 -->
            <div id="emp-modal-wrap" class="org-modal-wrap">
                <div class="org-modal">
                    <div class="org-modal-header">
                        <h2>직원 정보</h2>
                        <button type="button" class="modal-close-btn" onclick="closeEmpModal()">✕</button>
                    </div>

                    <div class="org-modal-body">
                        <div class="org-detail-row">
                            <div class="org-detail-label">이름</div>
                            <div class="org-detail-value" id="modal-emp-name">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">사번</div>
                            <div class="org-detail-value" id="modal-emp-no">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">직급</div>
                            <div class="org-detail-value" id="modal-pos-name">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">소속</div>
                            <div class="org-detail-value" id="modal-org-name">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">연락처</div>
                            <div class="org-detail-value" id="modal-emp-phone">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">이메일</div>
                            <div class="org-detail-value" id="modal-emp-email">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">주소</div>
                            <div class="org-detail-value" id="modal-emp-address">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">입사일</div>
                            <div class="org-detail-value" id="modal-hire-date">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">퇴사일</div>
                            <div class="org-detail-value" id="modal-resign-date">-</div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">상태</div>
                            <div class="org-detail-value" id="modal-emp-status">-</div>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-mid" onclick="editEmpModal()">닫기</button>
                        <button type="button" class="btn btn-sm btn-mid" onclick="closeEmpModal()">닫기</button>
                    </div>
                </div>
            </div>

        </section>
    </main>
</div>

</body>
</html>