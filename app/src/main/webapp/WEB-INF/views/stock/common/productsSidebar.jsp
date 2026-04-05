<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>


<aside class="sidebar">
    <div class="sidebar-logo">
        <!-- 로고 누르면 홈으로 가기 -->
        <a href="/" class="sidebar-logo-link">
        <img src="/img/common/logo.png" alt="Coffee Prince 로고" class="sidebar-logo-img">
        </a>
    </div>

    <nav class="sidebar-nav">


        <a href="/" id="home">HOME</a>


        <div class="nav-group">
            <button type="button" class="nav-main">인적관리</button>
            <div class="nav-sub">
                <a href="/hr/dept/list">조직관리</a>
                <a href="/hr/emp/list"  class="active">직원관리</a>
                <a href="#">근태관리</a>
                <a href="#">급여관리</a>
            </div>
        </div>

        <div class="nav-group">
            <button type="button" class="nav-main">재무관리</button>
            <div class="nav-sub">
                <a href="#">계정</a>
                <a href="#">장부</a>
                <a href="#">재무현황</a>
                <a href="#">매출분석</a>
            </div>
        </div>

      <div class="nav-group">
                <button type="button" class="nav-main">품질관리</button>
                <div class="nav-sub">
                    <a href="/stock/item" >본사 품목</a>
                    <a href="/stock/history">발주 관리</a>
                    <a href="/stock/check"  >반품검수</a>
                    <a href="/stock/products "class="active">상품관리</a>
                </div>
            </div>

            <div class="nav-group">
                <button type="button" class="nav-main">매장관리</button>
                <div class="nav-sub">
                    <a href="/dailySales/listDaily">매출등록</a>
                     <a href="/stock/return">반품 신청</a>
                      <a href="/stock/checksList">반품 상태</a>
                       <a href="/stock/order"  >발주관리</a>
                       <a href="/stock/productsList">제품조회</a>
                </div>
            </div>

         <div class="nav-group">
            <button type="button" class="nav-main">결재관리</button>
                <div class="nav-sub">
                    <a href="/approval/document/write">문서작성</a>
                    <a href="/approval/document/myDocList">내 문서함</a>
                    <a href="/approval/document/approvalDocList">결재함</a>
                </div>
        </div>
        <br>
        <a href="#" class="nav-link">마이페이지</a>
        <a href="#" class="nav-link">공지사항</a>
        <a href="#" class="nav-link">문의게시판</a>

    </nav>
</aside>