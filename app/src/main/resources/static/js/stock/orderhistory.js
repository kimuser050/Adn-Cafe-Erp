/**
 * [Coffee Prince ERP - 발주 내역 관리 JS]
 * 디자인 가이드 및 component.css 호환 버전
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 초기 데이터 로드 (전역 변수 로드 대기)
    setTimeout(() => {
        loadHistoryList(1);
    }, 50);

    // 2. 검색창 엔터키 이벤트
    const searchInput = document.getElementById('orderKeyword');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') loadHistoryList(1);
        });
    }
});

/**
 * 발주 이력 목록 로드
 */
function loadHistoryList(page) {
    const keywordInput = document.getElementById('orderKeyword');
    const keyword = keywordInput ? keywordInput.value : "";

    // JSP에서 선언한 전역 변수 참조
    const empNo = window.loginEmpNo || "";
    const storeCode = window.loginStoreCode || "";

    // [권한 로직] 본사인 경우 전체 조회
    let searchEmpNo = empNo;
    if (storeCode === '310103') {
        searchEmpNo = "";
    }

    const url = `/api/order/history?currentPage=${page}`
              + `&keyword=${encodeURIComponent(keyword)}`
              + `&empNo=${searchEmpNo}`;

    fetch(url)
    .then(res => {
        if (!res.ok) throw new Error("네트워크 응답 에러");
        return res.json();
    })
    .then(data => {
        const list = data.voList || [];
        const paging = data.pagingInfo || {};

        renderHistoryTable(list);
        renderPagination(paging);
    })
    .catch(err => console.error("데이터 로드 중 오류:", err));
}

/**
 * 테이블 렌더링 (CSS 클래스 매핑 수정됨)
 */
function renderHistoryTable(list) {
    const body = document.getElementById('orderBody');
    if(!body) return;
    body.innerHTML = '';

    if (!list || list.length === 0) {
        body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:40px; color:#999;">조회된 내역이 없습니다.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.onclick = () => openOrderDetail(item.orderNo);

        // --- 💥 [수정 포인트] CSS 변수와 클래스명 일치화 ---
        let statusClass = "";
        let statusText = "";
        const rawStatus = (item.status || 'W').toUpperCase();

        if (rawStatus === 'F') {
            statusClass = "status-on";   // 완료 (초록색)
            statusText = "완료";
        } else if (rawStatus === 'C') {
            statusClass = "status-off";  // 취소 (빨간색)
            statusText = "취소";
        } else {
            statusClass = "status-wait"; // 대기 (노란색) -> 기존 status-pending에서 변경
            statusText = "대기";
        }

        tr.innerHTML = `
            <td>${item.orderNo}</td>
            <td style="font-weight:600; color:var(--color-dark);">${item.itemName}</td>
            <td>${item.storeName || '본사'}</td>
            <td>${Number(item.quantity).toLocaleString()}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td style="color:#888; font-size:13px;">${item.requestDate || '-'}</td>
        `;
        body.appendChild(tr);
    });
}

/**
 * 페이징 렌더링 (component.css의 page-btn 스타일 활용)
 */
function renderPagination(paging) {
    const pgn = document.getElementById('pagination');
    if (!pgn || !paging) return;
    pgn.innerHTML = '';

    // 시작 페이지부터 끝 페이지까지 반복
    for (let i = paging.startPage; i <= paging.endPage; i++) {
        const numBtn = document.createElement('button');
        numBtn.type = 'button';

        // ⭐ 'page-btn' 클래스를 기본으로 넣고, 현재 페이지면 'active' 추가
        numBtn.className = `page-btn ${i === paging.currentPage ? 'active' : ''}`;

        numBtn.innerText = i;
        numBtn.onclick = () => loadHistoryList(i);
        pgn.appendChild(numBtn);
    }
}
/**
 * 상세 정보 모달 열기
 */
function openOrderDetail(orderNo) {
    fetch(`/api/order/${orderNo}`)
    .then(res => res.json())
    .then(data => {
        const vo = data.vo || data;
        if(!vo) return;

        document.getElementById('detailItemName').value = vo.itemName;
        document.getElementById('detailQuantity').value = vo.quantity;
        document.getElementById('detailStatus').value = vo.status;

        const detailStore = document.getElementById('detailStoreName');
        if(detailStore) detailStore.value = vo.storeName || '본사';

        const modal = document.getElementById('orderDetailModal');
        modal.dataset.no = vo.orderNo;
        modal.style.display = 'flex'; // 중앙 정렬을 위해 flex 유지
    })
    .catch(err => {
        console.error(err);
        alert("상세 정보 로드 실패");
    });
}

/**
 * 주문 상태 수정 저장
 */
function updateOrderStatus() {
    const modal = document.getElementById('orderDetailModal');
    const orderNo = modal.dataset.no;
    const status = document.getElementById('detailStatus').value;

    if(!confirm("주문 상태를 변경하시겠습니까?")) return;

    fetch('/api/order/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNo, status })
    })
    .then(res => res.json())
    .then(data => {
        if(data.result > 0) {
            alert("수정 완료되었습니다.");
            closeOrderModal();
            loadHistoryList(1);
        } else {
            alert("수정에 실패했습니다.");
        }
    })
    .catch(err => {
        console.error(err);
        alert("서버 통신 중 에러 발생");
    });
}

/**
 * 모달 닫기
 */
function closeOrderModal() {
    const modal = document.getElementById('orderDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}