/**
 * [Coffee Prince ERP - 발주 신청 JS]
 * 기능: 검색(Keyword), 페이징(Pagination), 수량 조절, 일괄 주문
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 초기 데이터 로드 (1페이지)
    loadOrderList(1);

    // 2. 검색창 엔터키 이벤트 등록
    const searchInput = document.getElementById('orderKeyword');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') loadOrderList(1);
        });
    }

    // 3. 전체 선택 기능
    const checkAll = document.getElementById('checkAll');
    if (checkAll) {
        checkAll.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.item-check');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
    }
});

/**
 * 1. 발주 가능 목록 조회 (검색 + 페이징)
 */
function loadOrderList(page) {
    const searchInput = document.getElementById('orderKeyword');
    const keyword = searchInput ? searchInput.value : '';
    
    fetch(`/api/order/list?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`)
    .then(res => {
        if(!res.ok) throw new Error("데이터 로드 실패");
        return res.json();
    })
    .then(data => {
        if (data && data.voList) {
            renderOrderTable(data.voList);     // 테이블 렌더링
            renderPagination(data.pagingInfo); // 페이징 버튼 생성
        }
    })
    .catch(err => {
        console.error("Error:", err);
        const body = document.getElementById('orderBody');
        if(body) body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:50px; color:red;">데이터 로딩 중 에러가 발생했습니다.</td></tr>';
    });
}

/**
 * 2. 테이블 렌더링 (수량 조절 디자인 포함)
 */
function renderOrderTable(list) {
    const body = document.getElementById('orderBody');
    if (!body) return;
    body.innerHTML = '';

    if (!list || list.length === 0) {
        body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:100px 0;">조회된 품목이 없습니다.</td></tr>';
        return;
    }

    list.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" class="item-check" data-no="${item.itemNo}"></td>
            <td>${item.itemNo}</td>
            <td style="text-align:left; padding-left:20px;">${item.itemName}</td>
            <td>본사</td>
            <td>
                <div class="qty-control">
                    <button type="button" class="qty-minus" onclick="changeQty(this, -1)">-</button>
                    <input type="text" class="qty-input" value="1" readonly>
                    <button type="button" class="qty-plus" onclick="changeQty(this, 1)">+</button>
                </div>
            </td>
            <td>2026/03/19</td>
        `;
        body.appendChild(tr);
    });
}

/**
 * 3. 수량 증감 함수
 */
function changeQty(btn, delta) {
    const input = btn.parentElement.querySelector('.qty-input');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1; 
    input.value = val;
}

/**
 * 4. 페이징 처리 (CSS 스타일 완벽 적용 버전)
 */
function renderPagination(paging) {
    const pgnArea = document.getElementById('pagination');
    if (!pgnArea || !paging) return;
    pgnArea.innerHTML = '';

    // [이전] 버튼
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '&lt;'; // '<' 표시
    prevBtn.disabled = (paging.currentPage === 1);
    prevBtn.onclick = () => loadOrderList(paging.currentPage - 1);
    pgnArea.appendChild(prevBtn);

    // [번호] 버튼
    for (let i = paging.startPage; i <= paging.endPage; i++) {
        const numBtn = document.createElement('button');
        numBtn.innerText = i;
        // 현재 페이지인 경우 active 클래스 추가 (CSS에서 밤색 배경 처리됨)
        if (i === paging.currentPage) {
            numBtn.classList.add('active');
        }
        numBtn.onclick = () => loadOrderList(i);
        pgnArea.appendChild(numBtn);
    }

    // [다음] 버튼
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '&gt;'; // '>' 표시
    nextBtn.disabled = (paging.currentPage === paging.maxPage || paging.maxPage === 0);
    nextBtn.onclick = () => loadOrderList(paging.currentPage + 1);
    pgnArea.appendChild(nextBtn);
}

/**
 * 5. 일괄 주문 신청
 */
function submitBulkOrder() {
    const selected = document.querySelectorAll('.item-check:checked');
    if (selected.length === 0) {
        alert("주문할 항목을 선택해주세요.");
        return;
    }

    const orderList = Array.from(selected).map(cb => {
        const row = cb.closest('tr');
        return {
            itemNo: cb.dataset.no,
            quantity: row.querySelector('.qty-input').value
        };
    });

    if(!confirm(`${orderList.length}건의 품목을 발주 신청하시겠습니까?`)) return;

    fetch('/api/order/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderList)
    })
    .then(res => res.json())
    .then(data => {
        if(data.result > 0) {
            alert("발주 신청이 성공적으로 완료되었습니다.");
            location.href = '/stock/history';
        } else {
            alert("주문 처리에 실패했습니다.");
        }
    })
    .catch(err => alert("서버 통신 중 에러 발생"));
}