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
        // 세션 만료 대응
        if (res.status === 401) {
            alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
            location.href = "/login";
            return;
        }
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
 * 2. 테이블 렌더링 (구조 수정 버전)
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
        const displayStoreName = item.storeName || item.STORE_NAME || '본사';

        tr.innerHTML = `
            <td><input type="checkbox" class="item-check" data-no="${item.itemNo}"></td>
            <td>${item.itemNo}</td>
            <td style="text-align:left; padding-left:20px;">${item.itemName}</td>
            <td>${displayStoreName}</td> 
            <td>
                <div class="qty-control">
                    <button type="button" class="qty-btn" onclick="changeQty(this, -1)">-</button>
                    <input type="text" class="qty-input" value="1" readonly>
                    <button type="button" class="qty-btn" onclick="changeQty(this, 1)">+</button>
                </div>
            </td>
            <td>${new Date().toLocaleDateString()}</td>
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
 * 4. 페이징 처리 (화살표 삭제 및 디자인 통합)
 */
function renderPagination(paging) {
    const pgnArea = document.getElementById('pagination');
    if (!pgnArea || !paging) return;
    pgnArea.innerHTML = '';

    // 숫자 버튼만 생성
    for (let i = paging.startPage; i <= paging.endPage; i++) {
        const numBtn = document.createElement('button');
        numBtn.type = 'button';
        numBtn.className = 'page-btn'; // component.css의 버튼 스타일
        numBtn.innerText = i;
        
        if (i === paging.currentPage) {
            numBtn.classList.add('active'); // 활성화 시 밤색 배경
        } else {
            numBtn.onclick = () => loadOrderList(i);
        }
        pgnArea.appendChild(numBtn);
    }
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
            location.href = '/stock/product/history';
        } else {
            alert("주문 처리에 실패했습니다.");
        }
    })
    .catch(err => alert("서버 통신 중 에러 발생"));
}