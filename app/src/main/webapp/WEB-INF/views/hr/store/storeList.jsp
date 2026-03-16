<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>매장관리</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
    <link rel="stylesheet" href="/css/hr/store/storeList.css">

    <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=6f08b265dc5b763e1726860c9621049c&libraries=services"></script>

    <script defer src="/js/hr/store/storeList.js"></script>
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content org-page store-page">

            <!-- 상단 탭 -->
            <div class="org-tab-area">
                <button type="button" class="tab-btn" onclick="location.href='/hr/dept/list'">부서관리</button>
                <button type="button" class="tab-btn active">매장관리</button>
                <button type="button" class="tab-btn" onclick="location.href='/hr/pos/list'">직급관리</button>
            </div>

            <!-- 요약 카드 -->
            <div class="org-summary-area">
                <div class="summary-card">
                    <div class="summary-title">총 매장 수</div>
                    <div class="summary-value" id="total-store-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">운영매장</div>
                    <div class="summary-value" id="enable-store-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">휴업매장</div>
                    <div class="summary-value" id="rest-store-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">폐업매장</div>
                    <div class="summary-value" id="disable-store-count">0</div>
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
                            <option value="storeName">매장명</option>
                            <option value="statusName">상태</option>
                        </select>

                        <div class="search-box">
                            <input type="text" id="keyword" placeholder="검색어를 입력하세요">
                            <button type="button" class="btn btn-sm btn-mid" onclick="searchStore()">검색</button>
                        </div>

                        <button type="button" class="btn btn-sm btn-dark">EXPORT</button>
                    </div>
                </div>

                <!-- 테이블 -->
                <table class="org-table store-table">
                    <thead>
                    <tr>
                        <th>NO</th>
                        <th>매장명</th>
                        <th>담당자</th>
                        <th>매장위치</th>
                        <th>등록일</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody id="store-list"></tbody>
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

                    <button type="button" class="btn btn-sm btn-dark register-btn" onclick="openInsertStoreModal()">
                        매장등록
                    </button>
                </div>
            </div>

            <!-- 상세조회 모달 -->
            <div id="store-modal-wrap" class="org-modal-wrap">
                <div class="org-modal" onclick="event.stopPropagation()">
                    <div class="org-modal-header">
                        <h2>매장정보</h2>
                        <button type="button" class="modal-close-btn" onclick="closeStoreModal()">✕</button>
                    </div>

                    <div class="org-modal-body">
                        <div class="org-detail-row">
                            <div class="org-detail-label">매장명</div>
                            <div class="org-detail-value" id="modal-store-name"></div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">담당자</div>
                            <div class="org-detail-value">
                                <div id="manager-view-area">
                                    <span id="modal-store-manager"></span>
                                    <button type="button" class="btn btn-sm btn-mid" onclick="startEditManager()">변경</button>
                                </div>

                                <div id="manager-edit-area" class="inline-edit-area">
                                    <select id="manager-select" class="form-select"></select>
                                    <button type="button" class="btn btn-sm btn-dark" onclick="saveManager()">저장</button>
                                    <button type="button" class="btn btn-sm btn-outline" onclick="cancelEditManager()">취소</button>
                                </div>
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">매장위치</div>
                            <div class="org-detail-value">
                                <div id="address-view-area">
                                    <span id="modal-store-address"></span>
                                    <button type="button" class="btn btn-sm btn-mid" onclick="startEditAddress()">변경</button>
                                </div>

                                <div id="address-edit-area" class="inline-edit-area">
                                    <input type="text" class="form-input address-input" id="address-input" readonly>
                                    <button type="button" class="btn btn-sm btn-light" onclick="searchAddress()">주소검색</button>
                                    <button type="button" class="btn btn-sm btn-dark" onclick="saveAddress()">저장</button>
                                    <button type="button" class="btn btn-sm btn-outline" onclick="cancelEditAddress()">취소</button>
                                </div>
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">상태</div>
                            <div class="org-detail-value">
                                <div id="status-view-area">
                                    <span id="modal-store-status"></span>
                                    <button type="button" class="btn btn-sm btn-mid" onclick="startEditStatus()">변경</button>
                                </div>

                                <div id="status-edit-area" class="inline-edit-area">
                                    <select id="status-select" class="form-select">
                                        <option value="1">운영</option>
                                        <option value="2">휴업</option>
                                        <option value="3">폐업</option>
                                    </select>
                                    <button type="button" class="btn btn-sm btn-dark" onclick="saveStatus()">저장</button>
                                    <button type="button" class="btn btn-sm btn-outline" onclick="cancelEditStatus()">취소</button>
                                </div>
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">생성일</div>
                            <div class="org-detail-value" id="modal-created-at"></div>
                        </div>

                        <hr class="org-divider">

                        <h3 class="store-map-title">상세위치</h3>
                        <div id="store-map"></div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-dark" onclick="closeStoreModal()">닫기</button>
                    </div>
                </div>
            </div>

            <!-- 등록 모달 -->
            <div id="store-insert-modal-wrap" class="org-modal-wrap">
                <div class="org-modal" onclick="event.stopPropagation()">
                    <div class="org-modal-header">
                        <h2>매장등록</h2>
                        <button type="button" class="modal-close-btn" onclick="closeInsertStoreModal()">✕</button>
                    </div>

                    <div class="org-modal-body">
                        <div class="org-detail-row">
                            <div class="org-detail-label">매장코드</div>
                            <div class="org-detail-value">
                                <input type="text" class="form-input" id="insert-store-code" placeholder="매장코드를 입력하세요">
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">매장명</div>
                            <div class="org-detail-value">
                                <input type="text" class="form-input" id="insert-store-name" placeholder="매장명을 입력하세요">
                            </div>
                        </div>

                        <div class="org-detail-row">
                            <div class="org-detail-label">매장위치</div>
                            <div class="org-detail-value insert-address-row">
                                <input type="text" class="form-input" id="insert-store-address" readonly placeholder="주소검색 버튼을 눌러주세요">
                                <button type="button" class="btn btn-sm btn-light" onclick="searchInsertAddress()">주소검색</button>
                            </div>
                        </div>
                    </div>

                    <div class="org-modal-footer">
                        <button type="button" class="btn btn-sm btn-dark" onclick="insertStore()">등록</button>
                        <button type="button" class="btn btn-sm btn-outline" onclick="closeInsertStoreModal()">닫기</button>
                    </div>
                </div>
            </div>

        </section>
    </main>
</div>

</body>
</html>