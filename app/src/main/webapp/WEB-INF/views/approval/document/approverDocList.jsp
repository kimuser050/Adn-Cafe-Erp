<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>결재함</title>

    <script defer src="/js/approval/approverDocList.js"></script>
    <link rel="stylesheet" href="/css/approval/approverDocList.css">
    <link rel="stylesheet" href="/css/common/reset.css">
    <link rel="stylesheet" href="/css/common/layout.css">
    <link rel="stylesheet" href="/css/common/sidebar.css">
    <link rel="stylesheet" href="/css/common/component.css">
    <link rel="stylesheet" href="/css/hr/org/orgCommon.css">
</head>
<body>

<div class="app-shell">
    <%@ include file="/WEB-INF/views/approval/common/adlSidebar.jsp" %>

    <main class="page-shell">
        <section class="page-content">
            <!-- 요약 카드 -->
            <div class="org-summary-area">
                <div class="summary-card">
                    <div class="summary-title">총 문서 수</div>
                    <div class="summary-value" id="total-count">0</div>
                </div>
                <div class="summary-card">
                    <div class="summary-title">대기</div>
                    <div class="summary-value" id="wait-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">승인</div>
                    <div class="summary-value" id="ok-count">0</div>
                </div>

                <div class="summary-card">
                    <div class="summary-title">반려</div>
                    <div class="summary-value" id="reject-count">0</div>
                </div>

            </div>

            
            <!-- 결재문서 테이블 -->
            <div class="doc-box">
                <!-- 검색바 -->
                <div id="search-area">
                    <form id="search-form">
                        <select name="statusCode" class="form-select" id="statusCode">
                            <option value="">전체</option>
                            <option value="1" selected>대기</option>
                            <option value="2">승인</option>
                            <option value="3">반려</option>
                        </select>
                        
                        <select name="category" class="form-select" id="categoryNo">
                            <option value="">전체</option>
                            <option value="1">휴가</option>
                            <option value="2">연장근무</option>
                        </select>
    
                        <input type="date" name="startDate" id="startDate" class="form-input">
                        <input type="date" name="endDate" id="endDate" class="form-input">
    
                        <button type="button" class="btn" onclick="searchApproverDoc();">검색</button>
                    </form>
                </div>
                <table class="doc-table">
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
                <div class="pagination"></div>
            </div>
        </section>
    </main>
</div>
<!-- 상세조회 모달 -->
<div id="doc-detail-modal" class="doc-modal hidden">
    <div class="doc-modal-overlay" onclick="closeDocModal()"></div>

    <div class="doc-modal-content approval-form-modal">
        <!-- <button type="button" class="doc-modal-close" onclick="closeDocModal()">×</button> -->

        <div class="approval-paper">

            <!-- 상단 문서 헤더 -->
            <div class="paper-header">
                <div class="writer-info-box">
                    <table class="writer-info-table">
                        <tr>
                            <th>소속부서</th>
                            <td id="detail-writerDept">-</td>
                        </tr>
                        <tr>
                            <th>직급</th>
                            <td id="detail-writerPosition">-</td>
                        </tr>
                        <tr>
                            <th>성명</th>
                            <td id="detail-writerName">-</td>
                        </tr>
                    </table>
                </div>

                <div class="paper-title" id="detail-form-title">휴가 신청</div>

                <div class="approval-sign-box">
                    <table class="approval-sign-table">
                        <tr>
                            <th rowspan="3">결재</th>
                            <td id="detail-approverName">-</td>
                        </tr>
                        <tr>
                            <td>
                                <span class="sign-badge" id="detail-statusName">대기</span>
                            </td>
                        </tr>
                        <tr>
                            <td id="detail-actedAt">-</td>
                        </tr>
                    </table>
                </div>
            </div>

            <!-- 본문 -->
            <div class="paper-body">
                <table class="approval-detail-table">
                    <tr>
                        <th>제목</th>
                        <td colspan="3">
                            <div class="form-value" id="detail-title">-</div>
                        </td>
                    </tr>

                    <tr>
                        <th>참조부서</th>
                        <td colspan="3">
                            <div class="form-value" id="detail-referenceDept">-</div>
                        </td>
                    </tr>

                    <tr class="detail-row detail-row-vacation">
                        <th>시작일 - 종료일</th>
                        <td colspan="3">
                            <div class="date-range-wrap">
                                <span class="form-value short" id="detail-startDate">-</span>
                                <span class="date-tilde">~</span>
                                <span class="form-value short" id="detail-endDate">-</span>
                            </div>
                        </td>
                    </tr>

                    <tr class="detail-row detail-row-overtime">
                        <th>연장근무 날짜</th>
                        <td>
                            <div class="form-value short" id="detail-workDate">-</div>
                        </td>
                        <th>연장근무 시간</th>
                        <td>
                            <div class="radio-view-wrap" id="detail-workHour">-</div>
                        </td>
                    </tr>

                    <tr class="content-row">
                        <th>내용</th>
                        <td colspan="3">
                            <div class="form-textarea-view" id="detail-content">-</div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- 결재 의견 -->
            <div class="approval-comment-box">
                <div class="approval-comment-title">결재의견</div>
                <textarea id="approval-comment" class="approval-comment-textarea"></textarea>
            </div>

            <!-- 하단 버튼 -->
            <div class="doc-modal-footer" id="doc-modal-footer"></div>
        </div>
    </div>
</div>

</body>
</html>