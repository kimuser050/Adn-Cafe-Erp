/**
 * =========================================================
 * check.js (최종 수정본)
 * ---------------------------------------------------------
 * [역할]
 * - 반품 검수 목록 조회 (사원명/매장명 포함 7컬럼)
 * - 상세 내역 조회 (담당자 필드 바인딩 추가)
 * - 검수 결과(승인/반려) 저장 및 페이지 갱신
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    initReturnPage();
});

/**
 * 페이지 초기화
 */
async function initReturnPage() {
    // 목록 로딩 (사원 권한에 따른 필터링은 서버 Mapper에서 처리됨)
    loadList(1);
}

/**
 * 목록 조회
 * @param {number} page - 조회할 페이지 번호
 */
async function loadList(page = 1) {
    try {
        const resp = await fetch(`/api/itemcheck/list?currentPage=${page}`);
        const data = await resp.json();
        const { voList, pvo } = data;
        const tbody = document.getElementById("list-body");

        let html = "";
        if (!voList || voList.length === 0) {
            // 7개 컬럼에 맞춰 colspan 수정
            html = '<tr><td colspan="7" style="padding:50px; text-align:center; color:var(--color-muted);">조회된 내역이 없습니다.</td></tr>';
        } else {
            voList.forEach(vo => {
                const status = getStatusInfo(vo.status);
                
                // [수정] JSP 헤더 순서: 번호 - 상품명 - 매장명 - 신청자 - 상태 - 처리결과 - 신청일
                html += `
                    <tr onclick="loadDetail(${vo.returnNo})" style="cursor:pointer;">
                        <td>${vo.returnNo}</td>
                        <td style="text-align:left; font-weight:600;">${vo.itemName || vo.productName}</td>
                        <td>${vo.storeName}</td>
                        <td>${vo.empName || '-'}</td> <td><span class="status ${status.class}">${status.text}</span></td>
                        <td>${vo.processResult || '-'}</td>
                        <td>${vo.regDate || vo.createdAt}</td>
                    </tr>`;
            });
        }
        tbody.innerHTML = html;
        
        // 페이징 버튼 렌더링
        renderPagination(pvo);
        
    } catch (err) {
        console.error("목록 로딩 에러:", err);
    }
}

/**
 * 상세 조회 및 섹션 전환
 */
async function loadDetail(no) {
    try {
        const res = await fetch(`/api/itemcheck/${no}`);
        const vo = await res.json();
        
        // [수정] JSP에 추가된 id="empName" 필드에도 데이터 바인딩
        document.getElementById("returnNo").value = vo.returnNo;
        document.getElementById("storeName").value = vo.storeName;
        document.getElementById("empName").value = vo.empName || "미지정"; // [추가] 신청 사원명
        document.getElementById("productName").value = vo.itemName || vo.productName;
        document.getElementById("quantity").value = vo.quantity;
        document.getElementById("createdAt").value = vo.regDate || vo.createdAt;
        document.getElementById("reason").value = vo.reason || "";
        document.getElementById("status").value = vo.status || "W";

        // 화면 전환
        document.getElementById("list-section").style.display = "none";
        document.getElementById("detail-section").style.display = "block";
        
        window.scrollTo(0, 0);
    } catch (err) {
        console.error("상세조회 에러:", err);
        alert("상세 데이터를 가져오지 못했습니다.");
    }
}

/**
 * 상세 닫기 (목록으로 복귀)
 */
function closeDetail() {
    document.getElementById("detail-section").style.display = "none";
    document.getElementById("list-section").style.display = "block";
}

/**
 * 검수 결과 저장 (PUT)
 */
async function saveCheck() {
    const returnNo = document.getElementById("returnNo").value;
    const status = document.getElementById("status").value;
    const reason = document.getElementById("reason").value;

    if (!confirm("검수 결과를 저장하시겠습니까?")) return;

    try {
        const res = await fetch("/api/itemcheck", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ returnNo, status, reason })
        });

        if (res.ok) {
            alert("저장되었습니다.");
            closeDetail();
            loadList(1); 
        } else {
            alert("저장 처리에 실패했습니다.");
        }
    } catch (err) {
        console.error("저장 중 오류 발생:", err);
        alert("저장 중 오류가 발생했습니다.");
    }
}

/**
 * 상태값 매핑 함수
 */
function getStatusInfo(stat) {
    const map = {
        'A': { text: '승인', class: 'status-on' },
        'R': { text: '반려', class: 'status-off' },
        'W': { text: '대기', class: 'status-pending' }
    };
    return map[stat] || map['W'];
}

/**
 * 페이징 버튼 렌더링
 */
function renderPagination(pvo) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer || !pvo) return;

    let html = "";
    
    const prevDisabled = pvo.startPage <= 1 ? "disabled" : "";
    html += `<button class="page-btn ${prevDisabled}" onclick="loadList(${pvo.startPage - 1})" ${prevDisabled}>&lt;</button>`;

    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        const activeClass = (i === pvo.currentPage) ? "active" : "";
        html += `<button class="page-btn ${activeClass}" onclick="loadList(${i})">${i}</button>`;
    }

    const nextDisabled = pvo.endPage >= pvo.totalPages ? "disabled" : "";
    html += `<button class="page-btn ${nextDisabled}" onclick="loadList(${pvo.endPage + 1})" ${nextDisabled}>&gt;</button>`;

    paginationContainer.innerHTML = html;
}