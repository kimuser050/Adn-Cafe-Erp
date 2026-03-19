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

        <main class="main-content">
            <div class="return-title-tag">반품 신청</div>

            <div class="return-form-card">
                <div class="form-row">
                    <div class="input-group width-60">
                        <label>상품이름</label>
                        <select id="productName" class="form-control">
                            <option value="우유2L">우유2L</option>
                            <option value="원두커피">원두 커피</option>
                        </select>
                    </div>
                    <div class="input-group width-30 align-end">
                        <label class="label-right">수량</label>
                        <div class="qty-pill">
                            <button type="button" onclick="changeQty(1)">+</button>
                            <input type="text" id="quantity" value="1" readonly>
                            <button type="button" onclick="changeQty(-1)">-</button>
                        </div>
                    </div>
                </div>

                <div class="form-row middle-section">
                    <div class="input-group width-60">
                        <label>사유</label>
                        <textarea id="reason" class="form-textarea" placeholder="사유를 입력하세요"></textarea>
                    </div>
                    <div class="input-group width-30 date-box">
                        <label>접수일</label>
                        <input type="text" id="enrollDate" class="form-control text-center" value="2026-03-03" readonly>
                    </div>
                </div>

                <div class="form-row">
                    <div class="input-group width-60">
                        <label>매장이름</label>
                        <select id="storeCode" class="form-control">
                            <option value="강남지점">▲ &nbsp;&nbsp;&nbsp; 강남지점 &nbsp;&nbsp;&nbsp; ▼</option>
                        </select>
                    </div>
                    <div class="btn-group width-30">
                        <button type="button" class="btn-submit" onclick="submitReturn()">신청하기</button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>