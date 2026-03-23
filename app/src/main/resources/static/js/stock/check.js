/**
 * 반품 검수 관리 스크립트
 * [목록 조회, 상세조회(모달), 검수 수정, 페이징]
 */

// [1] 반품 검수 목록 조회 (페이징 + 검색)
async function loadList(page = 1) {
    try {
        const keyword = document.querySelector("#checkSearch")?.value || "";
        const searchType = document.querySelector("#searchType")?.value || "productName";
        
        const url = `/api/itemcheck/list?currentPage=${page}&keyword=${encodeURIComponent(keyword)}&searchType=${searchType}`;

        const resp = await fetch(url);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        const { voList, pvo } = data; 

        const tbodyTag = document.querySelector("#list-body");
        let str = "";

        if(!voList || voList.length === 0) {
            str = `<tr><td colspan="6" style="padding: 100px 0; text-align: center;">조회된 검수 내역이 없습니다.</td></tr>`;
        } else {
            voList.forEach(vo => {
                const status = (vo.status || 'W').toUpperCase();
                let statusHtml = "";
                
                if(status === 'A') {
                    statusHtml = `<span class="status status-on">승인</span>`;
                } else if(status === 'R') {
                    statusHtml = `<span class="status status-off">반려</span>`;
                } else {
                    statusHtml = `<span class="status status-pending">대기</span>`;
                }

                str += `
                    <tr onclick="loadDetail(${vo.returnNo})" style="cursor:pointer;">
                        <td>${vo.returnNo}</td>
                        <td style="text-align:left; padding-left:20px;" class="link-text">${vo.productName || vo.itemName}</td>
                        <td>${vo.storeName}</td>
                        <td>${statusHtml}</td>
                        <td>${vo.processResult || '-'}</td>
                        <td>${vo.regDate || vo.createdAt}</td>
                    </tr>`;
            });
        }
        tbodyTag.innerHTML = str;

        renderPagination(pvo);

    } catch (err) {
        console.error("목록 조회 중 에러 발생:", err);
    }
}

// [2] 페이징 버튼 생성
function renderPagination(pvo) {
    const pArea = document.querySelector("#paginationArea");
    if(!pArea || !pvo) return;

    let str = "";
    if (pvo.totalCount === 0) {
        pArea.innerHTML = "";
        return;
    }

    if(pvo.startPage > 1) {
        str += `<button type="button" onclick="loadList(${pvo.startPage - 1})"><</button>`;
    }

    for(let i = pvo.startPage; i <= pvo.endPage; i++) {
        const activeClass = (Number(pvo.currentPage) === i) ? 'active' : '';
        str += `<button type="button" class="${activeClass}" onclick="loadList(${i})">${i}</button>`;
    }

    if(pvo.endPage < pvo.maxPage) {
        str += `<button type="button" onclick="loadList(${pvo.endPage + 1})">></button>`;
    }

    pArea.innerHTML = str;
}

// [3] 상세 조회
async function loadDetail(no) {
    if(!no) return;

    try {
        const resp = await fetch(`/api/itemcheck/${no}`);
        if(!resp.ok) throw new Error("상세 데이터 로드 실패");
        
        const data = await resp.json();
        const vo = data.vo || data;
        
        document.querySelector("#returnNo").value = vo.returnNo;
        document.querySelector("#storeName").value = vo.storeName;
        document.querySelector("#productName").value = vo.productName || vo.itemName;
        document.querySelector("#itemQty").value = vo.itemQty || vo.quantity;
        document.querySelector("#regDate").value = vo.regDate || vo.createdAt;
        document.querySelector("#checkReason").value = vo.checkReason || "";
        
        // 🔥 핵심 수정 (A/R/W 맞춤)
        let statusVal = vo.status;

        if(statusVal === "A") statusVal = "A";
        else if(statusVal === "R") statusVal = "R";
        else statusVal = "W";

        const statusSelect = document.querySelector("#checkStatus");
        if(statusSelect) statusSelect.value = statusVal;
        
        const modal = document.querySelector("#checkModal");
        if(modal) modal.style.display = "flex";
        
    } catch (err) {
        console.error("상세조회 에러:", err);
    }
}

// [4] 검수 결과 저장
async function saveCheck() {
    const returnNo = document.querySelector("#returnNo").value;
    const status = document.querySelector("#checkStatus").value;
    const reason = document.querySelector("#checkReason").value;
    
    if(!confirm("검수 결과를 저장하시겠습니까?")) return;

    const payload = { returnNo, status, reason };

    try {
        const resp = await fetch("/api/itemcheck", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if(resp.ok) {
            alert("검수 처리가 완료되었습니다. 🎉");
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
    const modal = document.querySelector("#checkModal");
    if(modal) modal.style.display = "none";
}

// [6] 이벤트
document.addEventListener("DOMContentLoaded", () => {
    loadList();

    document.querySelector("#checkSearch")?.addEventListener("keyup", (e) => {
        if(e.key === "Enter") loadList(1);
    });

    document.querySelector(".search-btn")?.addEventListener("click", () => {
        loadList(1);
    });

    window.onclick = (e) => {
        const modal = document.querySelector("#checkModal");
        if(e.target === modal) closeDetail();
    };
});