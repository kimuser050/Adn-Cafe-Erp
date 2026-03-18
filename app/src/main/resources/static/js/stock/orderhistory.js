/**
 * [Coffee Prince ERP - 발주 이력 관리 JS]
 * 이미지 4번 디자인 포맷 + 발주 이력(orderHistory) 데이터 바인딩
 */

document.addEventListener('DOMContentLoaded', () => {
    // 페이지 로드 시 첫 페이지(1) 호출
    loadHistoryList(1);

    // 검색창 엔터키 이벤트 처리
    const searchInput = document.getElementById('orderKeyword');
    if (searchInput) {
        searchInput.onkeyup = (e) => { 
            if (e.key === 'Enter') loadHistoryList(1); 
        };
    }
});

/**
 * 1. 발주 이력 데이터 로드 (API: /api/order/history)
 */
function loadHistoryList(page) {
    const keyword = document.getElementById('orderKeyword').value;
    
    // 컨트롤러의 @GetMapping("history") 경로와 일치해야 함
    fetch(`/api/order/history?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`)
    .then(res => {
        if(!res.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
        return res.json();
    })
    .then(data => {
        // 서버(Map)에서 보낸 voList와 pagingInfo 사용
        renderHistoryTable(data.voList);
        renderPagination(data.pagingInfo);
    })
    .catch(err => {
        console.error("Fetch 에러:", err);
        const body = document.getElementById('orderBody');
        if(body) body.innerHTML = '<tr><td colspan="6" style="padding:50px 0; color:red;">데이터 로드 오류가 발생했습니다.</td></tr>';
    });
}

/**
 * 2. 테이블 행 생성 (데이터 매핑)
 */
function renderHistoryTable(list) {
    const body = document.getElementById('orderBody');
    if (!body) return;
    
    body.innerHTML = '';

    if (!list || list.length === 0) {
        body.innerHTML = '<tr><td colspan="6" style="padding:100px 0; text-align:center;">조회된 내역이 없습니다.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        // 행 클릭 시 상세 모달 오픈
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

/**
 * 상태 코드 변환 (W: 대기, F: 완료, C: 취소)
 */
function getStatusText(status) {
    const map = { 'W': '대기', 'F': '완료', 'C': '취소' };
    return map[status] || '대기';
}

/**
 * 3. 페이징 버튼 생성 (이미지 4번 스타일)
 */
function renderPagination(paging) {
    const pgn = document.getElementById('pagination');
    if (!pgn || !paging) return;
    pgn.innerHTML = '';

    // 이전 버튼 (<)
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerText = '<';
    prevBtn.disabled = paging.currentPage === 1;
    prevBtn.onclick = (e) => { e.stopPropagation(); loadHistoryList(paging.currentPage - 1); };
    pgn.appendChild(prevBtn);

    // 페이지 번호 (startPage ~ endPage)
    for (let i = paging.startPage; i <= paging.endPage; i++) {
        const numBtn = document.createElement('button');
        numBtn.className = `page-btn ${i === paging.currentPage ? 'active' : ''}`;
        numBtn.innerText = i;
        numBtn.onclick = (e) => { e.stopPropagation(); loadHistoryList(i); };
        pgn.appendChild(numBtn);
    }

    // 다음 버튼 (>)
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerText = '>';
    nextBtn.disabled = paging.currentPage === paging.maxPage || paging.maxPage === 0;
    nextBtn.onclick = (e) => { e.stopPropagation(); loadHistoryList(paging.currentPage + 1); };
    pgn.appendChild(nextBtn);
}

/**
 * 4. 발주 상세조회 모달 열기
 */
function openOrderDetail(orderNo) {
    fetch(`/api/order/${orderNo}`)
    .then(res => res.json())
    .then(data => {
        const vo = data.vo;
        if(!vo) return;

        // 모달 필드에 데이터 채우기
        document.getElementById('detailItemName').value = vo.itemName;
        document.getElementById('detailQuantity').value = vo.quantity;
        document.getElementById('detailStatus').value = vo.status;
        
        const modal = document.getElementById('orderDetailModal');
        modal.dataset.no = vo.orderNo; // 수정을 위해 발주번호 저장
        modal.style.display = 'flex';
    })
    .catch(err => console.error("상세조회 실패:", err));
}

/**
 * 모달 닫기
 */
function closeOrderModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

/**
 * 5. 발주 상태 업데이트 (PUT)
 */
function updateOrderStatus() {
    const orderNo = document.getElementById('orderDetailModal').dataset.no;
    const status = document.getElementById('detailStatus').value;

    if(!orderNo) return;

    fetch('/api/order/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            orderNo: orderNo, 
            status: status 
        })
    })
    .then(res => res.json())
    .then(data => {
        // 컨트롤러의 map.put("result", result) 대응
        if(data.result > 0) {
            alert("발주 상태가 성공적으로 수정되었습니다.");
            closeOrderModal();
            loadHistoryList(1); // 수정 후 리스트 1페이지로 새로고침
        } else {
            alert("수정에 실패했습니다.");
        }
    })
    .catch(err => {
        console.error("업데이트 에러:", err);
        alert("서버 통신 중 오류가 발생했습니다.");
    });
}