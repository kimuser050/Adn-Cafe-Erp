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

    if (list.length === 0) {
        body.innerHTML = '<tr><td colspan="6" style="padding:100px 0;">조회된 내역이 없습니다.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.onclick = () => openOrderDetail(item.orderNo);
        tr.innerHTML = `
            <td>${item.orderNo}</td>
            <td style="text-align:left; padding-left:20px;">${item.itemName}</td>
            <td>본사</td>
            <td>${Number(item.quantity).toLocaleString()}</td>
            <td><b style="color:#5D4037">${getStatusText(item.status)}</b></td>
            <td>${item.requestDate || '-'}</td>
        `;
        body.appendChild(tr);
    });
}

function getStatusText(status) {
    const map = { 'W': '대기', 'F': '완료', 'C': '취소' };
    return map[status] || '대기';
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

// 모달 제어 (생략 방지)
function openOrderDetail(orderNo) {
    fetch(`/api/order/${orderNo}`).then(res => res.json()).then(data => {
        const vo = data.vo;
        document.getElementById('detailItemName').value = vo.itemName;
        document.getElementById('detailQuantity').value = vo.quantity;
        document.getElementById('detailStatus').value = vo.status;
        const modal = document.getElementById('orderDetailModal');
        modal.dataset.no = vo.orderNo;
        modal.style.display = 'flex';
    });
}

function closeOrderModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

function updateOrderStatus() {
    const modal = document.getElementById('orderDetailModal');
    const orderNo = modal.dataset.no;
    const status = document.getElementById('detailStatus').value;

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
            loadHistoryList(1);
        }
    });
}