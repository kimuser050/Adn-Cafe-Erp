// 전역 상태 관리
let currentTab = 'apply'; 

document.addEventListener("DOMContentLoaded", () => {
    // 1. 초기 리스트 로드
    loadData(1);

    // 2. 검색창 엔터 이벤트 (통합)
    const searchInput = document.querySelector("#productName");
    if (searchInput) {
        searchInput.onkeyup = (e) => {
            if (e.key === 'Enter') loadData(1);
        };
    }
});

/**
 * [공통] 탭 전환 함수
 */
function switchTab(type) {
    const tabs = document.querySelectorAll(".tab-btn");
    currentTab = type;

    // 탭 UI 활성화 처리
    tabs[0].classList.toggle("active", type === 'apply');
    tabs[1].classList.toggle("active", type === 'history');

    // 하단 주문 버튼 노출 제어 (신청 탭에서만 보임)
    const orderFooter = document.querySelector("#orderAction");
    if(orderFooter) orderFooter.style.display = (type === 'apply' ? 'flex' : 'none');

    loadData(1); // 데이터 새로고침
}

/**
 * [조회] 데이터 로드 (신청 리스트 / 발주 이력 통합)
 */
async function loadData(page = 1) {
    const keyword = document.querySelector("#productName").value.trim();
    // 탭 종류에 따라 API 주소 분기
    const url = currentTab === 'apply' 
        ? `/api/order/list?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`
        : `/api/order/history?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`;

    try {
        const resp = await fetch(url);
        const data = await resp.json();
        const tbody = document.querySelector("#itemList");
        const thead = document.querySelector("#thead"); // <thead> 선택자 추가 필요

        if (!tbody) return;

        // 1. 헤더 변경 (이미지 레이아웃 기준)
        if (currentTab === 'apply') {
            thead.innerHTML = `<tr><th><input type="checkbox" onclick="toggleAll(this)"></th><th>번호</th><th>이름</th><th>매장이름</th><th>수량</th><th>요청일</th></tr>`;
        } else {
            thead.innerHTML = `<tr><th>번호</th><th>이름</th><th>매장이름</th><th>수량</th><th>상태</th><th>요청일</th></tr>`;
        }

        // 2. 바디 렌더링
        let html = "";
        const list = data.voList || [];

        if (list.length === 0) {
            html = `<tr><td colspan="6" style="padding:50px; text-align:center;">조회된 내역이 없습니다.</td></tr>`;
        } else {
            list.forEach((vo, idx) => {
                if (currentTab === 'apply') {
                    // [신청 탭] 수량 조절기 포함
                    html += `
                        <tr>
                            <td><input type="checkbox" class="item-check" value="${vo.itemNo}"></td>
                            <td>${idx + 1}</td>
                            <td style="font-weight:bold; color:#4a382e;">${vo.itemName}</td>
                            <td>${vo.storeCode || '강남지점'}</td>
                            <td>
                                <div class="qty-control">
                                    <button type="button" class="qty-btn" onclick="changeQty(this, -1)">-</button>
                                    <input type="text" class="qty-input" value="1" readonly>
                                    <button type="button" class="qty-btn" onclick="changeQty(this, 1)">+</button>
                                </div>
                            </td>
                            <td>${new Date().toISOString().substring(0, 10)}</td>
                        </tr>`;
                } else {
                    // [상태 탭] 상태 배지 포함
                    const statusMap = {
                        'W': '<span class="badge badge-wait">대기</span>',
                        'A': '<span class="badge badge-done">승인</span>',
                        'F': '<span class="badge badge-done">완료</span>',
                        'R': '<span class="badge badge-cancel">거절</span>'
                    };
                    html += `
                        <tr>
                            <td>${vo.orderNo}</td>
                            <td style="font-weight:bold; color:#4a382e;">${vo.itemName}</td>
                            <td>${vo.storeCode || '강남지점'}</td>
                            <td>${vo.quantity}</td>
                            <td>${statusMap[vo.status] || '대기'}</td>
                            <td>${vo.requestDate ? vo.requestDate.substring(0, 10) : '-'}</td>
                        </tr>`;
                }
            });
        }
        tbody.innerHTML = html;
        if (data.pvo) drawPagination(data.pvo);

    } catch (err) {
        console.error("데이터 로드 에러:", err);
    }
}

/**
 * [액션] 수량 조절 (- 1 +)
 */
function changeQty(btn, delta) {
    const input = btn.parentElement.querySelector(".qty-input");
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    input.value = val;
}

/**
 * [액션] 전체 선택
 */
function toggleAll(checkAll) {
    document.querySelectorAll(".item-check").forEach(cb => cb.checked = checkAll.checked);
}

/**
 * [액션] 발주 신청 제출 (이미지의 우측 하단 [주문] 버튼)
 */
async function submitBulkOrder() {
    const checkedBoxes = document.querySelectorAll(".item-check:checked");
    
    if (checkedBoxes.length === 0) {
        alert("주문할 상품을 선택해주세요.");
        return;
    }

    const orderList = Array.from(checkedBoxes).map(cb => {
        const row = cb.closest("tr");
        return {
            itemNo: cb.value,
            quantity: row.querySelector(".qty-input").value,
            storeCode: "1" 
        };
    });

    if (!confirm(`${orderList.length}건의 상품을 발주하시겠습니까?`)) return;

    try {
        const resp = await fetch("/api/order/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderList)
        });

        if (resp.ok) {
            alert("발주 신청이 완료되었습니다.");
            switchTab('history'); // 성공 시 상태 탭으로 이동
        } else {
            alert("발주 실패");
        }
    } catch (err) {
        console.error("통신 장애:", err);
    }
}

/**
 * [조회] 페이징 그리기
 */
function drawPagination(pvo) {
    const area = document.querySelector("#paginationArea");
    if(!area) return;
    
    let html = "";
    if(pvo.startPage > 1) html += `<button onclick="loadData(${pvo.startPage-1})">&lt;</button>`;
    for(let i=pvo.startPage; i<=pvo.endPage; i++) {
        html += `<button class="${pvo.currentPage==i?'active':''}" onclick="loadData(${i})">${i}</button>`;
    }
    if(pvo.endPage < pvo.maxPage) html += `<button onclick="loadData(${pvo.endPage+1})">&gt;</button>`;
    area.innerHTML = html;
}