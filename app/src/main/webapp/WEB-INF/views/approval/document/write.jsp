<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>결재문서 작성</title>

    <script defer src="/js/approval/write.js"></script>
    <link rel="stylesheet" href="/css/approval/write.css">
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
            <div class="form-row">
                <div class="form-label">
                    <strong>카테고리 번호</strong>
                </div>
                <div class="form-content">
                    <input type="text" id="categoryNo" name="categoryNo" placeholder="categoryNo">
                </div>
            </div>
            <div class="form-row">
                <div class="form-label">
                    <strong>기안자</strong>
                </div>
                <div class="form-content">
                    <input type="text" id="writerNo" name="writerNo" placeholder="writerNo">
                </div>
                
            </div>
            <div class="form-row">
                <div class="form-label">
                    <strong>제목</strong>
                </div>
                <div class="form-content">
                    <input type="text" id="title" name="title" placeholder="제목">
                </div>
                
            </div>
            <div class="form-row">
                <div class="form-label">
                    <strong>참조부서</strong>
                </div>
                <div class="form-content">
                    <input type="text" id="deptCode" name="deptCode" placeholder="참조부서">
                </div>
                
            </div>
            <div class="form-row">
                <div class="form-label">
                    <strong>결재자</strong>
                </div>
                <div class="form-content">
                    <input type="text" id="approverNo" name="approverNo" placeholder="결재자">
                </div>
                
            </div>
            <div class="form-row">
                <div class="form-label">
                    <strong>시작일 - 종료일</strong>
                </div>
                <div class="form-content">
                    <input type="date" id="startDate" name="startDate">
                    <input type="date" id="endDate" name="endDate" >
                </div>
                
            </div>
            <div class="form-row">
                <div class="form-label">
                    <strong>사유</strong>
                </div>
                <div class="form-content">
                    <input type="text" id="reason" name="reason" placeholder="사유">
                </div>
                
            </div>
            <div class="form-row">
                <div class="form-label">
                    <strong>첨부파일</strong>
                </div>
                <div class="form-content">
                    <input type="file" id="attachment" name="attachment">
                </div>
                
            </div>
            <div class="form-row">
                <div class="form-label">
                    <strong>내용</strong>
                </div>
                <div class="form-content">
                    <textarea name="content" id="content" placeholder="내용"></textarea>
                </div>


                
            </div>
                <input type="button" class="btn" onclick="insertDocument();" value="상신"></input>
            
        </section>
    </main>
</div>

</body>
</html>