/**
 * 반품 검수 관리 스크립트
 */

// [1] 목록 조회
async function loadList(page = 1) {
    try {
        const keyword = document.getElementById("searchKeyword")?.value.trim() || "";
        const searchType = document.getElementById("searchType")?.value || "itemName";

        const url = `/api/itemcheck/list?currentPage=${page}`
                  + `&keyword=${encodeURIComponent(keyword)}`
                  + `&searchType=${encodeURIComponent(searchType)}`;

        const resp = await fetch(url);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        const { voList, pvo } = data;

        const tbodyTag = document.getElementById("list-body");
        if (!tbodyTag) return;

        let str = "";
        if(!voList || voList.length === 0) {
            str = `<tr><td colspan="6" style="padding: 100px 0; text-align: center;">조회된 검수 내역이 없습니다.</td></tr>`;
        } else {
            voList.forEach(vo => {
                const rawStatus = (vo.status || 'W').toUpperCase().charAt(0);
                const statusMap = {
                    'A': { text: '승인', class: 'status-on' },
                    'R': { text: '반려', class: 'status-off' },
                    'W': { text: '대기', class: 'status-wait' }
                };
                const current = statusMap[rawStatus] || statusMap['W'];

                str += `
                    <tr onclick="loadDetail(${vo.returnNo})" style="cursor:pointer;">
                        <td>${vo.returnNo}</td>
                        <td style="text-align:left; padding-left:20px;">${vo.itemName || vo.productName || '-'}</td>
                        <td>${vo.storeName || '-'}</td>
                        <td>
                            <span class="status ${current.class}">${current.text}</span>
                        </td>
                        <td>${vo.processResult || '-'}</td>
                        <td>${vo.regDate || vo.createdAt || '-'}</td>
                    </tr>`;
            });
        }
        tbodyTag.innerHTML = str;

        renderPagination(pvo);

    } catch (err) {
        console.error("목록 조회 중 에러 발생:", err);
    }
}

// [2] 페이징 렌더링
function renderPagination(pvo) {
    const pArea = document.getElementById("paginationArea");
    if(!pArea || !pvo || pvo.totalCount === 0) {
        if(pArea) pArea.innerHTML = "";
        return;
    }

    let str = "";
    if(pvo.startPage > 1) {
        str += `<button type="button" class="page-btn" onclick="loadList(${pvo.startPage - 1})">&lt;</button>`;
    }

    for(let i = pvo.startPage; i <= pvo.endPage; i++) {
        const activeClass = (Number(pvo.currentPage) === i) ? 'active' : '';
        str += `<button type="button" class="page-btn ${activeClass}" onclick="loadList(${i})">${i}</button>`;
    }

    if(pvo.endPage < pvo.maxPage) {
        str += `<button type="button" class="page-btn" onclick="loadList(${pvo.endPage + 1})">&gt;</button>`;
    }
    pArea.innerHTML = str;
}

// [3] 상세 조회 (모달 열기)
async function loadDetail(no) {
    if(!no) return;
    try {
        const resp = await fetch(`/api/itemcheck/${no}`);
        if(!resp.ok) throw new Error("상세 데이터 로드 실패");

        const data = await resp.json();
        const vo = data.vo || data;

        // JSP ID와 데이터 바인딩
        document.getElementById("returnNo").value = vo.returnNo || "";
        document.getElementById("storeName").value = vo.storeName || "";
        document.getElementById("productName").value = vo.itemName || vo.productName || "";
        document.getElementById("itemQty").value = vo.quantity || vo.itemQty || 0;
        document.getElementById("regDate").value = vo.regDate || vo.createdAt || "";

        const statusSelect = document.getElementById("checkStatus");
        if(statusSelect) {
            statusSelect.value = (vo.status || "W").toUpperCase().charAt(0);
        }

        // 모달 표시
        const modal = document.getElementById("checkModal");
        if(modal) modal.style.display = "flex";

    } catch (err) {
        console.error("상세조회 에러:", err);
    }
}

// [4] 결과 저장
async function saveCheck() {
    const returnNo = document.getElementById("returnNo")?.value;
    const status = document.getElementById("checkStatus")?.value;

    if(!returnNo) return;
    if(!confirm("검수 결과를 저장하시겠습니까?")) return;

    try {
        const resp = await fetch("/api/itemcheck", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                returnNo: returnNo,
                status: status
            })
        });

        if(resp.ok) {
            alert("검수 처리가 완료되었습니다.");
            closeDetail();
            loadList(1);
        } else {
            alert("저장에 실패했습니다.");
        }
    } catch (err) {
        console.error("저장 에러:", err);
    }
}

// [5] 모달 닫기
function closeDetail() {
    const modal = document.getElementById("checkModal");
    if(modal) modal.style.display = "none";
    document.getElementById("check-form").reset();
}

// [6] 초기화 및 검색창 엔터 이벤트
document.addEventListener("DOMContentLoaded", () => {
    // 1. 페이지 로드 시 첫 번째 페이지 데이터 조회
    loadList(1);

    // 2. 검색창에서 엔터키 누르면 검색 실행
    const searchInput = document.getElementById("searchKeyword");
    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                loadList(1);
            }
        });
    }
});
