/**
 * [Coffee Prince ERP - 발주 신청 전용 JS]
 * 기능: 목록 조회, 페이징, 수량 조절, 일괄 주문 제출
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 초기 로드
    loadOrderList(1);

    // 2. 검색창 엔터 이벤트
    document.getElementById('orderKeyword')?.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') loadOrderList(1);
    });

    // 3. 전체 선택 체크박스 로직
    document.getElementById('checkAll')?.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('input[name="orderCheck"]').forEach(cb => {
            cb.checked = isChecked;
        });
    });
});

/**
 * [목록 로드] 상품 리스트와 페이징 처리
 */
async function loadOrderList(page = 1) {
    try {
        const keyword = document.getElementById('orderKeyword')?.value.trim() || "";
        const url = `/api/order/list?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`;

        const resp = await fetch(url);
        if (!resp.ok) throw new Error("네트워크 응답 에러");

        const data = await resp.json();

        // 서버 데이터 구조에 맞춰 pvo 또는 pagingInfo 선택
        const list = data.voList || [];
        const pvo = data.pvo || data.pagingInfo;

        const body = document.getElementById('orderBody');
        if (!body) return;

        if (list.length === 0) {
            body.innerHTML = '<tr><td colspan="6" style="padding: 100px 0; text-align: center;">신청 가능한 상품이 없습니다.</td></tr>';
            return;
        }

        body.innerHTML = list.map(vo => `
            <tr>
                <td><input type="checkbox" name="orderCheck" value="${vo.itemNo}"></td>
                <td>${vo.itemNo}</td>
                <td style="text-align:left; padding-left:20px; font-weight:600;">${vo.itemName}</td>
                <td>${vo.storeName || '대전점'}</td>
                <td>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <button type="button" class="page-btn" onclick="changeQty(this, -1)" style="width:28px; height:28px; line-height:1;">-</button>
                        <input type="number" name="orderQty" value="0" min="0"
                               style="width: 45px; text-align: center; border: 1px solid #ddd; border-radius: 4px; height: 26px;">
                        <button type="button" class="page-btn" onclick="changeQty(this, 1)" style="width:28px; height:28px; line-height:1;">+</button>
                    </div>
                </td>
                <td style="color: #888;">${new Date().toLocaleDateString()}</td>
            </tr>
        `).join('');

        renderPagination(pvo);

    } catch (err) {
        console.error("목록 로드 실패:", err);
    }
}

/**
 * [수량 조절] 버튼 클릭 시 수량 변경 및 체크박스 연동
 */
function changeQty(btn, delta) {
    const input = btn.parentElement.querySelector('input[name="orderQty"]');
    let val = (parseInt(input.value) || 0) + delta;
    if (val < 0) val = 0;
    input.value = val;

    const row = btn.closest('tr');
    const checkbox = row.querySelector('input[name="orderCheck"]');
    if (checkbox) checkbox.checked = (val > 0);
}

/**
 * [페이징 렌더링] 하단 번호 생성
 */
function renderPagination(pvo) {
    const pgn = document.getElementById('pagination');
    if (!pgn) return;
    pgn.innerHTML = '';

    if (!pvo || pvo.maxPage <= 0) return;

    let html = "";
    if (pvo.startPage > 1) {
        html += `<button type="button" class="page-btn" onclick="loadOrderList(${pvo.startPage - 1})">&lt;</button>`;
    }

    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        const activeClass = (Number(pvo.currentPage) === i) ? 'active' : '';
        html += `<button type="button" class="page-btn ${activeClass}" onclick="loadOrderList(${i})">${i}</button>`;
    }

    if (pvo.endPage < pvo.maxPage) {
        html += `<button type="button" class="page-btn" onclick="loadOrderList(${pvo.endPage + 1})">&gt;</button>`;
    }
    pgn.innerHTML = html;
}

/**
 * [일괄 주문] 주문 버튼 클릭 시 서버 전송
 */
function submitBulkOrder() {
    const rows = document.querySelectorAll('#orderBody tr');
    const orderList = [];

    rows.forEach(row => {
        const checkbox = row.querySelector('input[name="orderCheck"]');
        const qtyInput = row.querySelector('input[name="orderQty"]');

        if (checkbox && checkbox.checked) {
            const qty = parseInt(qtyInput.value) || 0;
            if (qty > 0) {
                orderList.push({
                    itemNo: checkbox.value,
                    quantity: qty
                });
            }
        }
    });

    if (orderList.length === 0) {
        alert("주문할 상품을 선택하고 수량을 입력해주세요.");
        return;
    }

    if (!confirm(`${orderList.length}건의 항목을 주문하시겠습니까?`)) return;

    // 서버 POST 요청 (URL은 실제 컨트롤러 매핑 주소 확인 필요)
    fetch('/api/order/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderList)
    })
    .then(res => res.json())
    .then(data => {
        if (data.result > 0 || data.success) {
            alert("주문이 성공적으로 완료되었습니다.");
            location.href = '/stock/product/history'; // 주문 상태 탭으로 이동
        } else {
            alert("주문 처리에 실패했습니다.");
        }
    })
    .catch(err => {
        console.error("주문 에러:", err);
        alert("통신 중 에러가 발생했습니다.");
    });
}