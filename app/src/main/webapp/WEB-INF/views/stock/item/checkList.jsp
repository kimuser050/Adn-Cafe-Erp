<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>반품 상태 조회 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/stock/item/check.css">
    <script defer src="/js/stock/check.js"></script>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/checkListSidebar.jsp" %>

        <div class="page-shell">
            <main class="page-content">
                
                <section id="list-section" class="panel" style="padding: 24px;">
                    <div class="header-box">
                        <h2>반품 검수 목록</h2>
                    </div>
                    
                    <div class="data-table-wrapper">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>상품명</th>
                                    <th>매장명</th>
                                    <th>신청자</th> <th>상태</th>
                                    <th>처리결과</th>
                                    <th>신청일</th>
                                </tr>
                            </thead>
                            <tbody id="list-body">
                                </tbody>
                        </table>
                    </div>
                    <div id="pagination" class="pagination-container" style="margin-top: 20px; display: flex; justify-content: center;"></div>
                </section>

                <section id="detail-section" class="panel" style="display: none; padding: 24px;">
                    <div class="header-box">
                        <button type="button" onclick="closeDetail()" class="btn btn-sm btn-outline">
                            ← 목록으로
                        </button>
                        <h2>반품 검수 상세</h2>
                    </div>
                    
                    <form id="check-form" class="check-container">
                        <input type="hidden" id="returnNo">
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>매장 명</label>
                                <input type="text" id="storeName" class="form-input input-readonly" readonly>
                            </div>
                            <div class="form-group">
                                <label>신청자 (사원)</label> <input type="text" id="empName" class="form-input input-readonly" readonly>
                            </div>
                            <div class="form-group">
                                <label>상품 명</label>
                                <input type="text" id="productName" class="form-input input-readonly" readonly>
                            </div>
                            <div class="form-group">
                                <label>수량</label>
                                <div class="num-box">
                                    <input type="number" id="quantity" class="form-input input-readonly" readonly>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>접수일</label>
                                <input type="text" id="createdAt" class="form-input input-readonly" readonly>
                            </div>
                            <div class="form-group">
                                <label>상태 처리</label>
                                <select id="status" class="form-select">
                                    <option value="W">대기</option>
                                    <option value="A">정상(승인)</option>
                                    <option value="R">비정상(반려)</option>
                                </select>
                            </div>
                            <div class="form-group full-width">
                                <label>사유</label>
                                <textarea id="reason" class="form-textarea input-readonly" readonly></textarea>
                            </div>
                        </div>
                        
                        <div class="btn-box">
                            <button type="button" onclick="saveCheck()" class="btn btn-md btn-dark">저장</button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    </div>
</body>
</html>