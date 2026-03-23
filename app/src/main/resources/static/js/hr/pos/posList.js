/* ================= 전역 ================= */
let currentPosCode = null;
let currentUseYn = null;
let currentMemberList = [];

let currentPage = 1;
let currentSearchType = "all";
let currentKeyword = "";

/* ================= 시작 ================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        bindEvents();
        initSearchPlaceholder();
        await loadPosList(1);
    } catch (error) {
        console.log(error);
        alert("직급 페이지 로딩 실패 ...");
    }
});

/* ================= 공통 ================= */
function getEl(selector) {
    return document.querySelector(selector);
}

function getValue(selector) {
    return getEl(selector)?.value ?? "";
}

function showModal(selector) {
    const target = getEl(selector);
    if (target) {
        target.style.display = "flex";
    }
}

function hideModal(selector) {
    const target = getEl(selector);
    if (target) {
        target.style.display = "none";
    }
}

function formatDate(value) {
    if (!value) return "";
    return String(value).length >= 10 ? String(value).substring(0, 10) : value;
}

function getUseYnInfo(useYn) {
    if (useYn === "Y") {
        return { text: "사용", statusClass: "status-confirmed" };
    }
    return { text: "미사용", statusClass: "status-pending" };
}

/* ================= 검색쪽 ================= */
function bindEvents() {
    getEl("#search-type")?.addEventListener("change", function () {
        initSearchPlaceholder();

        const keyword = getValue("#keyword").trim();
        if (keyword === "") {
            loadPosList(1);
        }
    });

    getEl("#keyword")?.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchPos(1);
        }
    });

    getEl("#search-btn")?.addEventListener("click", function () {
        searchPos(1);
    });
}

function initSearchPlaceholder() {
    const type = getValue("#search-type");
    const input = getEl("#keyword");

    if (!input) return;

    if (type === "posName") {
        input.placeholder = "직급명을 입력하세요";
    } else if (type === "useYn") {
        input.placeholder = "사용 / 미사용 입력";
    } else {
        input.placeholder = "검색어를 입력하세요";
    }
}

/* ================= 요약 ================= */
function renderSummary(summary) {
    const totalEl = getEl("#total-pos-count");
    const enableEl = getEl("#enable-pos-count");

    const safe = summary || {};
    const totalCount = Number(safe.totalCount ?? safe.TOTALCOUNT ?? 0);
    const enableCount = Number(safe.enableCount ?? safe.ENABLECOUNT ?? 0);

    if (totalEl) totalEl.innerText = totalCount;
    if (enableEl) enableEl.innerText = enableCount;
}

/* ================= 목록 ================= */
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
    const tbodyTag = getEl("#pos-list");
    if (!tbodyTag) return;

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

/* ================= 검색 ================= */
async function searchPos(page = 1) {
    const searchType = getValue("#search-type") || "all";
    const keyword = getValue("#keyword").trim();

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
        const keyword = getValue("#keyword").trim();

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
        const keyword = getValue("#keyword").trim();

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

/* ================= 상세 ================= */
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

        getEl("#modal-pos-name").innerText = vo.posName ?? "-";
        getEl("#modal-pos-baseSalary").innerText = vo.baseSalary ?? "-";
        getEl("#modal-pos-bonusRate").innerText = vo.bonusRate ?? "-";
        getEl("#modal-pos-expectedSalary").innerText = vo.expectedSalary ?? "-";
        getEl("#modal-created-at").innerText = formatDate(vo.createdAt);

        const statusInfo = getUseYnInfo(vo.useYn);
        const modalStatusTag = getEl("#modal-pos-status");
        modalStatusTag.className = `status ${statusInfo.statusClass}`;
        modalStatusTag.innerText = statusInfo.text;

        const toggleBtn = getEl("#toggle-use-btn");
        if (toggleBtn) {
            toggleBtn.innerText = (vo.useYn === "Y") ? "비활성화" : "활성화";
        }

        renderPosMemberList(memberList);
        cancelEditBaseSalary();
        cancelEditBonusRate();
        showModal("#pos-modal-wrap");
    } catch (error) {
        console.log(error);
        alert("직급 상세조회 실패 ...");
    }
}

