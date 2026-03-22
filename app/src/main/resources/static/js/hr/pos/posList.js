/* =========================================================
   직급관리 JS
   - 요약 카드
   - 전체 목록 조회
   - 검색
   - 상세조회 모달
   - 활성화 / 비활성화
   - 기본급 수정
   - 보너스율 수정
   - 직급 등록
   ========================================================= */

/* =========================================================
   0. 전역 변수
   ========================================================= */
let currentPosCode = null;
let currentUseYn = null;
let currentMemberList = [];

let currentPage = 1;
let currentSearchType = "all";
let currentKeyword = "";
/* =========================================================
   1. 페이지 진입 시 실행
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        initSearchPlaceholder();
        await loadPosList(1);
    } catch (error) {
        console.log(error);
        alert("직급 페이지 로딩 실패 ...");
    }
});

/* =========================================================
   2. 공통 함수
   ========================================================= */

// 날짜를 YYYY-MM-DD 형태로 잘라서 보여주는 함수
function formatDate(value) {
    if (!value) {
        return "";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}

// useYn 값을 화면용 상태 텍스트/클래스로 변환
function getUseYnInfo(useYn) {
    if (useYn === "Y") {
        return { text: "사용", statusClass: "status-confirmed" };
    }
    return { text: "미사용", statusClass: "status-pending" };
}

function initSearchPlaceholder() {
    const type = document.querySelector("#search-type")?.value;
    const input = document.querySelector("#keyword");

    if (!input) {
        return;
    }

    if (type === "posName") {
        input.placeholder = "직급명을 입력하세요";
    } else if (type === "useYn") {
        input.placeholder = "사용 / 미사용 입력";
    } else {
        input.placeholder = "검색어를 입력하세요";
    }
}

initSearchPlaceholder();

/* =========================================================
   3. 요약 카드
   ========================================================= */

function renderSummary(summary) {
    const totalEl = document.querySelector("#total-pos-count");
    const enableEl = document.querySelector("#enable-pos-count");

    const safe = summary || {};

    const totalCount = Number(safe.totalCount ?? safe.TOTALCOUNT ?? 0);
    const enableCount = Number(safe.enableCount ?? safe.ENABLECOUNT ?? 0);

    if (totalEl) totalEl.innerText = totalCount;
    if (enableEl) enableEl.innerText = enableCount;
}

/* =========================================================
   4. 목록 조회
   ========================================================= */
async function loadPosList(page = 1) {
    try {
        currentPage = page;
        currentSearchType = "all";
        currentKeyword = "";

        const resp = await fetch(`/pos?currentPage=${page}`);

        if (!resp.ok) {
            throw new Error("직급 목록 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderSummary(data.summary);
        renderTable(voList, data.pvo);
        renderPagination(data.pvo);

    } catch (error) {
        console.log(error);
        alert("직급 목록 조회 중 오류 발생 ...");
    }
}

function renderTable(voList, pvo) {
    const tbodyTag = document.querySelector("#pos-list");

    if (!tbodyTag) {
        return;
    }

    if (!voList || voList.length === 0) {
        tbodyTag.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">조회된 직급이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";
    const startNo = pvo ? ((pvo.currentPage - 1) * pvo.boardLimit) : 0;

    for (let i = 0; i < voList.length; i++) {
        const vo = voList[i];
        const statusInfo = getUseYnInfo(vo.useYn);

        str += `
            <tr>
                <td>${startNo + i + 1}</td>
                <td class="pos-name-cell">
                    <span class="link-text" onclick="openPosModal('${vo.posCode}')">${vo.posName ?? "-"}</span>
                </td>
                <td>${vo.baseSalary ?? "-"}</td>
                <td>${vo.bonusRate ?? "-"}</td>
                <td>${vo.expectedSalary ?? "-"}</td>
                <td>${formatDate(vo.createdAt)}</td>
                <td>
                    <span class="status ${statusInfo.statusClass}">${statusInfo.text}</span>
                </td>
            </tr>
        `;
    }

    tbodyTag.innerHTML = str;
}

/* =========================================================
   5. 검색
   ========================================================= */
const searchTypeTag = document.querySelector("#search-type");

if (searchTypeTag) {
    searchTypeTag.addEventListener("change", function () {
        initSearchPlaceholder();

        const keywordInput = document.querySelector("#keyword");
        const keyword = keywordInput.value.trim();

        if (keyword === "") {
            loadPosList(1);
        }
    });
}

async function searchPos(page = 1) {
    const searchType = document.querySelector("#search-type").value;
    const keyword = document.querySelector("#keyword").value.trim();

    currentPage = page;
    currentSearchType = searchType;
    currentKeyword = keyword;

    if (searchType === "all" || keyword === "") {
        await loadPosList(page);
        return;
    }

    if (searchType === "posName") {
        await loadPosListByName(page);
    } else if (searchType === "useYn") {
        await loadPosListByUseYn(page);
    }
}

async function loadPosListByName(page = 1) {
    try {
        const keyword = document.querySelector("#keyword").value.trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        currentPage = page;
        currentSearchType = "posName";
        currentKeyword = keyword;

        const resp = await fetch(`/pos/search/name?keyword=${encodeURIComponent(keyword)}&currentPage=${page}`);

        if (!resp.ok) {
            throw new Error("직급명 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderSummary(data.summary);
        renderTable(voList, data.pvo);
        renderPagination(data.pvo);

    } catch (error) {
        console.log(error);
        alert("직급명 검색 중 오류 발생 ...");
    }
}

async function loadPosListByUseYn(page = 1) {
    try {
        const keyword = document.querySelector("#keyword").value.trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        let useYn = "";

        if (keyword === "사용" || keyword === "운영" || keyword.toUpperCase() === "Y") {
            useYn = "Y";
        } else if (keyword === "미사용" || keyword === "비활성화" || keyword.toUpperCase() === "N") {
            useYn = "N";
        } else {
            alert("사용여부는 사용 / 미사용 / Y / N 으로 입력하세요.");
            return;
        }

        currentPage = page;
        currentSearchType = "useYn";
        currentKeyword = keyword;

        const resp = await fetch(`/pos/search/useYn?useYn=${useYn}&currentPage=${page}`);

        if (!resp.ok) {
            throw new Error("사용여부 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderSummary(data.summary);
        renderTable(voList, data.pvo);
        renderPagination(data.pvo);

    } catch (error) {
        console.log(error);
        alert("사용여부 검색 중 오류 발생 ...");
    }
}

const keywordTag = document.querySelector("#keyword");
if (keywordTag) {
    keywordTag.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchPos(1);
        }
    });
}

/* =========================================================
   6. 상세조회 모달
   ========================================================= */
async function openPosModal(posCode) {
    try {
        const resp = await fetch(`/pos/${posCode}`);

        if (!resp.ok) {
            throw new Error("직급 상세조회 실패 ...");
        }

        const data = await resp.json();
        const vo = data.vo;
        const memberList = data.memberList ?? [];

        currentPosCode = posCode;
        currentUseYn = vo.useYn;
        currentMemberList = memberList;

        document.querySelector("#modal-pos-name").innerText = vo.posName ?? "-";
        document.querySelector("#modal-pos-baseSalary").innerText = vo.baseSalary ?? "-";
        document.querySelector("#modal-pos-bonusRate").innerText = vo.bonusRate ?? "-";
        document.querySelector("#modal-pos-expectedSalary").innerText = vo.expectedSalary ?? "-";
        document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);

        const statusInfo = getUseYnInfo(vo.useYn);
        const modalStatusTag = document.querySelector("#modal-pos-status");
        modalStatusTag.className = `status ${statusInfo.statusClass}`;
        modalStatusTag.innerText = statusInfo.text;

        const toggleBtn = document.querySelector("#toggle-use-btn");
        if (toggleBtn) {
            if (vo.useYn === "Y") {
                toggleBtn.innerText = "비활성화";
            } else {
                toggleBtn.innerText = "활성화";
            }
        }

        renderPosMemberList(memberList);

        cancelEditBaseSalary();
        cancelEditBonusRate();

        document.querySelector("#pos-modal-wrap").style.display = "flex";

    } catch (error) {
        console.log(error);
        alert("직급 상세조회 실패 ...");
    }
}

function closePosModal() {
    document.querySelector("#pos-modal-wrap").style.display = "none";
}

function renderPosMemberList(memberList) {
    const tbody = document.querySelector("#modal-member-list");

    if (!tbody) {
        return;
    }

    if (!memberList || memberList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">소속 인원이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < memberList.length; i++) {
        const member = memberList[i];

        str += `
            <tr>
                <td>${i + 1}</td>
                <td>${member.empName ?? "-"}</td>
                <td>${member.deptName ?? "-"}</td>
                <td>${member.empPhone ?? "-"}</td>
                <td>${formatDate(member.hireDate)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

/* =========================================================
   7. 활성화 / 비활성화
   ========================================================= */
async function togglePosUseYn() {
    try {
        if (currentPosCode == null || currentUseYn == null) {
            alert("직급 정보가 없습니다.");
            return;
        }

        let url = "";
        let msg = "";

        if (currentUseYn === "Y") {
            url = `/pos/${currentPosCode}/disable`;
            msg = "정말 비활성화 하시겠습니까?";
        } else {
            url = `/pos/${currentPosCode}/enable`;
            msg = "정말 활성화 하시겠습니까?";
        }

        const ok = confirm(msg);
        if (!ok) {
            return;
        }

        const resp = await fetch(url, {
            method: "PUT",
        });

        if (!resp.ok) {
            throw new Error("상태 변경 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("처리 실패");
            return;
        }

        alert("처리 완료");
        closePosModal();
        await reloadPosListKeepingState();
        
        loadPosList();

    } catch (error) {
        console.log(error);
        alert("상태 변경 중 오류 발생 ...");
    }
}

/* =========================================================
   8. 기본급 수정
   ========================================================= */
function startEditBaseSalary() {
    const currentBaseSalary = document.querySelector("#modal-pos-baseSalary").innerText;

    document.querySelector("#baseSalary-input").value = currentBaseSalary;
    document.querySelector("#baseSalary-view-area").style.display = "none";
    document.querySelector("#baseSalary-edit-area").style.display = "grid";
}

function cancelEditBaseSalary() {
    const viewTag = document.querySelector("#baseSalary-view-area");
    const editTag = document.querySelector("#baseSalary-edit-area");

    if (viewTag) viewTag.style.display = "grid";
    if (editTag) editTag.style.display = "none";
}

async function saveBaseSalary() {
    try {
        const baseSalary = document.querySelector("#baseSalary-input").value.trim();

        if (!currentPosCode) {
            alert("직급 정보가 없습니다.");
            return;
        }

        if (baseSalary === "") {
            alert("기본급을 입력하세요.");
            return;
        }

        const resp = await fetch(`/pos/${currentPosCode}/baseSalary`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ baseSalary }),
        });

        if (!resp.ok) {
            throw new Error("기본급 수정 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("기본급 수정 실패");
            return;
        }

        document.querySelector("#modal-pos-baseSalary").innerText = baseSalary;
        cancelEditBaseSalary();

        alert("기본급 수정 완료");
        await reloadPosListKeepingState();
        loadPosList();

    } catch (error) {
        console.log(error);
        alert("기본급 수정 중 오류 발생 ...");
    }
}

/* =========================================================
   9. 보너스율 수정
   ========================================================= */
function startEditBonusRate() {
    const currentBonusRate = document.querySelector("#modal-pos-bonusRate").innerText;

    document.querySelector("#bonusRate-input").value = currentBonusRate;
    document.querySelector("#bonusRate-view-area").style.display = "none";
    document.querySelector("#bonusRate-edit-area").style.display = "grid";
}

function cancelEditBonusRate() {
    const viewTag = document.querySelector("#bonusRate-view-area");
    const editTag = document.querySelector("#bonusRate-edit-area");

    if (viewTag) viewTag.style.display = "grid";
    if (editTag) editTag.style.display = "none";
}

async function saveBonusRate() {
    try {
        const bonusRate = document.querySelector("#bonusRate-input").value.trim();

        if (!currentPosCode) {
            alert("직급 정보가 없습니다.");
            return;
        }

        if (bonusRate === "") {
            alert("보너스율을 입력하세요.");
            return;
        }

        const resp = await fetch(`/pos/${currentPosCode}/bonusRate`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bonusRate }),
        });

        if (!resp.ok) {
            throw new Error("보너스율 수정 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("보너스율 수정 실패");
            return;
        }

        document.querySelector("#modal-pos-bonusRate").innerText = bonusRate;
        cancelEditBonusRate();

        alert("보너스율 수정 완료");
        await reloadPosListKeepingState();
        loadPosList();

    } catch (error) {
        console.log(error);
        alert("보너스율 수정 중 오류 발생 ...");
    }
}

/* =========================================================
   10. 직급 등록
   ========================================================= */
function openInsertPosModal() {
    document.querySelector("#insert-pos-code").value = "";
    document.querySelector("#insert-pos-name").value = "";
    document.querySelector("#insert-pos-baseSalary").value = "";
    document.querySelector("#insert-pos-bonusRate").value = "";
    document.querySelector("#insert-pos-desc").value = "";

    document.querySelector("#pos-insert-modal-wrap").style.display = "flex";
}

function closeInsertPosModal() {
    document.querySelector("#pos-insert-modal-wrap").style.display = "none";
}

async function insertPos() {
    try {
        const posCode = document.querySelector("#insert-pos-code").value.trim();
        const posName = document.querySelector("#insert-pos-name").value.trim();
        const baseSalary = document.querySelector("#insert-pos-baseSalary").value.trim();
        const bonusRate = document.querySelector("#insert-pos-bonusRate").value.trim();
        const posDesc = document.querySelector("#insert-pos-desc").value.trim();

        if (posCode === "") {
            alert("직급코드를 입력하세요.");
            return;
        }

        if (posName === "") {
            alert("직급명을 입력하세요.");
            return;
        }

        const resp = await fetch("/pos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                posCode,
                posName,
                baseSalary,
                bonusRate,
                posDesc,
            }),
        });

        if (!resp.ok) {
            throw new Error("직급 등록 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("직급 등록 실패");
            return;
        }

        alert("직급 등록 완료 !");
        closeInsertPosModal();
        await loadPosList(1);
        
        loadPosList();

    } catch (error) {
        console.log(error);
        alert("직급 등록 중 오류 발생 ...");
    }
}


function renderPagination(pvo) {
    const area = document.querySelector("#pos-pagination-area");
    if (!area) return;

    if (!pvo) {
        area.innerHTML = `<button type="button" class="page-btn active">1</button>`;
        return;
    }

    let str = "";

    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        str += `
            <button
                type="button"
                class="page-btn ${i === pvo.currentPage ? "active" : ""}"
                onclick="${getPosPageMoveFunction(i)}"
            >
                ${i}
            </button>
        `;
    }

    if (pvo.endPage < pvo.maxPage) {
        str += `
            <button
                type="button"
                class="page-btn"
                onclick="${getPosPageMoveFunction(pvo.endPage + 1)}"
            >
                &gt;
            </button>
        `;
    }

    area.innerHTML = str;
}

function getPosPageMoveFunction(page) {
    if (currentSearchType === "all" || currentKeyword === "") {
        return `loadPosList(${page})`;
    }
    return `searchPos(${page})`;
}

async function reloadPosListKeepingState() {
    if (currentSearchType === "all" || currentKeyword === "") {
        await loadPosList(currentPage);
    } else {
        await searchPos(currentPage);
    }
}