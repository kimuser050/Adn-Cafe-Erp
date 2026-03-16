<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>직급관리</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/hr/pos/posList.css">

    <!-- 직급관리 JS -->
    <script defer src="/js/hr/pos/posList.js"></script>
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content pos-page">

            <!-- 상단 탭 -->
            <div class="pos-tab-area">
                <button type="button" class="tab-btn" onclick="location.href='/hr/dept/list'">부서관리</button>
                <button type="button" class="tab-btn" onclick="location.href='/hr/store/list'">직급관리</button>
                <button type="button" class="tab-btn active">직급관리</button>
            </div>

            <!-- 요약 카드 -->
            <div class="pos-summary-area">
                <div class="summary-card">
                    <div class="summary-title">총 직급 수</div>
                    <div class="summary-value" id="total-pos-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">사용 중 직급</div>
                    <div class="summary-value" id="enable-pos-count">0</div>
                </div>

                
            </div>

            <!-- 목록 카드 -->
            <div class="pos-table-card">

                <!-- 툴바 -->
                <div class="pos-toolbar">
                    <div class="toolbar-left"></div>

                    <div class="toolbar-right">
                        <select id="sort-select">
                            <option value="posName">직급명</option>
                            <option value="statusCode">상태</option>
                        </select>

                        <div class="search-box">
                            <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                            <button type="button" class="search-btn">검색</button>
                        </div>

                        <button type="button" class="export-btn">EXPORT</button>
                    </div>
                </div>

                <!-- 테이블 -->
                <table class="pos-table">
                    <thead>
                    <tr>
                        <th>NO</th>
                        <th>직급명</th>
                        <th>기본급</th>
                        <th>보너스율</th>
                        <th>예상월급</th>
                        <th>등록일</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody id="pos-list"></tbody>
                </table>

                <!-- 하단 -->
                <div class="pos-bottom-area">
                    <div class="pagination">
                        <button class="page-btn active">1</button>
                        <button class="page-btn">2</button>
                        <button class="page-btn">3</button>
                        <button class="page-btn">4</button>
                        <button class="page-btn">5</button>
                        <button class="page-btn">▶</button>
                    </div>

                    <button type="button" class="register-btn" onclick="openInsertPosModal()">
                        직급등록
                    </button>
                </div>
            </div>

            <!-- 상세조회 모달 -->
            <div id="pos-modal-wrap" class="pos-modal-wrap">
                <div class="pos-modal" onclick="event.stopPropagation()">
                    <div class="pos-modal-header">
                        <h2>직급정보</h2>
                        <button type="button" class="modal-close-btn" onclick="closePosModal()">✕</button>
                    </div>

                    <div class="pos-modal-body">
                        <div class="pos-detail-row">
                            <div class="pos-detail-label">직급명</div>
                            <div class="pos-detail-value" id="modal-pos-name"></div>
                        </div>

                        <div class="pos-detail-row">
                            <div class="pos-detail-label">기본급</div>
                            <div class="pos-detail-value">
                                <div id="manager-view-area">
                                    <span id="modal-pos-BaseSalary"></span>
                                    <button type="button" class="inline-edit-btn" onclick="startEditBaseSalary()">변경</button>
                                </div>
                                <div id="BaseSalary-edit-area" class="inline-edit-area">
                                    <button type="button" class="inline-save-btn" onclick="saveBaseSalary()">V</button>
                                    <button type="button" class="inline-cancel-btn" onclick="cancelEditBaseSalary()">X</button>
                                </div>
                            </div>
                        </div>

                        <div class="pos-detail-row">
                            <div class="pos-detail-label">보너스율</div>
                            <div class="pos-detail-value">
                                <div id="address-view-area">
                                    <span id="modal-pos-address"></span>
                                    <button type="button" class="inline-edit-btn" onclick="startEditAddress()">변경</button>
                                </div>

                                <div id="address-edit-area" class="inline-edit-area">
                                    <input type="text" id="address-input" readonly>
                                    <button type="button" class="inline-search-btn" onclick="searchAddress()">주소검색</button>
                                    <button type="button" class="inline-save-btn" onclick="saveAddress()">V</button>
                                    <button type="button" class="inline-cancel-btn" onclick="cancelEditAddress()">X</button>
                                </div>
                            </div>
                        </div>

                        <div class="pos-detail-row">
                            <div class="pos-detail-label">상태</div>
                            <div class="pos-detail-value">
                                <div id="status-view-area">
                                    <span id="modal-pos-status"></span>
                                    <button type="button" class="inline-edit-btn" onclick="startEditStatus()">변경</button>
                                </div>

                                <div id="status-edit-area" class="inline-edit-area">
                                    <select id="status-select">
                                        <option value="1">운영</option>
                                        <option value="2">휴업</option>
                                        <option value="3">폐업</option>
                                    </select>
                                    <button type="button" class="inline-save-btn" onclick="saveStatus()">V</button>
                                    <button type="button" class="inline-cancel-btn" onclick="cancelEditStatus()">X</button>
                                </div>
                            </div>
                        </div>

                        <div class="pos-detail-row">
                            <div class="pos-detail-label">생성일</div>
                            <div class="pos-detail-value" id="modal-created-at"></div>
                        </div>

                        <hr class="pos-divider">

                        <h3 class="pos-map-title">상세위치</h3>
                        <div id="pos-map"></div>
                    </div>

                    <div class="pos-modal-footer">
                        <button type="button" class="modal-btn" onclick="closeposModal()">닫기</button>
                    </div>
                </div>
            </div>

            <!-- 등록 모달 -->
            <div id="pos-insert-modal-wrap" class="pos-modal-wrap">
                <div class="pos-modal" onclick="event.stopPropagation()">
                    <div class="pos-modal-header">
                        <h2>직급등록</h2>
                        <button type="button" class="modal-close-btn" onclick="closeInsertposModal()">✕</button>
                    </div>

                    <div class="pos-modal-body">
                        <div class="pos-detail-row">
                            <div class="pos-detail-label">직급코드</div>
                            <div class="pos-detail-value">
                                <input type="text" id="insert-pos-code" placeholder="직급코드를 입력하세요">
                            </div>
                        </div>

                        <div class="pos-detail-row">
                            <div class="pos-detail-label">직급명</div>
                            <div class="pos-detail-value">
                                <input type="text" id="insert-pos-name" placeholder="직급명을 입력하세요">
                            </div>
                        </div>

                        <div class="pos-detail-row">
                            <div class="pos-detail-label">직급위치</div>
                            <div class="pos-detail-value insert-address-row">
                                <input type="text" id="insert-pos-address" readonly placeholder="주소검색 버튼을 눌러주세요">
                                <button type="button" class="inline-search-btn" onclick="searchInsertAddress()">주소검색</button>
                            </div>
                        </div>
                    </div>

                    <div class="pos-modal-footer">
                        <button type="button" class="modal-btn" onclick="insertPos()">등록</button>
                        <button type="button" class="modal-btn modal-btn-secondary" onclick="closeInsertPosModal()">닫기</button>
                    </div>
                </div>
            </div>

        </section>
    </main>
</div>

</body>
</html>