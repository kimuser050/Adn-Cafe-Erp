/**
 * 입고 내역 관리 스크립트
 */

async function inboundList(page = 1) {
    try {
        const keyword = document.querySelector("#incomingSearch")?.value || "";
        const url = `/api/inbound/selectList?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`;

        const resp = await fetch(url);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        // 서버에서 보낸 키값(voList, pvo)을 정확히 매칭
        const voList = data.voList;
        const pvo = data.pvo;

        const tbodyTag = document.querySelector("#incomingList");
        let str = "";

        if(!voList || voList.length === 0) {
            str = `<tr><td colspan="8" style="padding: 100px 0; text-align:center; color: #999;">조회된 입고 내역이 없습니다.</td></tr>`;
        } else {
            voList.forEach(vo => {
                // 매퍼 컬럼명에 맞게 필드 수정 (inNo, itemName, unitPrice, quantity, totalPrice, inDate, itemNo)
                str += `
                    <tr>
                        <td>${vo.inNo}</td>
                        <td style="text-align: left; padding-left: 20px;">${vo.itemName}</td>
                        <td>${Number(vo.unitPrice || 0).toLocaleString()}</td>
                        <td>${Number(vo.quantity || 0).toLocaleString()}</td>
                        <td style="font-weight: bold; color: #4a382e;">
                            ${Number(vo.totalPrice || 0).toLocaleString()}
                        </td>
                        <td>${vo.inDate || '-'}</td>
                        <td>${vo.itemNo || '-'}</td>
                        <td><span class="status-badge">${vo.deletedYn === 'N' ? '정상' : '삭제'}</span></td>
                    </tr>`;
            });
        }
        tbodyTag.innerHTML = str;
        drawPagination(pvo);

    } catch (err) {
        console.error("입고 목록 조회 에러:", err);
    }
}

function drawPagination(pvo) {
    const pArea = document.querySelector("#paginationArea");
    if(!pArea || !pvo) return;

    let str = "";
    if(pvo.startPage > 1) {
        str += `<button type="button" class="page-btn" onclick="inboundList(${pvo.startPage - 1})">&lt;</button>`;
    }
    
    for(let i = pvo.startPage; i <= pvo.endPage; i++) {
        str += `<button type="button" 
                        class="page-btn ${pvo.currentPage == i ? 'active' : ''}" 
                        onclick="inboundList(${i})">${i}</button>`;
    }
    
    if(pvo.endPage < pvo.maxPage) {
        str += `<button type="button" class="page-btn" onclick="inboundList(${pvo.endPage + 1})">&gt;</button>`;
    }
    pArea.innerHTML = str;
}

document.addEventListener("DOMContentLoaded", () => {
    inboundList();

    const searchBtn = document.querySelector(".btn-brown-search");
    if(searchBtn) {
        searchBtn.addEventListener("click", () => inboundList(1));
    }

    const searchInput = document.querySelector("#incomingSearch");
    if(searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            if(e.key === 'Enter') inboundList(1);
        });
    }
});