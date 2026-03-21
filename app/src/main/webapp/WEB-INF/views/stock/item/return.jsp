<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>반품 신청 | Coffee Prince ERP</title>
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/stock/item/return.css"> 
    
    <script defer src="/js/stock/return.js"></script>
</head>
<body>
    <div class="app-shell">
        <%@ include file="/WEB-INF/views/stock/common/returnSidebar.jsp" %>

   <main class="page-shell">
            <section class="page-content">
                <div class="page-header">
                    <h2 class="page-title">반품 신청</h2>
                </div>

                <div class="return-form-container">
                    <form id="returnForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label>매장 명</label>
                                <input type="text" id="userDeptNameInput" readonly class="input-readonly" placeholder="매장 정보를 불러오는 중...">
                            </div>

                            <div class="form-group">
                                <label>수량</label>
                                <div class="qty-control">
                                    <button type="button" onclick="changeQty(1)">+</button>
                                    <input type="text" id="quantity" value="1" readonly>
                                    <button type="button" onclick="changeQty(-1)">-</button>
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>상품명</label>
                                <select id="itemNo" class="form-select">
                                    <option value="">상품을 선택하세요</option>
                                    </select>
                            </div>

                            <div class="form-group">
                                <label>접수일</label>
                                <input type="text" id="enrollDate" value="2026-03-22" readonly class="input-readonly">
                            </div>
                        </div>

                       <div class="form-group full-width">
                                <label>사유</label>
                                <textarea id="reason" placeholder="반품 사유를 입력해주세요" class="form-textarea"></textarea>
                            </div>

                        <div class="form-actions">
                            <button type="button" class="btn-submit" onclick="submitReturn()">신청하기</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    </div>
</body>
</html>