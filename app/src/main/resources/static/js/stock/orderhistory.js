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
            renderPagination(data.pagingInfo || data.pvo); // 서버 변수명 확인 (pagingInfo 또는 pvo)
        }
    })
    .catch(err => console.error("History Load Error:", err));
}

// [수정] 테이블 렌더링 (상태 뱃지 불 들어오게 수정)
function renderHistoryTable(list) {
    const body = document.getElementById('orderBody');
    if(!body) return;
    body.innerHTML = '';

    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.onclick = () => openOrderDetail(item.orderNo);
        
        const storeName = item.storeName || item.STORE_NAME || '미등록';
        
        // 상태값 판별 로직
        let statusClass = "";
        let statusText = "";
        
        const rawStatus = (item.status || 'W').toUpperCase();
        
        if (rawStatus === 'F') {
            statusClass = "status-on";  // 파란불 (완료)
            statusText = "완료";
        } else if (rawStatus === 'C') {
            statusClass = "status-off"; // 빨간불 (취소)
            statusText = "취소";
        } else {
            // 'W'이거나 다른 값이면 모두 노란불 (대기)
            statusClass = "status-wait"; 
            statusText = "대기";
        }

        tr.innerHTML = `
            <td>${item.orderNo}</td>
            <td style="text-align:left; padding-left:20px;">${item.itemName}</td>
            <td>${storeName}</td>  
            <td>${Number(item.quantity).toLocaleString()}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${item.requestDate || '-'}</td>
        `;
        body.appendChild(tr);
    });
}

// [수정] 페이징 렌더링 (화살표 제거 버전)
function renderPagination(paging) {
    const pgn = document.getElementById('pagination');
    if (!pgn || !paging) return;
    pgn.innerHTML = '';

    // [제거] 이전 버튼(<) 삭제 완료

    // 숫자 버튼만 생성
    for (let i = paging.startPage; i <= paging.endPage; i++) {
        const numBtn = document.createElement('button');
        numBtn.type = 'button';
        numBtn.className = `page-btn ${i === paging.currentPage ? 'active' : ''}`;
        numBtn.innerText = i;
        numBtn.onclick = () => loadHistoryList(i);
        pgn.appendChild(numBtn);
    }

    // [제거] 다음 버튼(>) 삭제 완료
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
            loadHistoryList(1); 
        } else {
            alert("수정 실패");
        }
    })
    .catch(err => alert("서버 통신 중 에러 발생"));
}