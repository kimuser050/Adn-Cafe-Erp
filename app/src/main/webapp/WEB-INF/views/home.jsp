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
                                             alt="${loginMemberVo.profileOriginName}" class="profile-img">

                                        <div class="user-details" style="margin-bottom: 5px;">
                                            <span class="user-name"><b>${loginMemberVo.empName}</b> 님</span>
                                        </div>

                                        <div class="attendance-btn-group" style="display: flex; gap: 10px; width: 100%;">
                                            <button type="button" id="btn-work-in" class="btn btn-mid" style="flex: 1;">출근</button>
                                            <button type="button" id="btn-work-out" class="btn btn-outline" style="flex: 1;">퇴근</button>
                                        </div>

                                        <div class="btn-group" style="display: flex; gap: 10px; width: 100%;">
                                            <button type="button" class="btn btn-dark" style="flex: 1;" onclick="location.href='/member/mypage'">마이페이지</button>
                                            <button type="button" class="btn btn-dark" style="flex: 1;" onclick="location.href='/member/logout'">로그아웃</button>
                                        </div>
                                    </div>
                                <% } %>

                                        
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