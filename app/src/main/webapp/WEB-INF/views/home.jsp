<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>헬로월드</title>
        <link rel="stylesheet" href="/css/common/reset.css">
        <link rel="stylesheet" href="/css/common/layout.css">
        <link rel="stylesheet" href="/css/common/sidebar.css">
        <link rel="stylesheet" href="/css/common/component.css">
        <link rel="stylesheet" href="/css/common/home.css">
        <script defer src="/js/common/home.js"></script>

    </head>

    <body>

        <div class="app-shell">
            <%@ include file="/WEB-INF/views/common/sidebar.jsp" %>

                <div class="page-shell">
                    <div class="home-container">

                        <div class="home-hero-bg"></div>

                        <div class="home-content">

                            <% if(session.getAttribute("loginMemberVo")==null){ %>
                                <div class="login-section">
                                    <h2
                                        style="color:#71513d; font-size: 20px; font-weight: 800; text-align: center; margin-bottom: 5px;">
                                        LOGIN</h2>

                                    <input type="text" name="id" placeholder="사번(아이디)을 입력하세요">
                                    <input type="password" name="pw" placeholder="비밀번호를 입력하세요">

                                    <div class="login-btn-area">
                                        <button class="btn btn-outline"
                                            onclick="location.href='/member/join'">회원가입</button>
                                        <button class="btn btn-dark" onclick="login();">로그인</button>
                                    </div>
                                </div>
                                <% } else { %>
                                    <div class="user-info-area login-section">
                                        <img src="http://192.168.20.2:5500/member/${loginMemberVo.profileChangeName}"
                                            alt="${loginMemberVo.profileOriginName}" class="profile-img"> <span
                                            style="text-align:center; font-weight:bold; font-size:18px;">
                                            ${loginMemberVo.empName}
                                        </span>

                                        <div class="btn-group">
                                            <button class="btn btn-dark"
                                                onclick="location.href='/member/mypage'">마이페이지</button>
                                            <button class="btn btn-dark"
                                                onclick="location.href='/member/logout'">로그아웃</button>
                                        </div>
                                    </div>
                                    <% } %>

                                        <div class="home-card-wrap">
                                            <div class="card-item">
                                                <div class="card-badge">이달의 우수사원</div>
                                                <div class="home-card"></div>
                                            </div>
                                            <div class="card-item">
                                                <div class="card-badge">이달의 우수매장</div>
                                                <div class="home-card"></div>
                                            </div>
                                            <div class="card-item">
                                                <div class="card-badge">공지사항</div>
                                                <div class="home-card"></div>
                                            </div>
                                        </div>
                        </div>

                    </div>
                </div>
        </div>

    </body>

    </html>

    <script>
        const msg = "${alertMsg}";
        if (msg && msg.length > 0) {
            alert(msg);
        }
    </script>