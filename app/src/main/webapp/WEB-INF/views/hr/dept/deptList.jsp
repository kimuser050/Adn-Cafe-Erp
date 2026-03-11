<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>부서관리</title>

    <link rel="stylesheet" href="/css/hr/common/reset.css">
    <link rel="stylesheet" href="/css/hr/common/layout.css">
    <link rel="stylesheet" href="/css/hr/common/sidebar.css">
    <link rel="stylesheet" href="/css/hr/dept/deptList.css">
</head>
<body>

<div class="app-wrap">
    <%@ include file="/WEB-INF/views/hr/common/sidebar.jsp" %>

    <main class="main-area">
        <section class="dept-page">

            <div class="top-tabs">
                <button type="button" class="tab-btn active">부서관리</button>
                <button type="button" class="tab-btn">매장관리</button>
                <button type="button" class="tab-btn">직급관리</button>
            </div>

            <div class="summary-box-row">
                <div class="summary-box">
                    <div class="summary-title">총 부서 수</div>
                    <div class="summary-value">78</div>
                </div>

                <div class="summary-box">
                    <div class="summary-title">총 직원 수</div>
                    <div class="summary-value">200</div>
                </div>
            </div>

            <div class="tool-row">
                <div class="search-area">
                    <input type="text" placeholder="부서명 및 키워드 검색">
                </div>

                <button type="button" class="export-btn">EXPORT</button>
            </div>

            <div class="table-panel">
                <table class="dept-table">
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
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td class="link-cell">경영혁신실/품질관리팀</td>
                            <td>심종진</td>
                            <td>17</td>
                            <td>경기도 성남시 분당구 판교역로 166</td>
                            <td>2021-03-21</td>
                            <td><span class="status on">운영</span></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td class="link-cell">경영혁신실/인사관리팀</td>
                            <td>성민사</td>
                            <td>15</td>
                            <td>경기도 성남시 분당구 판교역로 166</td>
                            <td>2021-03-21</td>
                            <td><span class="status on">운영</span></td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td class="link-cell">경영혁신실/재무관리팀</td>
                            <td>차재무</td>
                            <td>12</td>
                            <td>경기도 성남시 분당구 판교역로 166</td>
                            <td>2021-04-03</td>
                            <td><span class="status on">운영</span></td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td class="link-cell">글로벌사업부/사업A팀</td>
                            <td>김사업</td>
                            <td>0</td>
                            <td>경기도 성남시 분당구 판교역로 166</td>
                            <td>2021-07-21</td>
                            <td><span class="status off">비활성화</span></td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td class="link-cell">경영혁신실/재무관리팀</td>
                            <td>차재무</td>
                            <td>12</td>
                            <td>경기도 성남시 분당구 판교역로 166</td>
                            <td>2021-04-03</td>
                            <td><span class="status on">운영</span></td>
                        </tr>
                    </tbody>
                </table>

                <div class="bottom-row">
                    <div class="paging">
                        <span class="page-num active">1</span>
                        <span class="page-num">2</span>
                        <span class="page-num">3</span>
                        <span class="page-num">4</span>
                        <span class="page-num">5</span>
                    </div>

                    <div class="write-btn-area">
                        <button type="button" class="write-btn">부서등록</button>
                    </div>
                </div>
            </div>

        </section>
    </main>
</div>

<script src="/js/hr/dept/deptList.js"></script>
</body>
</html>