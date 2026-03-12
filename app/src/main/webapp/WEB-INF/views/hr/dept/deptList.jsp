<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>부서관리</title>

    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/hr/dept/deptList.css">
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content">

            
            <table>
    <thead>
        <tr>
            <th>NO</th>
            <th>부서명</th>
            <th>부서장</th>
            <th>인원수</th>
            <th>근무위치</th>
            <th>등록일</th>
            <th>상태</th>
        </tr>
    </thead>

    <tbody id="dept-list">
    </tbody>

</table>
        </section>
    </main>
</div>

</body>
</html>