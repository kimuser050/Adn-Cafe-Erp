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
    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/approval/common/writeSidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content">
           <div class="approval-write-wrap">
    <h2 class="page-title">결재 작성 / <span id="formTitle">휴가신청</span></h2>

    <!-- 결재양식 선택 -->
    <div class="form-select-box">
        <div class="form-select-title">결재양식</div>
        <div class="form-card-wrap">
            <button type="button" class="form-card active category-btn" data-type="VACATION">
                <div class="form-card-icon">📄</div>
                <div class="form-card-text">휴가신청</div>
            </button>

            <button type="button" class="form-card category-btn" data-type="OVERTIME">
                <div class="form-card-icon">📄</div>
                <div class="form-card-text">연장근무신청</div>
            </button>
        </div>
    </div>

    <!-- 작성 폼 -->
    <form id="approvalWriteForm">
        <input type="hidden" name="categoryType" id="categoryType" value="VACATION">
        <input type="hidden" id="categoryNo" value="1">
        <input type="hidden" name="deptCode" id="deptCode">
        <input type="hidden" name="approverNo" id="approverNo">

        <table class="write-table">
            <tr>
                <th>제목</th>
                <td colspan="3">
                    <input type="text" name="title" id="title" class="input-full">
                </td>
            </tr>

            <tr>
                <th>참조부서</th>
                <td colspan="3">
                    <div class="input-search-wrap">
                        <input type="text" id="deptName" class="input-full" readonly placeholder="참조부서를 선택하세요">
                        <button type="button" class="btn-search" onclick="openDeptModal()">찾기</button>
                    </div>
                </td>
            </tr>

            <tr>
                <th>결재자</th>
                <td colspan="3">
                    <div class="input-search-wrap">
                        <input type="text" id="approverInfo" class="input-full" readonly placeholder="결재자를 선택하세요">
                        <button type="button" class="btn-search" onclick="openApproverModal()">찾기</button>
                    </div>
                </td>
            </tr>

            <!-- 휴가신청 전용 -->
            <tr class="dynamic-row vacation-row">
                <th>시작일 - 종료일</th>
                <td colspan="3">
                    <div class="date-range-wrap">
                        <input type="date" name="startDate" id="startDate">
                        <span>~</span>
                        <input type="date" name="endDate" id="endDate">
                    </div>
                </td>
            </tr>

            <!-- 연장근무신청 전용 -->
            <tr class="dynamic-row overtime-row hidden">
                <th>연장근무날짜</th>
                <td colspan="3">
                    <input type="date" name="overtimeDate" id="overtimeDate">
                </td>
            </tr>

            <tr class="dynamic-row overtime-row hidden">
                <th>연장근무시간</th>
                <td colspan="3">
                    <div class="check-wrap">
                        <label><input type="radio" name="overtimeHours" value="2"> 2시간</label>
                        <label><input type="radio" name="overtimeHours" value="4"> 4시간</label>
                    </div>
                </td>
            </tr>

            <tr>
                <th>내용</th>
                <td colspan="3">
                    <textarea name="content" id="content" class="textarea-full"></textarea>
                </td>
            </tr>
        </table>

        <div class="btn-area">
            <button type="button" class="btn-submit" onclick="submitApproval()">상신</button>
            <button type="button" class="btn-cancel" onclick="history.back()">취소</button>
        </div>
    </form>
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

<!-- <script src="${pageContext.request.contextPath}/js/approval/write.js"></script> -->
</body>
            
        </section>
    </main>
</div>

</body>
</html>