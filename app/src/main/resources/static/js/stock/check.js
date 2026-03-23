/**
 * 반품 검수 관리 스크립트 (검색 수리 및 CSS 최적화 완료)
 */

// [1] 반품 검수 목록 조회
async function loadList(page = 1) {
    try {
        // [검색어 추출] ID 우선, 없으면 클래스로 찾기
        const searchInput = document.getElementById("checkSearch") || document.querySelector(".search-box-input");
        const searchTypeSelect = document.getElementById("searchType") || document.querySelector(".search-select");
        
        const keyword = searchInput ? searchInput.value.trim() : "";
        const searchType = searchTypeSelect ? searchTypeSelect.value : "productName";
        
        // 디버깅용 로그 (F12 콘솔에서 확인 가능)
        console.log(`[조회] 페이지: ${page}, 타입: ${searchType}, 키워드: ${keyword}`);

        const url = `/api/itemcheck/list?currentPage=${page}&keyword=${encodeURIComponent(keyword)}&searchType=${searchType}`;

        const resp = await fetch(url);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        // 서버 응답 구조에 따라 voList, pvo 추출
        const { voList, pvo } = data; 

        const tbodyTag = document.getElementById("list-body");
        if (!tbodyTag) return;

        let str = "";
        if(!voList || voList.length === 0) {
            str = `<tr><td colspan="6" style="padding: 100px 0; text-align: center;">조회된 검수 내역이 없습니다.</td></tr>`;
        } else {
            voList.forEach(vo => {
                // [상태 매핑] CSS [8]번 .status 클래스와 연동
                const rawStatus = (vo.status || 'W').toUpperCase().charAt(0);
                const statusMap = {
                    'A': { text: '승인', class: 'status-on' },
                    'R': { text: '반려', class: 'status-off' },
                    'W': { text: '대기', class: 'status-pending' }
                };
                const current = statusMap[rawStatus] || statusMap['W'];

                str += `
                    <tr onclick="loadDetail(${vo.returnNo})" style="cursor:pointer;">
                        <td>${vo.returnNo}</td>
                        <td style="text-align:left; padding-left:20px;">${vo.productName || vo.itemName || '-'}</td>
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

// [2] 페이징 버튼 생성 (CSS [5]번 스타일 유지)
function renderPagination(pvo) {
    const pArea = document.getElementById("paginationArea");
    if(!pArea || !pvo || pvo.totalCount === 0) {
        if(pArea) pArea.innerHTML = "";
        return;
    }

    let str = "";
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

// [3] 상세 조회 (모달 데이터 바인딩)
async function loadDetail(no) {
    if(!no) return;
    try {
        const resp = await fetch(`/api/itemcheck/${no}`);
        if(!resp.ok) throw new Error("상세 데이터 로드 실패");
        
        const data = await resp.json();
        const vo = data.vo || data;
        
        const setVal = (id, val) => {
            const el = document.querySelector(id);
            if(el) el.value = val || "";
        };

        setVal("#returnNo", vo.returnNo);
        setVal("#storeName", vo.storeName);
        setVal("#productName", vo.productName || vo.itemName);
        setVal("#itemQty", vo.itemQty || vo.quantity);
        setVal("#regDate", vo.regDate || vo.createdAt);
        setVal("#checkReason", vo.checkReason);
        
        const statusSelect = document.getElementById("checkStatus");
        if(statusSelect) {
            statusSelect.value = (vo.status || "W").toUpperCase().charAt(0);
        }
        
        const modal = document.getElementById("checkModal");
        if(modal) modal.style.display = "flex";
        
    } catch (err) {
        console.error("상세조회 에러:", err);
        alert("상세 데이터를 가져오는 중 오류가 발생했습니다.");
    }
}

// [4] 검수 결과 저장
async function saveCheck() {
    const returnNo = document.getElementById("returnNo")?.value;
    const status = document.getElementById("checkStatus")?.value;
    const reason = document.getElementById("checkReason")?.value;
    
    if(!returnNo) return;
    if(!confirm("검수 결과를 저장하시겠습니까?")) return;

    try {
        const resp = await fetch("/api/itemcheck", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ returnNo, status, reason })
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
        alert("서버 통신 중 오류가 발생했습니다.");
    }
}

// [5] 모달 닫기
function closeDetail() {
    const modal = document.getElementById("checkModal");
    if(modal) modal.style.display = "none";
}

// [6] 이벤트 바인딩 (검색 및 초기화)
document.addEventListener("DOMContentLoaded", () => {
    // [중요] 최초 1회 실행
    loadList(1);

    const searchInput = document.getElementById("checkSearch");
    const searchBtn = document.querySelector(".search-btn");
    
    // 엔터키 처리
    searchInput?.addEventListener("keydown", (e) => {
        if(e.key === "Enter") {
            e.preventDefault(); 
            loadList(1);
        }
    });

    // 검색 버튼 클릭 (JSP의 ⌕ 버튼)
    searchBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        loadList(1);
    });

    // 배경 클릭 시 닫기
    window.onclick = (e) => {
        const modal = document.getElementById("checkModal");
        if(e.target === modal) closeDetail();
    };
});