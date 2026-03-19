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
    <div class="return-container">
        <div class="return-title-tag">반품 신청</div>

        <div class="return-form-card">
            
            <div class="form-row">
                <div class="input-group-row">
                    <label>상품이름</label>
                    <div class="input-wrap">
                        <select id="productName" class="form-control">
                            <option value="우유2L">우유2L</option>
                            <option value="원두커피">원두 커피</option>
                        </select>
                    </div>
                </div>
                <div class="input-group-row label-left">
                    <label>수량</label>
                    <div class="input-wrap">
                        <div class="qty-pill">
                            <button type="button" onclick="changeQty(1)">+</button>
                            <input type="text" id="quantity" value="1" readonly>
                            <button type="button" onclick="changeQty(-1)">-</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-row align-top">
                <div class="input-group-row vertical-stack">
                    <label>사유</label>
                    <div class="textarea-wrap">
                        <textarea id="reason" class="form-textarea"></textarea>
                    </div>
                </div>
                <div class="input-group-row vertical-stack label-left">
                    <label>접수일</label>
                    <div class="input-wrap date-box">
                        <input type="text" id="enrollDate" class="form-control text-center date-input" value="2026-03-03" readonly>
                    </div>
                </div>
            </div>

            <div class="form-row full-width">
                <div class="input-group-row full-width">
                    <label>매장이름</label>
                    <div class="input-wrap">
                        <select id="storeCode" class="form-control store-select">
                            <option value="강남지점">▲ &nbsp;&nbsp;&nbsp; 강남지점 &nbsp;&nbsp;&nbsp; ▼</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-row button-row">
                <div class="btn-container">
                    <button type="button" class="btn-submit" onclick="submitReturn()">신청하기</button>
                </div>
            </div>

        </div> </div> </main>
    </div>
</body>
</html>