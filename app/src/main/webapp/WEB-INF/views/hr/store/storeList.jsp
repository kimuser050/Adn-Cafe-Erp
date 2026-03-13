<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>부서관리</title>

    <!-- css 공용과 js 연결하기 -->
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/hr/dept/deptList.css">

    <script defer src="/js/hr/store/storeList.js"></script>
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content dept-page">

            <!-- 상단 탭 -->
            <div class="dept-tab-area">
                <button type="button" class="tab-btn" onclick="location.href='/hr/dept/list'">부서관리</button>
                <button type="button" class="tab-btn active">매장관리</button>
                <button type="button" class="tab-btn" onclick="location.href='/hr/pos/list'">직급관리</button>
            </div>

            <!-- 요약 카드 -->
            <div class="dept-summary-area">
                <div class="summary-card">
                    <div class="summary-title">총 부서 수</div>
                    <div class="summary-value" id="dept-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">총 직원 수</div>
                    <div class="summary-value" id="member-count">0</div>
                </div>
            </div>

            <!-- 테이블 카드 -->
            <div class="dept-table-card">

                <!-- 툴바 -->
                <div class="dept-toolbar">
                    <div class="toolbar-left"></div>

                    <div class="toolbar-right">
                        <select id="sort-select">
                            <option value="deptCode">부서명</option>
                            <option value="createdAt">상태</option>
                        </select>

                        <div class="search-box">
                            <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn">검색</button>
                        </div>

                        <button type="button" class="export-btn">EXPORT</button>
                    </div>
                </div>

                <!-- 테이블 -->
                <table class="dept-table">
                    <thead>
                    <tr>
                        <th>NO</th>
                        <th>부서명</th>
                        <th>부서장</th>
                        <th>인원수</th>
                        <th>근무위치</th>
                        <th>등록일</th>
                        <th>상태</th>
                    </tr>
                    </thead>

                    <tbody id="dept-list"></tbody>
                </table>

                <!-- 하단(페이징 전) -->
                <div class="dept-bottom-area">
                    <div class="pagination">
                        <button class="page-btn active">1</button>
                        <button class="page-btn">2</button>
                        <button class="page-btn">3</button>
                        <button class="page-btn">4</button>
                        <button class="page-btn">5</button>
                        <button class="page-btn">▶</button>
                    </div>

                    <button type="button" class="register-btn" onclick="openInsertDeptModal()">
                        부서등록
                    </button>
                </div>

            </div>


<!-- (상세조회) 모달--------------------------------------------------------------------------------- -->
<div id="dept-modal-wrap" class="dept-modal-wrap">
    <div class="dept-modal">
        <div class="dept-modal-header">
            <h2>부서정보</h2>
            <button type="button" class="modal-close-btn" onclick="closeDeptModal()">✕</button>
        </div>

        <!-- 모달안의 정보 -->
        <div class="dept-modal-body">
            <div class="dept-detail-row">
                <div class="dept-detail-label">부서명</div>
                <div class="dept-detail-value" id="modal-dept-name"></div>
            </div>

            <!-- 관리자 조회 OR 수정상태에 따라 -->
            <div class="dept-detail-row">
                <div class="dept-detail-label">관리자</div>

                <div class="dept-detail-value">
                    <!-- 조회 상태 -->
                    <div id="manager-view-area">
                        <span id="modal-dept-manager"></span>
                        <button type="button" onclick="startEditManager()">변경</button>
                    </div>

                    <!-- 수정 상태 -->
                    <div id="manager-edit-area" style="display:none;">
                        <select id="manager-select"></select>
                        <button type="button" onclick="saveManager()">V</button>
                        <button type="button" onclick="cancelEditManager()">X</button>
                    </div>
                </div>
            </div>

            <!-- 근무위치 조회 OR 수정 상태에 따라 -->
            <div class="dept-detail-row">
                <div class="dept-detail-label">근무위치</div>

                <div class="dept-detail-value">
                    <!-- 조회 상태 -->
                    <div id="address-view-area">
                        <span id="modal-dept-address"></span>
                        <button type="button" onclick="startEditAddress()">연필</button>
                    </div>

                    <!-- 수정 상태 -->
                    <div id="address-edit-area" style="display:none;">
                        <input type="text" id="address-input">
                        <button type="button" onclick="saveAddress()">V</button>
                        <button type="button" onclick="cancelEditAddress()">X</button>
                    </div>
                </div>
            </div>

            <div class="dept-detail-row">
                <div class="dept-detail-label">총 인원</div>
                <div class="dept-detail-value" id="modal-dept-emp"></div>
            </div>

            <div class="dept-detail-row">
                <div class="dept-detail-label">생성일</div>
                <div class="dept-detail-value" id="modal-created-at"></div>
            </div>

            <div class="dept-detail-row">
                <div class="dept-detail-label">상태</div>
                <div class="dept-detail-value" id="modal-use-yn"></div>
            </div>

            <hr>

            <h3>소속인원</h3>
            <table class="dept-member-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>이름</th>
                    <th>직급</th>
                    <th>사번</th>
                    <th>전화번호</th>
                    <th>입사일</th>
                </tr>
                </thead>
                <tbody id="modal-member-list"></tbody>
            </table>
        </div>

        <div class="dept-modal-footer">
    <button type="button" id="toggle-use-btn" onclick="toggleDeptUseYn()"></button>
    <button type="button" class="modal-btn" onclick="closeDeptModal()">닫기</button>
    
</div>
    </div>
</div>

<!-- (부서등록) 모달--------------------------------------------------------------------------------- -->
<div id="dept-insert-modal-wrap" class="dept-modal-wrap">
    <div class="dept-modal" onclick="event.stopPropagation()">
        <div class="dept-modal-header">
            <h2>부서등록</h2>
            <button type="button" class="modal-close-btn" onclick="closeInsertDeptModal()">✕</button>
        </div>

        <div class="dept-modal-body">
            <div class="dept-detail-row">
                <div class="dept-detail-label">부서코드</div>
                <div class="dept-detail-value">
                    <input type="text" id="insert-dept-code" placeholder="부서코드를 입력하세요">
                </div>
            </div>

            <div class="dept-detail-row">
                <div class="dept-detail-label">부서명</div>
                <div class="dept-detail-value">
                    <input type="text" id="insert-dept-name" placeholder="부서명을 입력하세요">
                </div>
            </div>

            <div class="dept-detail-row">
                <div class="dept-detail-label">근무위치</div>
                <div class="dept-detail-value">
                    <input type="text" id="insert-dept-address" placeholder="근무위치를 입력하세요">
                </div>
            </div>
        </div>

        <div class="dept-modal-footer">
            <button type="button" class="modal-btn" onclick="insertDept()">등록</button>
            <button type="button" class="modal-btn" onclick="closeInsertDeptModal()">닫기</button>
        </div>
    </div>
</div>


        </section>
    </main>
</div>

</body>
</html>