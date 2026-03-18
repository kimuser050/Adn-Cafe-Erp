<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>결재문서 작성</title>

    <script defer src="/js/approval/docDetail.js"></script>
    <link rel="stylesheet" href="/css/approval/docDetail.css">
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

                <input type="text" id="categoryNo" name="categoryNo" placeholder="categoryNo" readonly>
                <br>
                <input type="text" id="writerNo" name="writerNo" placeholder="writerNo">
                <br>
                <input type="text" id="title" name="title" placeholder="제목">
                <br>
                <input type="text" id="deptCode" name="deptCode" placeholder="참조부서">
                <br>
                <input type="text" id="approverNo" name="approverNo" placeholder="결재자">
                <br>
                <input type="date" id="startDate" name="startDate">
                <br>
                <input type="date" id="endDate" name="endDate" >
                <br>
                <input type="text" id="reason" name="reason" placeholder="사유">
                <br>
                <input type="file" id="attachment" name="attachment">
                <br>
                <textarea name="content" id="content" placeholder="내용"></textarea>
                <br>
                <input type="button" class="btn" onclick="insertDocument();" value="상신"></input>

                
        </section>
    </main>
</div>

</body>
</html>