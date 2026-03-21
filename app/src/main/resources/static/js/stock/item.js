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
            str = `<tr><td colspan="7" style="padding: 100px 0;">조회된 품목이 없습니다.</td></tr>`;
        } else {
            voList.forEach(vo => {
                const rowClass = vo.activeYn === 'N' ? 'class="inactive"' : '';
                str += `
                    <tr onclick="showDetail(${vo.itemNo})" ${rowClass}>
                        <td>${vo.itemNo}</td>
                        <td>${vo.itemName}</td>
                        <td>${Number(vo.unitPrice).toLocaleString()}</td>
                        <td>2026/03/03</td> 
                        <td>${vo.stock}</td>
                        <td>${vo.location}</td>
                        <td>${vo.activeYn ?? 'Y'}</td>
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

// [2] 페이징 버튼 생성
function drawPagination(pvo) {
    const pArea = document.querySelector("#paginationArea");
    if(!pArea) return;

    let str = "";
    // 이전 버튼
    if(pvo.startPage > 1) {
        str += `<button type="button" onclick="itemVoList(${pvo.startPage - 1})">&lt;</button>`;
    }
    // 페이지 번호
    for(let i = pvo.startPage; i <= pvo.endPage; i++) {
        str += `<button type="button" class="${pvo.currentPage == i ? 'active' : ''}" 
                        onclick="itemVoList(${i})">${i}</button>`;
    }
    // 다음 버튼
    if(pvo.endPage < pvo.maxPage) {
        str += `<button type="button" onclick="itemVoList(${pvo.endPage + 1})">&gt;</button>`;
    }
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
            document.querySelector("#itemDetailModal").style.display = "none";
            itemVoList(); 
        } else {
            alert("수정 실패");
        }
    } catch (err) {
        console.error("수정 에러:", err);
    }
}

// [5] 등록 모달 열기
function openInsertModal() {
    document.querySelector("#itemInsertForm").reset();
    document.querySelector("#itemInsertModal").style.display = "block";
}

function insertItem() {
    // 1. 데이터 가져오기
    const itemName = document.querySelector("#insertItemName").value;
    const unitPrice = document.querySelector("#insertUnitPrice").value;
    const stock = document.querySelector("#insertStock").value;
    const locationName = document.querySelector("#insertLocation").value;

    const data = {
        itemName: itemName,
        unitPrice: unitPrice,
        stock: stock,
        location: locationName
    };

    // 2. 서버 통신
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
        // 서버 컨트롤러에서 map.put("result", result + "") 로 보냈으므로 data.result 확인
        if(data.result === "1") { 
            alert("신규 품목이 등록되었습니다! 🎉");
            location.reload(); // 페이지 새로고침해서 목록 갱신
        } else {
            alert("등록에 실패했습니다. 다시 시도해주세요.");
        }
    })
    .catch(err => {
        console.error("에러 발생:", err);
        alert("통신 중 에러가 발생했습니다.");
    });
}

// [7] 이벤트 바인딩 및 초기화
document.addEventListener("DOMContentLoaded", () => {
    // 초기 로딩
    itemVoList();

    // 검색 클릭 이벤트
    const searchBtn = document.querySelector(".btn-brown-search");
    if(searchBtn) searchBtn.onclick = () => itemVoList(1);

    // 검색 엔터 이벤트
    const searchInput = document.querySelector("#productName");
    if(searchInput) {
        searchInput.onkeyup = (e) => { if(e.key === 'Enter') itemVoList(1); };
    }

    // 상세 모달 닫기
    document.querySelectorAll(".close-modal, .btn-gray-close-modal").forEach(btn => {
        btn.onclick = () => document.querySelector("#itemDetailModal").style.display = "none";
    });

    // 등록 모달 닫기
    document.querySelectorAll(".close-insert-modal, .btn-gray-close-insert").forEach(btn => {
        btn.onclick = () => document.querySelector("#itemInsertModal").style.display = "none";
    });

    // 모달 바깥쪽 클릭 시 닫기
    window.onclick = (e) => {
        const detailModal = document.querySelector("#itemDetailModal");
        const insertModal = document.querySelector("#itemInsertModal");
        if(e.target === detailModal) detailModal.style.display = "none";
        if(e.target === insertModal) insertModal.style.display = "none";
    };
});