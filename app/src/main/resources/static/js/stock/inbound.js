/**
 * 입고 내역 관리 스크립트
 * [목록 조회, 검색, 페이징]
 */

// [1] 입고내역 조회 (페이징 + 검색)
async function inboundList(page = 1) {
    try {
        // 검색어 가져오기
        const keyword = document.querySelector("#incomingSearch")?.value || "";
        
        // API 호출 (컨트롤러 @RequestMapping 경로와 일치 확인)
        const url = `/api/inbound/selectList?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`;

        const resp = await fetch(url);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        const { voList, pvo } = data;

        const tbodyTag = document.querySelector("#incomingList");
        let str = "";

        // 데이터가 없을 때 처리
        if(!voList || voList.length === 0) {
            str = `<tr><td colspan="8" style="padding: 100px 0; color: #999;">조회된 입고 내역이 없습니다.</td></tr>`;
        } else {
            // 데이터 출력 루프
            voList.forEach(vo => {
                // 입고일 포맷팅 (Mapper에서 IN_DATE로 별칭 준 경우)
                const displayDate = vo.inDate || '2026-03-18';
                // 총금액 계산
                const totalPrice = vo.totalPrice || (vo.unitPrice * (vo.quantity || 0));
                
                str += `
                    <tr>
                        <td>${vo.inNo}</td>
                        <td style="text-align: left; padding-left: 20px;">${vo.itemName}</td>
                        <td>${Number(vo.unitPrice).toLocaleString()}</td>
                        <td>${vo.quantity || 0}</td>
                        <td style="font-weight: bold; color: #4a382e;">
                            ${Number(totalPrice).toLocaleString()}
                        </td>
                        <td>${displayDate}</td>
                        <td>${vo.location || '-'}</td> <td><span class="status-badge">${vo.deletedYn === 'N' ? '정상' : '삭제'}</span></td>
                    </tr>`;
            });
        }
        tbodyTag.innerHTML = str;

        // 하단 페이징 버튼 생성
        drawPagination(pvo);

    } catch (err) {
        console.error("입고 목록 조회 에러:", err);
    }
}

// [2] 페이징 버튼 렌더링
function drawPagination(pvo) {
    const pArea = document.querySelector("#paginationArea");
    if(!pArea || !pvo) return;

    let str = "";
    // [이전] 버튼
    if(pvo.startPage > 1) {
        str += `<button type="button" class="page-btn" onclick="inboundList(${pvo.startPage - 1})">&lt;</button>`;
    }
    
    // 페이지 번호 버튼
    for(let i = pvo.startPage; i <= pvo.endPage; i++) {
        str += `<button type="button" 
                        class="page-btn ${pvo.currentPage == i ? 'active' : ''}" 
                        onclick="inboundList(${i})">${i}</button>`;
    }
    
    // [다음] 버튼
    if(pvo.endPage < pvo.maxPage) {
        str += `<button type="button" class="page-btn" onclick="inboundList(${pvo.endPage + 1})">&gt;</button>`;
    }
    pArea.innerHTML = str;
}

// [3] 초기화 및 이벤트 리스너 설정
document.addEventListener("DOMContentLoaded", () => {
    // 초기 목록 조회
    inboundList();

    // 검색 버튼 클릭 이벤트
    const searchBtn = document.querySelector(".btn-brown-search");
    if(searchBtn) {
        searchBtn.addEventListener("click", () => inboundList(1));
    }

    // 검색창 엔터키 이벤트
    const searchInput = document.querySelector("#incomingSearch");
    if(searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            if(e.key === 'Enter') inboundList(1);
        });
    }
});