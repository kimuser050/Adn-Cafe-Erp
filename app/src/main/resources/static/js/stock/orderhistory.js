document.addEventListener('DOMContentLoaded', () => {
    loadHistoryList(1);

    // 엔터키 검색
    const searchInput = document.getElementById('orderKeyword');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') loadHistoryList(1);
        });
    }
});

// 데이터 로드
function loadHistoryList(page) {
    const keyword = document.getElementById('orderKeyword').value;
    
    fetch(`/api/order/history?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`)
    .then(res => res.json())
    .then(data => {
        if (data && data.voList) {
            renderHistoryTable(data.voList);
            renderPagination(data.pagingInfo);
        }
    })
    .catch(err => console.error("History Load Error:", err));
}

// 테이블 렌더링
function renderHistoryTable(list) {
    const body = document.getElementById('orderBody');
    if(!body) return;
    body.innerHTML = '';

    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.onclick = () => openOrderDetail(item.orderNo);
        
        // [수정] 고정된 '본사' 텍스트를 삭제하고 DB 데이터를 넣습니다.
        const storeName = item.storeName || item.STORE_NAME || '미등록';

        tr.innerHTML = `
            <td>${item.orderNo}</td>
            <td style="text-align:left; padding-left:20px;">${item.itemName}</td>
            <td>${storeName}</td>  <td>${Number(item.quantity).toLocaleString()}</td>
            <td><b style="color:#5D4037">${getStatusText(item.status)}</b></td>
            <td>${item.requestDate || '-'}</td>
        `;
        body.appendChild(tr);
    });
}
function getStatusText(status) {
    const map = { 'W': '대기', 'F': '완료', 'C': '취소' };
    const rawStatus = (status || 'W').toUpperCase();
    return map[rawStatus] || '대기';
}

// 페이징 렌더링
function renderPagination(paging) {
    const pgn = document.getElementById('pagination');
    if (!pgn || !paging) return;
    pgn.innerHTML = '';

    // 이전
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerText = '<';
    prevBtn.disabled = paging.currentPage === 1;
    prevBtn.onclick = () => loadHistoryList(paging.currentPage - 1);
    pgn.appendChild(prevBtn);

    // 숫자
    for (let i = paging.startPage; i <= paging.endPage; i++) {
        const numBtn = document.createElement('button');
        numBtn.className = `page-btn ${i === paging.currentPage ? 'active' : ''}`;
        numBtn.innerText = i;
        numBtn.onclick = () => loadHistoryList(i);
        pgn.appendChild(numBtn);
    }

    // 다음
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerText = '>';
    nextBtn.disabled = paging.currentPage === paging.maxPage || paging.maxPage === 0;
    nextBtn.onclick = () => loadHistoryList(paging.currentPage + 1);
    pgn.appendChild(nextBtn);
}

// 모달 제어
function openOrderDetail(orderNo) {
    fetch(`/api/order/${orderNo}`)
    .then(res => res.json())
    .then(data => {
        const vo = data.vo;
        if(!vo) return;

        document.getElementById('detailItemName').value = vo.itemName;
        document.getElementById('detailQuantity').value = vo.quantity;
        document.getElementById('detailStatus').value = vo.status;
        
        // [참고] 모달에 매장 이름 필드가 있다면 아래처럼 넣어줄 수 있습니다.
        const detailStore = document.getElementById('detailStoreName');
        if(detailStore) detailStore.value = vo.storeName || vo.STORE_NAME || '본사';

        const modal = document.getElementById('orderDetailModal');
        modal.dataset.no = vo.orderNo;
        modal.style.display = 'flex';
    })
    .catch(err => alert("상세 정보 로드 실패"));
}

function closeOrderModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

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
            alert("수정 완료");
            closeOrderModal();
            loadHistoryList(1); // 목록 새로고침
        } else {
            alert("수정 실패");
        }
    })
    .catch(err => alert("서버 통신 중 에러 발생"));
}