<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>부서관리</title>

    <script defer src="/js/approval/approverDocList.js"></script>
    <link rel="stylesheet" href="/css/approval/approverDocList.css">
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
            <!-- 검색바 -->
            <div id="search-area">
                <form id="search-form">
                    <select name="statusCode" class="form-select" id="statusCode">
                        <option value="">전체</option>
                        <option value="1">대기</option>
                        <option value="2">승인</option>
                        <option value="3">반려</option>
                    </select>
                    
                    <select name="category" class="form-select" id="categoryNo">
                        <option value="">전체</option>
                        <option value="1">휴가</option>
                        <option value="2">연장근무</option>
                    </select>
                    
                    <input type="text" name="docNo" id="docNo" class="form-input" placeholder="문서번호">

                    <input type="date" name="startDate" id="startDate" class="form-input">
                    <input type="date" name="endDate" id="endDate" class="form-input">

                    <button type="button" class="btn" onclick="searchDoc();">검색</button>
                </form>
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
                            <th>결재자</th>
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