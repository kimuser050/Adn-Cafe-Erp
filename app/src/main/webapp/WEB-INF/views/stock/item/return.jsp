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

        <main class="content-container">
            <div class="return-box">
                <div class="box-header">반품 신청</div>
                
                <form id="returnForm" class="return-grid">
                    <div class="column">
                        <div class="input-item">
                            <label>매장 명</label>
                            <input type="text" value="강남 지점" readonly class="readonly-input">
                            <input type="hidden" id="storeCode" value="S001"> 
                        </div>
                        
                        <div class="input-item">
                            <label>상품 명</label>
                            <input type="text" id="productName" value="원두 커피" placeholder="상품명을 입력하세요">
                        </div>
                        
                        <div class="input-item">
                            <label>사유</label>
                            <textarea id="reason" placeholder="내용을 입력하세요">맘에 안듬 걍 암튼 안들어요</textarea>
                        </div>
                    </div>

                    <div class="column">
                        <div class="input-item">
                            <label>수량</label>
                            <div class="qty-wrapper">
                                <button type="button" onclick="changeQty(-1)">-</button>
                                <input type="number" id="quantity" value="10" readonly>
                                <button type="button" onclick="changeQty(1)">+</button>
                            </div>
                        </div>

                        <div class="input-item">
                            <label>접수일</label>
                            <input type="text" id="enrollDate" value="2026-03-19" readonly class="readonly-input">
                        </div>

                        <div class="input-item">
                            <label>상태</label>
                            <select id="status">
                                <option value="W" selected>정상</option>
                                <option value="R">반품진행</option>
                                <option value="C">완료</option>
                            </select>
                        </div>
                    </div>

                    <div class="button-area">
                        <button type="button" class="btn-save" onclick="submitReturn()">저장</button>
                    </div>
                </form>
            </div>
        </main>
    </div>
</body>
</html>