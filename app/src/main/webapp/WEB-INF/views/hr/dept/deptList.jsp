<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>부서목록</title>
    
</head>
<body>

<h1>HOME ~ !</h1>


       <% if(session.getAttribute("loginMemberVo") != null){ %>
            <h3>${loginMemberVo.nick}사마 어서 오십시오!!!!</h3>
            <img src="">
       <% } else { %>
            <h3>GUEST 환영한다 어서오고</h3>
       <% } %>





</body>
</html>