function closePosModal() {
    hideModal("#pos-modal-wrap");
}

function renderPosMemberList(memberList) {
    const tbody = getEl("#modal-member-list");
    if (!tbody) return;

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

/* ================= 상태 ================= */
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
        if (!ok) return;

        const resp = await fetch(url, {
            method: "PUT"
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
    } catch (error) {
        console.log(error);
        alert("상태 변경 중 오류 발생 ...");
    }
}

/* ================= 기본급 ================= */
function startEditBaseSalary() {
    const currentBaseSalary = getEl("#modal-pos-baseSalary").innerText;

    getEl("#baseSalary-input").value = currentBaseSalary;
    getEl("#baseSalary-view-area").style.display = "none";
    getEl("#baseSalary-edit-area").style.display = "grid";
}

function cancelEditBaseSalary() {
    const viewTag = getEl("#baseSalary-view-area");
    const editTag = getEl("#baseSalary-edit-area");

    if (viewTag) viewTag.style.display = "grid";
    if (editTag) editTag.style.display = "none";
}

async function saveBaseSalary() {
    try {
        const baseSalary = getValue("#baseSalary-input").trim();

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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ baseSalary })
        });

        if (!resp.ok) {
            throw new Error("기본급 수정 실패 ...");
        }

        const data = await resp.json();
        if (data.result != 1) {
            alert("기본급 수정 실패");
            return;
        }

        getEl("#modal-pos-baseSalary").innerText = baseSalary;
        cancelEditBaseSalary();

        alert("기본급 수정 완료");
        await reloadPosListKeepingState();
    } catch (error) {
        console.log(error);
        alert("기본급 수정 중 오류 발생 ...");
    }
}

/* ================= 보너스율 ================= */
function startEditBonusRate() {
    const currentBonusRate = getEl("#modal-pos-bonusRate").innerText;

    getEl("#bonusRate-input").value = currentBonusRate;
    getEl("#bonusRate-view-area").style.display = "none";
    getEl("#bonusRate-edit-area").style.display = "grid";
}

function cancelEditBonusRate() {
    const viewTag = getEl("#bonusRate-view-area");
    const editTag = getEl("#bonusRate-edit-area");

    if (viewTag) viewTag.style.display = "grid";
    if (editTag) editTag.style.display = "none";
}

async function saveBonusRate() {
    try {
        const bonusRate = getValue("#bonusRate-input").trim();

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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ bonusRate })
        });

        if (!resp.ok) {
            throw new Error("보너스율 수정 실패 ...");
        }

        const data = await resp.json();
        if (data.result != 1) {
            alert("보너스율 수정 실패");
            return;
        }

        getEl("#modal-pos-bonusRate").innerText = bonusRate;
        cancelEditBonusRate();

        alert("보너스율 수정 완료");
        await reloadPosListKeepingState();
    } catch (error) {
        console.log(error);
        alert("보너스율 수정 중 오류 발생 ...");
    }
}

/* ================= 등록 ================= */
function openInsertPosModal() {
    getEl("#insert-pos-code").value = "";
    getEl("#insert-pos-name").value = "";
    getEl("#insert-pos-baseSalary").value = "";
    getEl("#insert-pos-bonusRate").value = "";
    getEl("#insert-pos-desc").value = "";

    showModal("#pos-insert-modal-wrap");
}

function closeInsertPosModal() {
    hideModal("#pos-insert-modal-wrap");
}

async function insertPos() {
    try {
        const posCode = getValue("#insert-pos-code").trim();
        const posName = getValue("#insert-pos-name").trim();
        const baseSalary = getValue("#insert-pos-baseSalary").trim();
        const bonusRate = getValue("#insert-pos-bonusRate").trim();
        const posDesc = getValue("#insert-pos-desc").trim();

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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                posCode,
                posName,
                baseSalary,
                bonusRate,
                posDesc
            })
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
    } catch (error) {
        console.log(error);
        alert("직급 등록 중 오류 발생 ...");
    }
}

/* ================= 페이징 ================= */
function renderPagination(pvo) {
    const area = getEl("#pos-pagination-area");
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