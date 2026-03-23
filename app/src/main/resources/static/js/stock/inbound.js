/**
 * 입고 내역 관리 스크립트
 */

// [1] 입고 목록 조회 (페이징 + 검색)
async function inboundList(page = 1) {
    try {
        const keyword = document.querySelector("#incomingSearch")?.value || "";
        // JSP의 searchType 셀렉트 박스 값이 있다면 포함 (없으면 기본값)
        const searchType = document.querySelector("#searchType")?.value || "name";
        const url = `/api/inbound/selectList?currentPage=${page}&keyword=${encodeURIComponent(keyword)}&searchType=${searchType}`;

        const resp = await fetch(url);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        const { voList, pvo } = data;

        const tbodyTag = document.querySelector("#incomingList");
        let str = "";

        if(!voList || voList.length === 0) {
            str = `<tr><td colspan="8" style="padding: 100px 0; text-align: center;">조회된 입고 내역이 없습니다.</td></tr>`;
        } else {
            voList.forEach(vo => {
                // [수정] 상태 뱃지 적용: '정상'일 때 파란불(status-on)이 나오도록 변경
                const statusHtml = (vo.deletedYn === 'N' || !vo.deletedYn) 
                    ? `<span class="status status-on">정상</span>` 
                    : `<span class="status status-off">삭제</span>`;

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
                        <td>${statusHtml}</td>
                    </tr>`;
            });
        }
        tbodyTag.innerHTML = str;
        
        // 페이징 그리기
        drawPagination(pvo);

    } catch (err) {
        console.error("입고 목록 조회 에러:", err);
    }
}

// [2] 페이징 버튼 생성 (화살표 <, > 제거 버전)
function drawPagination(pvo) {
    const pArea = document.querySelector("#paginationArea");
    if(!pArea || !pvo) return;

    let str = "";
    
    // 이전 화살표(&lt;) 제거 완료

    // 페이지 번호만 생성
    for(let i = pvo.startPage; i <= pvo.endPage; i++) {
        const activeClass = (pvo.currentPage == i) ? 'active' : '';
        str += `<button type="button" 
                        class="page-btn ${activeClass}" 
                        onclick="inboundList(${i})">${i}</button>`;
    }

    // 다음 화살표(&gt;) 제거 완료

    pArea.innerHTML = str;
}

// [3] 이벤트 바인딩 및 초기화
document.addEventListener("DOMContentLoaded", () => {
    // 초기 로드
    inboundList();

    // 검색 버튼 클릭 (JSP의 .search-btn 클래스에 맞춤)
    const searchBtn = document.querySelector(".search-btn");
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