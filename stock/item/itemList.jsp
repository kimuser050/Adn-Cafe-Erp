<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>품목관리 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/stock/item/main.css">
    <script defer src="/js/stock/item.js"></script>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/itemSidebar.jsp" %>

        <main class="page-shell">
            <div class="tab-wrapper">
                <a href="/stock/item" class="tab-btn active">관리 품목</a>
                <a href="/stock/inbound" class="tab-btn">입고 내역</a>
            </div>

            <div class="content-container panel">
                
                <div class="search-section">
                    <div class="search-inner">
                        <select class="form-select search-select" id="searchType">
                            <option value="name">상품명</option>
                            <option value="no">상품번호</option>
                        </select>
                        
                        <div class="search-box">
                            <input type="text" id="productName" class="search-box-input" placeholder="검색어를 입력하세요" onkeyup="if(window.event.keyCode==13){searchItems()}">
                            <button type="button" class="search-btn" onclick="searchItems()">⌕</button>
                        </div>
                    </div>
                    
                    <div class="action-inner">
                        <button type="button" class="btn btn-md btn-dark" onclick="openInsertModal()">+ 신규 품목 등록</button>
                    </div>
                </div>

                <div class="table-wrapper">
                    <table class="item-table">
                        <thead>
                            <tr>
                                <th style="width: 80px;">번호</th>
                                <th>이름</th>
                                <th>단가</th>
                                <th>등록일</th>
                                <th>재고</th>
                                <th>위치</th>
                                <th style="width: 120px;">상태</th>
                            </tr>
                        </thead>
                        <tbody id="itemList">
                            </tbody>
                    </table>
                </div>

                <div id="paginationArea" class="pagination-wrapper">
                </div>
            </div>
        </main>
    </div>

    <div id="itemDetailModal" class="modal">
        <div class="modal-content card">
            <div class="modal-header">
                <h3>품목 상세 정보</h3>
                <span class="close-modal">&times;</span>
            </div>
            <form id="itemDetailForm">
                <input type="hidden" id="modalItemNo">
                <div class="modal-body">
                    <div class="form-row">
                        <label>품목 명</label>
                        <input type="text" id="modalItemName" class="form-input">
                    </div>
                    <div class="form-row">
                        <label>단가</label>
                        <input type="number" id="modalUnitPrice" class="form-input">
                    </div>
                    <div class="form-row">
                        <label>재고</label>
                        <input type="number" id="modalStock" class="form-input">
                    </div>
                    <div class="form-row">
                        <label>위치</label>
                        <input type="text" id="modalLocation" class="form-input">
                    </div>
                    <div class="form-row">
                        <label>상태</label>
                        <select id="modalActiveYn" class="form-select">
                            <option value="Y">활성 (Y)</option>
                            <option value="N">비활성 (N)</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-md btn-dark" onclick="updateItem()">저장하기</button>
                    <button type="button" class="btn btn-md btn-outline btn-gray-close-modal">닫기</button>
                </div>
            </form>
        </div>
    </div>

    <div id="itemInsertModal" class="modal">
        <div class="modal-content card">
            <div class="modal-header">
                <h3>신규 품목 등록</h3>
                <span class="close-insert-modal" style="cursor:pointer; font-size:24px;">&times;</span>
            </div>
            <form id="itemInsertForm">
                <div class="modal-body">
                    <div class="form-row">
                        <label>품목 명</label>
                        <input type="text" id="insertItemName" class="form-input">
                    </div>
                    <div class="form-row">
                        <label>단가</label>
                        <input type="number" id="insertUnitPrice" class="form-input" value="0">
                    </div>
                    <div class="form-row">
                        <label>초기 재고</label>
                        <input type="number" id="insertStock" class="form-input" value="0">
                    </div>
                    <div class="form-row">
                        <label>위치</label>
                        <input type="text" id="insertLocation" class="form-input" placeholder="예: A-101">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-md btn-dark" onclick="insertItem()">등록하기</button>
                    <button type="button" class="btn btn-md btn-outline close-insert-modal">취소</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>