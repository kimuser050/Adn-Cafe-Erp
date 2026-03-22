<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>부서관리</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
    <link rel="stylesheet" href="/css/hr/dept/deptList.css">

    <script defer src="/js/hr/dept/deptList.js"></script>
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/hr/common/orgSidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content org-page dept-page">

            <!-- 상단 탭 -->
            <div class="org-tab-area">
                <button type="button" class="tab-btn active">부서관리</button>
                <button type="button" class="tab-btn" onclick="location.href='/hr/store/list'">매장관리</button>
                <button type="button" class="tab-btn" onclick="location.href='/hr/pos/list'">직급관리</button>
            </div>

            <!-- 요약 카드 -->
            <div class="org-summary-area">
                <div class="summary-card">
                    <div class="summary-title">총 부서 수</div>
                    <div class="summary-value" id="dept-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">총 직원 수</div>
                    <div class="summary-value" id="member-count">0</div>
                </div>
            </div>

            <!-- 목록 카드 -->
            <div class="org-table-card">

                <!-- 툴바 -->
                <div class="org-toolbar">
                    <div class="toolbar-left"></div>

                    <div class="toolbar-right">
                        <select id="search-type" class="form-select search-select dept-search-select">
                            <option value="all">전체</option>
                            <option value="deptName">부서명</option>
                            <option value="useYn">사용여부</option>
                        </select>

                        <div class="search-box dept-search-box">
                            <input type="text" id="keyword" class="search-box-input" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn" id="search-btn" onclick="searchDept()">⌕</button>
                        </div>

                        <button type="button" class="btn btn-sm btn-dark">EXPORT</button>
                    </div>
                </div>

                <!-- 테이블 -->
                <table class="org-table dept-table">
                    <thead>
                    <tr>
                        <th>NO</th>
                        <th>부서명</th>
                        <th>관리자</th>
                        <th>인원수</th>
                        <th>근무위치</th>
                        <th>등록일</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody id="dept-list"></tbody>
                </table>

                <!-- 하단 -->
                <div class="org-bottom-area">
                
                        <div id="dept-pagination-area" class="pagination"></div>
         
                    <button type="button" class="btn btn-sm btn-mid register-btn" onclick="openInsertDeptModal()">
                        +부서등록
                    </button>
                </div>
            </div>

            <!-- 상세조회 모달 -->
            <div id="dept-modal-wrap" class="org-modal-wrap">
                <div class="org-modal">
                    <div class="org-modal-header">
                        <h2>부서정보</h2>
                        <button type="button" class="modal-close-btn" onclick="closeDeptModal()">✕</button>
                    </div>

                    <div class="org-modal-body">
                        <div class="dept-detail-grid">
                        <div class="org-detail-row">
                            <div class="org-detail-label">부서명</div>
                            <div class="org-detail-value" id="modal-dept-name"></div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">관리자</div>
                            <div class="org-detail-value">
                                <div id="manager-view-area" class="detail-inline-actions">
                                    <span id="modal-dept-manager" class="detail-inline-text"></span>
                                    <button type="button" class="btn btn-sm btn-mid detail-action-btn" onclick="startEditManager()">변경</button>
                                </div>

                                <div id="manager-edit-area" class="detail-inline-edit" style="display:none;">
                                    <select id="manager-select"></select>
                                    <button type="button" class="btn btn-sm btn-dark detail-action-btn" onclick="saveManager()">저장</button>
                                    <button type="button" class="btn btn-sm btn-outline detail-action-btn" onclick="cancelEditManager()">취소</button>
                                </div>
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">근무위치</div>
                            <div class="org-detail-value">
                                <div id="address-view-area" class="detail-inline-actions">
                                    <span id="modal-dept-address" class="detail-inline-text detail-inline-text-scroll"></span>
                                    <button type="button" class="btn btn-sm btn-mid detail-action-btn" onclick="startEditAddress()">변경</button>
                                </div>

                                <div id="address-edit-area" class="detail-inline-edit" style="display:none;">
                                    <input type="text" id="address-input">
                                    <button type="button" class="btn btn-sm btn-dark detail-action-btn" onclick="saveAddress()">저장</button>
                                    <button type="button" class="btn btn-sm btn-outline detail-action-btn" onclick="cancelEditAddress()">취소</button>
                                </div>
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">총 인원</div>
                            <div class="org-detail-value" id="modal-dept-emp"></div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">생성일</div>
                            <div class="org-detail-value" id="modal-created-at"></div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">상태</div>
                            <div class="org-detail-value">
                                <span id="modal-use-yn" class="status status-pending">미사용</span>
                            </div>
                        </div>
                        </div>
                        <hr>
                        <div class="dept-detail-section">
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
                    </div>

                    <div class="org-modal-footer">
                        <button type="button"  class="btn btn-sm btn-dark" id="toggle-use-btn" onclick="toggleDeptUseYn()"></button>
                        <button type="button" class="btn btn-sm btn-dark" onclick="closeDeptModal()">닫기</button>
                    </div>
                </div>
            </div>

            <!-- 등록 모달 -->
            <div id="dept-insert-modal-wrap" class="org-modal-wrap">
                <div class="org-modal" onclick="event.stopPropagation()">
                    <div class="org-modal-header">
                        <h2>부서등록</h2>
                        <button type="button" class="modal-close-btn" onclick="closeInsertDeptModal()">✕</button>
                    </div>

                    <div class="org-modal-body">
                        <div class="dept-insert-section">
                            <div class="dept-insert-grid">
                                <div class="org-detail-row">
                                    <div class="org-detail-label">부서코드</div>
                                    <div class="org-detail-value">
                                        <input type="text" id="insert-dept-code" placeholder="부서코드를 입력하세요">
                                    </div>
                                </div>

                                <div class="org-detail-row">
                                    <div class="org-detail-label">부서명</div>
                                    <div class="org-detail-value">
                                        <input type="text" id="insert-dept-name" placeholder="부서명을 입력하세요">
                                    </div>
                                </div>

                                <div class="org-detail-row">
                                    <div class="org-detail-label">근무위치</div>
                                    <div class="org-detail-value">
                                        <input type="text" id="insert-dept-address" placeholder="근무위치를 입력하세요">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-dark" onclick="insertDept()">등록</button>
                        <button type="button" class="btn btn-sm btn-dark" onclick="closeInsertDeptModal()">닫기</button>
                    </div>
                </div>
            </div>

        </section>
    </main>
</div>

</body>
</html>