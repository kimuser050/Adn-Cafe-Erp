<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>공용</title>

        <link rel="stylesheet" href="/css/common/reset.css">
        <link rel="stylesheet" href="/css/common/layout.css">
        <link rel="stylesheet" href="/css/common/sidebar.css">
        <link rel="stylesheet" href="/css/common/component.css">
        <link rel="stylesheet" href="/css/hr/dept/deptList.css">
        <link rel="stylesheet" href="/css/finance/account/account.css">
        <script defer src="/js/finance/account.js"></script>
    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <main class="page-shell">
                    <section class="page-content">
                        <div class="page">
                            <div class="title">계정과목 관리</div>
                            <div class="content-box">
                                <div class="account-area">
                                    <div class="table-header">계정과목 목록</div>
                                    <div class="account-wrapper">
                                        <div class="account-main">
                                            <div class="main-row" onclick="loadSub(this,'1000')">자산 (1000)</div>
                                            <div class="main-row" onclick="loadSub(this,'2000')">자본 (2000)</div>
                                            <div class="main-row" onclick="loadSub(this,'3000')">부채 (3000)</div>
                                            <div class="main-row" onclick="loadSub(this,'4000')">수익 (4000)</div>
                                            <div class="main-row" onclick="loadSub(this,'5000')">비용 (5000)</div>
                                        </div>
                                        <div class="account-sub" id="subAccountArea">
                                            <div class="sub-placeholder">대분류 계정을 선택하세요</div>
                                        </div>
                                    </div>
                                    <div class="account-footer">
                                        <button class="delete-btn active" onclick="statusAccount();">상태변경</button>
                                    </div>
                                </div>

                                <div class="register-area">
                                    <div class="form-box">
                                        <div class="form-title">신규 계정 등록</div>
                                        <form>
                                            <div class="form-row">
                                                <label>계정과목명</label>
                                                <input type="text" name="accountName" placeholder="예: 보통예금">
                                            </div>
                                            <div class="form-row">
                                                <label>대분류 코드</label>
                                                <input type="text" name="mainAccountNo">
                                            </div>
                                            <div class="form-row">
                                                <label>중분류 코드</label>
                                                <input type="text" name="subAccountNo">
                                            </div>
                                            <div class="form-row">
                                                <label>과목코드</label>
                                                <input type="text" name="accountNo">
                                            </div>
                                        </form>
                                        <div class="register-footer">
                                            <button class="add-btn" onclick="insertAccount();">추가하기</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
        </div>