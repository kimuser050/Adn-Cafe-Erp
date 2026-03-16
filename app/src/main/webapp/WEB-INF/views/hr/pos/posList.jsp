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
    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
    <link rel="stylesheet" href="/css/hr/pos/posList.css">

    <script defer src="/js/hr/pos/posList.js"></script>
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content org-page pos-page">

            <!-- 상단 탭 -->
            <div class="org-tab-area">
                <button type="button" class="tab-btn" onclick="location.href='/hr/dept/list'">부서관리</button>
                <button type="button" class="tab-btn" onclick="location.href='/hr/store/list'">매장관리</button>
                <button type="button" class="tab-btn active">직급관리</button>
            </div>

            <!-- 요약 카드 -->
            <div class="org-summary-area">
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
            <div class="org-table-card">

                <!-- 툴바 -->
                <div class="org-toolbar">
                    <div class="toolbar-left"></div>

                    <div class="toolbar-right">
                        <select id="search-type" class="form-select">
                            <option value="all">전체</option>
                            <option value="posName">직급명</option>
                            <option value="useYn">사용여부</option>
                        </select>

                        <div class="search-box">
                            <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                            <button type="button" class="btn btn-sm btn-mid" onclick="searchPos()">검색</button>
                        </div>

                        <button type="button" class="btn btn-sm btn-dark">EXPORT</button>
                    </div>
                </div>

                <!-- 테이블 -->
                <table class="org-table pos-table">
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
                <div class="org-bottom-area">
                    <div class="pagination">
                        <button class="page-btn active">1</button>
                        <button class="page-btn">2</button>
                        <button class="page-btn">3</button>
                        <button class="page-btn">4</button>
                        <button class="page-btn">5</button>
                        <button class="page-btn">▶</button>
                    </div>

                    <button type="button" class="btn btn-sm btn-dark register-btn" onclick="openInsertPosModal()">
                        직급등록
                    </button>
                </div>
            </div>

            <!-- 상세조회 모달 -->
            <div id="pos-modal-wrap" class="org-modal-wrap">
                <div class="org-modal" onclick="event.stopPropagation()">
                    <div class="org-modal-header">
                        <h2>직급정보</h2>
                        <button type="button" class="modal-close-btn" onclick="closePosModal()">✕</button>
                    </div>

                    <div class="org-modal-body">
                        <div class="org-detail-row">
                            <div class="org-detail-label">직급명</div>
                            <div class="org-detail-value" id="modal-pos-name"></div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">기본급</div>
                            <div class="org-detail-value">

                                <div id="baseSalary-view-area">
                                    <span id="modal-pos-baseSalary"></span>
                                    <button type="button" class="btn btn-sm btn-mid" onclick="startEditBaseSalary()">변경</button>
                                </div>

                                <div id="baseSalary-edit-area" style="display:none;">
                                    <input type="text" id="baseSalary-input">
                                    <button type="button" class="btn btn-sm btn-dark" onclick="saveBaseSalary()">저장</button>
                                    <button type="button" class="btn btn-sm btn-outline" onclick="cancelEditBaseSalary()">취소</button>
                                </div>

                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">보너스율</div>
                            <div class="org-detail-value">

                                <div id="bonusRate-view-area">
                                    <span id="modal-pos-bonusRate"></span>
                                    <button type="button" class="btn btn-sm btn-mid" onclick="startEditBonusRate()">변경</button>
                                </div>

                                <div id="bonusRate-edit-area" style="display:none;">
                                    <input type="text" id="bonusRate-input">
                                    <button type="button" class="btn btn-sm btn-dark" onclick="saveBonusRate()">저장</button>
                                    <button type="button" class="btn btn-sm btn-outline" onclick="cancelEditBonusRate()">취소</button>
                                </div>

                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">예상월급</div>
                            <div class="org-detail-value" id="modal-pos-expectedSalary"></div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">생성일</div>
                            <div class="org-detail-value" id="modal-created-at"></div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">사용여부</div>
                            <div class="org-detail-value">
                                <span id="modal-pos-status"></span>
                            </div>
                        </div>

                        <hr class="org-divider">

                        <div class="member-box">
                            <div class="member-box-title">소속인원</div>
                            <table class="member-table">
                                <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>이름</th>
                                    <th>부서</th>
                                    <th>전화번호</th>
                                    <th>입사일</th>
                                </tr>
                                </thead>
                                <tbody id="modal-member-list"></tbody>
                            </table>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-dark" id="toggle-use-btn" onclick="togglePosUseYn()">비활성화</button>
                        <button type="button" class="btn btn-sm btn-dark" onclick="closePosModal()">닫기</button>
                    </div>
                </div>
            </div>

            <!-- 등록 모달 -->
            <div id="pos-insert-modal-wrap" class="org-modal-wrap">
                <div class="org-modal" onclick="event.stopPropagation()">
                    <div class="org-modal-header">
                        <h2>직급등록</h2>
                        <button type="button" class="modal-close-btn" onclick="closeInsertPosModal()">✕</button>
                    </div>

                    <div class="org-modal-body">
                        <div class="org-detail-row">
                            <div class="org-detail-label">직급명</div>
                            <div class="org-detail-value">
                                <input type="text" class="form-input" id="insert-pos-name" placeholder="직급명을 입력하세요">
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">직급코드</div>
                            <div class="org-detail-value">
                                <input type="text" class="form-input" id="insert-pos-code" placeholder="직급코드를 입력하세요">
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">기본급</div>
                            <div class="org-detail-value">
                                <input type="text" class="form-input" id="insert-pos-baseSalary" placeholder="기본급을 입력하세요">
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">보너스율</div>
                            <div class="org-detail-value">
                                <input type="text" class="form-input" id="insert-pos-bonusRate" placeholder="보너스율을 입력하세요">
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">직급설명</div>
                            <div class="org-detail-value">
                                <input type="text" class="form-input" id="insert-pos-desc" placeholder="직급설명을 입력하세요">
                            </div>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-dark" onclick="insertPos()">등록</button>
                        <button type="button" class="btn btn-sm btn-outline" onclick="closeInsertPosModal()">닫기</button>
                    </div>
                </div>
            </div>

        </section>
    </main>
</div>

</body>
</html>