/**
 * 입고 내역 관리 스크립트 (Clean Version)
 */
async function loadList(page = 1) {
    try {
        const keyword = document.getElementById("incomingSearch")?.value.trim() || "";
        const url = `/api/inbound/selectList?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`;

        const resp = await fetch(url);
        const data = await resp.json();
        const { voList, pvo } = data;

        const tbody = document.getElementById("incomingList");
        if (!tbody) return;

        if (!voList || voList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="padding: 100px 0; text-align: center;">조회된 입고 내역이 없습니다.</td></tr>`;
            return;
        }

        tbody.innerHTML = voList.map(vo => `
            <tr>
                <td>${vo.inNo || '-'}</td>
                <td style="text-align:left; padding-left:20px;">${vo.itemName || '-'}</td>
                <td>${Number(vo.unitPrice || 0).toLocaleString()}</td>
                <td>${vo.quantity || 0}</td>
                <td>${Number(vo.totalPrice || 0).toLocaleString()}</td>
                <td>${vo.inDate || '-'}</td>
                <td>${vo.itemNo || '-'}</td>
                <td><span class="status status-on">입고완료</span></td>
            </tr>
        `).join('');

        renderPagination(pvo);
    } catch (err) {
        console.error("데이터 로드 실패:", err);
    }
}

function renderPagination(pvo) {
    const pArea = document.getElementById("paginationArea");
    if (!pArea || !pvo) return;

    let html = "";
    if (pvo.startPage > 1) {
        html += `<button class="page-btn" onclick="loadList(${pvo.startPage - 1})">&lt;</button>`;
    }

    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        html += `<button class="page-btn ${Number(pvo.currentPage) === i ? 'active' : ''}" onclick="loadList(${i})">${i}</button>`;
    }

    if (pvo.endPage < pvo.maxPage) {
        html += `<button class="page-btn" onclick="loadList(${pvo.endPage + 1})">&gt;</button>`;
    }
    pArea.innerHTML = html;
}

function searchInbound() {
    loadList(1);
}

document.addEventListener("DOMContentLoaded", () => {
    loadList(1);
    document.getElementById("incomingSearch")?.addEventListener("keyup", (e) => {
        if (e.key === "Enter") loadList(1);
    });
});