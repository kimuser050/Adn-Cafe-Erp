<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>결재문서 작성</title>

    <script defer src="/js/approval/docEdit.js"></script>
    <link rel="stylesheet" href="/css/approval/docEdit.css">
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content">
            <div class="approval-edit-wrap">
    <input type="hidden" id="docNo" value="${docNo}">
    <input type="hidden" id="categoryNo">
    <input type="hidden" id="referenceDeptCode">
    <input type="hidden" id="approverNo">

    <table class="approval-edit-table">
        <tr>
            <th>제목</th>
            <td>
                <input type="text" id="title" class="full-input">
            </td>
        </tr>

        <tr>
            <th>참조부서</th>
            <td>
                <div class="row-flex">
                    <input type="text" id="referenceDeptName" class="search-input" readonly>
                    <button type="button" class="search-btn" onclick="openDeptModal()">찾기</button>
                </div>
            </td>
        </tr>

        <tr>
            <th>결재자</th>
            <td>
                <div class="row-flex">
                    <input type="text" id="approverName" class="search-input" readonly>
                    <button type="button" class="search-btn" onclick="openApproverModal()">찾기</button>
                </div>
            </td>
        </tr>

        <tr id="vacation-date-row">
            <th>시작일 - 종료일</th>
            <td>
                <div class="row-flex date-row">
                    <input type="date" id="startDate">
                    <span>~</span>
                    <input type="date" id="endDate">
                </div>
            </td>
        </tr>

        <tr id="overtime-hour-row" class="hidden">
            <th>근무시간</th>
            <td>
                <select id="workHour">
                    <option value="">선택</option>
                    <option value="2">2시간</option>
                    <option value="4">4시간</option>
                </select>
            </td>
        </tr>

        <tr>
            <th>내용</th>
            <td>
                <textarea id="content" class="content-area"></textarea>
            </td>
        </tr>
    </table>

    <div class="btn-area">
        <button type="button" class="submit-btn" onclick="updateDoc()">수정완료</button>
        <button type="button" class="cancel-btn" onclick="history.back()">취소</button>
    </div>
</div>

<!-- 참조부서 선택 모달 -->
<div id="deptModal" class="modal hidden">
    <div class="modal-overlay" onclick="closeDeptModal()"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3>참조부서 선택</h3>
            <button type="button" class="modal-close" onclick="closeDeptModal()">×</button>
        </div>

        <div class="modal-body">
            <table class="modal-table">
                <thead>
                    <tr>
                        <th>부서명</th>
                        <th>선택</th>
                    </tr>
                </thead>
                <tbody id="deptTbody">
                    <tr>
                        <td>인사부</td>
                        <td><button type="button" onclick="selectDept('인사부')">선택</button></td>
                    </tr>
                    <tr>
                        <td>총무부</td>
                        <td><button type="button" onclick="selectDept('총무부')">선택</button></td>
                    </tr>
                    <tr>
                        <td>재무부</td>
                        <td><button type="button" onclick="selectDept('재무부')">선택</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- 결재자 선택 모달 -->
<div id="approverModal" class="modal hidden">
    <div class="modal-overlay" onclick="closeApproverModal()"></div>
    <div class="modal-content modal-lg">
        <div class="modal-header">
            <h3>결재자 선택</h3>
            <button type="button" class="modal-close" onclick="closeApproverModal()">×</button>
        </div>

        <div class="modal-body">
            <table class="modal-table">
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>부서명</th>
                        <th>직급</th>
                        <th>선택</th>
                    </tr>
                </thead>
                <tbody id="approverTbody">
                    <tr>
                        <td>김부장</td>
                        <td>인사부</td>
                        <td>부장</td>
                        <td>
                            <button type="button" onclick="selectApprover('김부장', '인사부', '부장')">선택</button>
                        </td>
                    </tr>
                    <tr>
                        <td>이과장</td>
                        <td>총무부</td>
                        <td>과장</td>
                        <td>
                            <button type="button" onclick="selectApprover('이과장', '총무부', '과장')">선택</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
        </section>
    </main>
</div>

</body>
</html>