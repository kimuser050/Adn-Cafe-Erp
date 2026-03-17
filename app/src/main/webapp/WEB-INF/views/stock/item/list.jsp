<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>품목</title>


        <script defer src="/js/stock/item.js"></script>

        <link rel="stylesheet" href="/css/approval/write.css">
        <link rel="stylesheet" href="/css/common/reset.css">
        <link rel="stylesheet" href="/css/common/layout.css">
        <link rel="stylesheet" href="/css/common/sidebar.css">
        <link rel="stylesheet" href="/css/common/component.css">
        <link rel="stylesheet" href="/css/hr/dept/deptList.css">
        <link rel="stylesheet" href="/css/stock/item/main.css">
    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/stock/common/itemSidebar.jsp" %>

                <main class="page-shell">
                    <section class="page-content">
                        <div class="tab-container">
                            <button class="tab-btn active">본사 품목</button>
                            <button class="tab-btn">입고 내역</button>
                            <button class="tab-btn">출고 내역</button>
                        </div>

                        <div class="content-card">
                            <div class="search-bar">
                                <label for="productName">상품 명</label>
                                <input type="text" id="productName" name="productName">
                                <button type="button" class="btn-search">검색</button>
                            </div>

                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>번호</th>
                                        <th>이름</th>
                                        <th>단가</th>
                                        <th>재고</th>
                                        <th>위치</th>
                                        <th>활성화 여부</th>
                                    </tr>
                                </thead>
                                <tbody id="itemList">

                                </tbody>
                            </table>
                        </div>

                        <div class="action-buttons">
                            <button type="button" class="btn-dark">등록</button>
                            <button type="button" class="btn-dark">수정</button>
                            <button type="button" class="btn-dark">삭제</button>
                        </div>
                    </section>
                </main>
        </div>
    </body>

    </html>