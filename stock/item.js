/**
 * 품목 관리 스크립트
 * [상세조회, 수정, 등록, 페이징]
 */

// [1] 품목 목록 조회 (페이징 + 검색)
async function itemVoList(page = 1) {
    try {
        const keyword = document.querySelector("#productName").value;
        const url = `/api/stock/itemList?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`;

        const resp = await fetch(url);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        const { voList, pvo } = data;

        const tbodyTag = document.querySelector("#itemList");
        let str = "";

        if(!voList || voList.length === 0) {
            str = `<tr><td colspan="7" style="padding: 100px 0; text-align: center;">조회된 품목이 없습니다.</td></tr>`;
        } else {
            voList.forEach(vo => {
                // 상태 뱃지 적용 (component.css 규칙)
                const statusHtml = (vo.activeYn === 'N') 
                    ? `<span class="status status-off">비활성</span>` 
                    : `<span class="status status-on">활성</span>`;

                str += `
                    <tr>
                        <td>${vo.itemNo}</td>
                        <td class="link-text" onclick="showDetail(${vo.itemNo})">${vo.itemName}</td>
                        <td>${Number(vo.unitPrice).toLocaleString()}</td>
                        <td>2026/03/23</td> 
                        <td>${vo.stock}</td>
                        <td>${vo.location || '-'}</td>
                        <td>${statusHtml}</td>
                    </tr>`;
            });
        }
        tbodyTag.innerHTML = str;

        // 페이징 그리기
        drawPagination(pvo);

    } catch (err) {
        console.error("목록 조회 중 에러 발생:", err);
    }
}

// [2] 페이징 버튼 생성 (숫자만 남기기)
function drawPagination(pvo) {
    const pArea = document.querySelector("#paginationArea");
    if(!pArea) return;

    let str = "";
    
    // 이전 버튼(<) 코드를 제거했습니다.

    // 페이지 번호 생성
    for(let i = pvo.startPage; i <= pvo.endPage; i++) {
        const activeClass = (pvo.currentPage == i) ? 'active' : '';
        str += `<button type="button" class="page-btn ${activeClass}" 
                        onclick="itemVoList(${i})">${i}</button>`;
    }

    // 다음 버튼(>) 코드를 제거했습니다.

    pArea.innerHTML = str;
}

// [3] 상세 조회 (수정 모달 데이터 세팅)
function showDetail(itemNo) {
    fetch(`/api/stock/${itemNo}`)
    .then(resp => resp.json())
    .then(data => {
        const vo = data.vo;
        document.querySelector("#modalItemNo").value = vo.itemNo;
        document.querySelector("#modalItemName").value = vo.itemName;
        document.querySelector("#modalUnitPrice").value = vo.unitPrice;
        document.querySelector("#modalStock").value = vo.stock;
        document.querySelector("#modalLocation").value = vo.location;
        document.querySelector("#modalActiveYn").value = vo.activeYn ?? 'Y';
        
        document.querySelector("#itemDetailModal").style.display = "block";
    })
    .catch(err => console.error("상세조회 에러:", err));
}

// [4] 수정 처리 (PUT)
async function updateItem() {
    const vo = {
        itemNo: document.querySelector("#modalItemNo").value,
        itemName: document.querySelector("#modalItemName").value,
        unitPrice: document.querySelector("#modalUnitPrice").value,
        stock: document.querySelector("#modalStock").value,
        location: document.querySelector("#modalLocation").value,
        activeYn: document.querySelector("#modalActiveYn").value
    };
    
    try {
        const resp = await fetch("/api/stock", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vo)
        });
        
        if(resp.ok) {
            alert("수정 되었습니다.");
            closeAllModals();
            itemVoList(1); 
        } else {
            alert("수정 실패");
        }
    } catch (err) {
        console.error("수정 에러:", err);
    }
}

// [5] 등록 모달 열기 및 등록 처리
function openInsertModal() {
    const form = document.querySelector("#itemInsertForm");
    if(form) form.reset();
    document.querySelector("#itemInsertModal").style.display = "block";
}

function insertItem() {
    const data = {
        itemName: document.querySelector("#insertItemName").value,
        unitPrice: document.querySelector("#insertUnitPrice").value,
        stock: document.querySelector("#insertStock").value,
        location: document.querySelector("#insertLocation").value
    };

    fetch("/api/stock/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(resp => {
        if (!resp.ok) throw new Error("서버 응답 에러");
        return resp.json();
    })
    .then(data => {
        if(data.result === "1") { 
            alert("신규 품목이 등록되었습니다! 🎉");
            closeAllModals();
            itemVoList(1);
        } else {
            alert("등록에 실패했습니다.");
        }
    })
    .catch(err => {
        console.error("에러 발생:", err);
        alert("통신 중 에러가 발생했습니다.");
    });
}

// [6] 모달 닫기 공통 함수
function closeAllModals() {
    const detailModal = document.querySelector("#itemDetailModal");
    const insertModal = document.querySelector("#itemInsertModal");
    if(detailModal) detailModal.style.display = "none";
    if(insertModal) insertModal.style.display = "none";
}

// [7] 이벤트 바인딩 및 초기화
document.addEventListener("DOMContentLoaded", () => {
    // 초기 로딩
    itemVoList();

    // 검색 클릭 이벤트
    const searchBtn = document.querySelector(".search-btn");
    if(searchBtn) searchBtn.onclick = () => itemVoList(1);

    // 검색 엔터 이벤트
    const searchInput = document.querySelector("#productName");
    if(searchInput) {
        searchInput.onkeyup = (e) => { if(e.key === 'Enter') itemVoList(1); };
    }

    // 모든 닫기 버튼에 이벤트 바인딩
    document.querySelectorAll(".close-modal, .close-insert-modal, .btn-gray-close-modal").forEach(btn => {
        btn.onclick = closeAllModals;
    });

    // 모달 바깥쪽 클릭 시 닫기
    window.onclick = (e) => {
        if(e.target.classList.contains('modal')) closeAllModals();
    };
});