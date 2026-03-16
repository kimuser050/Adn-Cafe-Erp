<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>부서관리</title>

    <script defer src="/js/approval/myDocList.js"></script>
    <link rel="stylesheet" href="/css/approval/myDocList.css">
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content">
            <!--  -->
            <div id="search-area">

            </div>

            <!-- 결재문서 테이블 -->
            <div id="document-table">
                <table>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>문서유형</th>
                            <th>제목</th>
                            <th>기안자</th>
                            <th>기안자 부서</th>
                            <th>상태</th>
                            <th>상신일</th>
                            <th>처리일</th>
                        </tr>
                    </thead>                        
                    <tbody id="document-list"></tbody>
                </table>
            </div>

            <div id=""></div>
        </section>
    </main>
</div>

</body>
</html>