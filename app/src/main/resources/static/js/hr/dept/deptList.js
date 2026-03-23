/* =========================================================
   부서관리 JS
   ========================================================= */

/* =========================================================
   0. 전역 상태값
   ========================================================= */
let currentPage = 1;
let currentSearchType = "all";
let currentKeyword = "";
let currentDeptCode = null;
let currentUseYn = null;
let currentMemberList = [];

/* =========================================================
   1. 시작
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        initSearchPlaceholder();
        bindDeptEvents();
        await loadDeptSummary();
        await loadDeptList(1);
    } catch (error) {
        console.log(error);
        alert("부서 페이지 로딩 실패 ...");
    }
});

/* =========================================================
   2. 공통 함수
   ========================================================= */
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

function changePosCode(posCode) {
    if (posCode == "100001") return "대표";
    if (posCode == "100002") return "부장";
    if (posCode == "100003") return "과장";
    if (posCode == "100004") return "대리";
    if (posCode == "100005") return "주임";
    if (posCode == "100006") return "사원";
    if (posCode == "100011") return "점주";
    return posCode;
}

function initSearchPlaceholder() {
    const type = getValue("#search-type");
    const input = getEl("#keyword");

    if (!input) return;

    if (type === "deptName") {
        input.placeholder = "부서명을 입력하세요";
    } else if (type === "useYn") {
        input.placeholder = "사용 / 미사용 입력";
    } else {
        input.placeholder = "검색어를 입력하세요";
    }
}

function bindDeptEvents() {
    const searchTypeTag = getEl("#search-type");
    const keywordTag = getEl("#keyword");
    const searchBtn = getEl("#search-btn");

    if (searchTypeTag) {
        searchTypeTag.addEventListener("change", async function () {
            initSearchPlaceholder();

            const keyword = getValue("#keyword").trim();
            if (keyword === "") {
                currentSearchType = "all";
                currentKeyword = "";
                await loadDeptList(1);
            }
        });
    }

    if (keywordTag) {
        keywordTag.addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                await searchDept(1);
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", async function () {
            await searchDept(1);
        });
    }
}

/* =========================================================
   3. 요약 카드
   ========================================================= */
async function loadDeptSummary() {
    try {
        const resp = await fetch("/dept");
        if (!resp.ok) {
            throw new Error("부서 요약 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];
        renderSummary(voList);
    } catch (error) {
        console.log(error);
        alert("부서 요약 조회 중 오류 발생 ...");
    }
}

function renderSummary(voList) {
    const totalDeptTag = getEl("#dept-count");
    const memberCountTag = getEl("#member-count");

    if (!totalDeptTag || !memberCountTag) return;

    totalDeptTag.innerText = voList.length;

    let total = 0;
    for (const vo of voList) {
        total += (vo.memberCount ?? 0);
    }

    memberCountTag.innerText = total;
}

/* =========================================================
   4. 목록 조회
   ========================================================= */
async function loadDeptList(page = 1) {
    try {
        currentPage = page;
        currentSearchType = "all";
        currentKeyword = "";

        const resp = await fetch(`/dept?currentPage=${page}`);
        if (!resp.ok) {
            throw new Error("부서 목록 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList, data.pvo);
        renderPagination(data.pvo);
    } catch (error) {
        console.log(error);
        alert("부서 목록 조회 중 오류 발생 ...");
    }
}

function renderTable(voList, pvo) {
    const tbody = getEl("#dept-list");
    if (!tbody) return;

    if (!voList || voList.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">조회된 부서가 없습니다.</td>
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
                <td class="dept-name-cell">
                    <span class="link-text" onclick="openDeptModal('${vo.deptCode}')">${vo.deptName ?? "-"}</span>
                </td>
                <td>${vo.managerName ?? "-"}</td>
                <td>${vo.memberCount == null ? 0 : vo.memberCount}</td>
                <td>${vo.deptAddress ?? "-"}</td>
                <td>${formatDate(vo.createdAt)}</td>
                <td>
                    <span class="status ${statusInfo.statusClass}">${statusInfo.text}</span>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

/* =========================================================
   5. 검색
   ========================================================= */
async function searchDept(page = 1) {
    const searchType = getValue("#search-type") || "all";
    const keyword = getValue("#keyword").trim();

    currentPage = page;
    currentSearchType = searchType;
    currentKeyword = keyword;

    if (searchType === "all" || keyword === "") {
        await loadDeptList(page);
        return;
    }

    if (searchType === "deptName") {
        await loadDeptListByName(page);
    } else if (searchType === "useYn") {
        await loadDeptListByUseYn(page);
    }
}

async function loadDeptListByName(page = 1) {
    try {
        const keyword = getValue("#keyword").trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        currentPage = page;
        currentSearchType = "deptName";
        currentKeyword = keyword;

        const resp = await fetch(`/dept/search/name?keyword=${encodeURIComponent(keyword)}&currentPage=${page}`);
        if (!resp.ok) {
            throw new Error("부서명 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList, data.pvo);
        renderPagination(data.pvo);
    } catch (error) {
        console.log(error);
        alert("부서명 검색 중 오류 발생 ...");
    }
}

async function loadDeptListByUseYn(page = 1) {
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

        const resp = await fetch(`/dept/search/useYn?useYn=${useYn}&currentPage=${page}`);
        if (!resp.ok) {
            throw new Error("사용여부 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList, data.pvo);
        renderPagination(data.pvo);
    } catch (error) {
        console.log(error);
        alert("사용여부 검색 중 오류 발생 ...");
    }
}

/* =========================================================
   6. 상세조회 모달
   ========================================================= */
async function openDeptModal(deptCode) {
    try {
        const resp = await fetch(`/dept/${deptCode}`);
        if (!resp.ok) {
            throw new Error("부서 상세조회 실패 ...");
        }

        const data = await resp.json();
        const vo = data.vo;
        const memberList = data.memberList ?? [];

        currentDeptCode = deptCode;
        currentUseYn = vo.useYn;
        currentMemberList = memberList;

        getEl("#modal-dept-name").innerText = vo.deptName ?? "-";
        getEl("#modal-dept-manager").innerText = vo.managerName ?? "-";
        getEl("#modal-dept-address").innerText = vo.deptAddress ?? "-";
        getEl("#modal-dept-emp").innerText = `${vo.memberCount ?? 0}명`;
        getEl("#modal-created-at").innerText = formatDate(vo.createdAt);

        const statusInfo = getUseYnInfo(vo.useYn);
        const modalUseYnTag = getEl("#modal-use-yn");
        modalUseYnTag.className = `status ${statusInfo.statusClass}`;
        modalUseYnTag.innerText = statusInfo.text;

        const toggleBtn = getEl("#toggle-use-btn");
        if (toggleBtn) {
            toggleBtn.innerText = (vo.useYn === "Y") ? "비활성화" : "활성화";
        }

        renderDeptMemberList(memberList);
        cancelEditAddress();
        cancelEditManager();
        showModal("#dept-modal-wrap");
    } catch (error) {
        console.log(error);
        alert("부서 상세조회 실패 ...");
    }
}

function renderDeptMemberList(memberList) {
    const tbody = getEl("#modal-member-list");
    if (!tbody) return;

    if (!memberList || memberList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">소속 인원이 없습니다.</td>
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
                <td>${changePosCode(member.posCode)}</td>
                <td>${member.empNo ?? "-"}</td>
                <td>${member.empPhone ?? "-"}</td>
                <td>${formatDate(member.hireDate)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function closeDeptModal() {
    hideModal("#dept-modal-wrap");
}

/* =========================================================
   7. 활성화 / 비활성화
   ========================================================= */
async function toggleDeptUseYn() {
    try {
        if (currentDeptCode == null || currentUseYn == null) {
            alert("부서 정보가 없습니다.");
            return;
        }

        let url = "";
        let msg = "";

        if (currentUseYn === "Y") {
            url = `/dept/${currentDeptCode}/disable`;
            msg = "정말 비활성화 하시겠습니까?";
        } else {
            url = `/dept/${currentDeptCode}/enable`;
            msg = "정말 활성화 하시겠습니까?";
        }

        const ok = confirm(msg);
        if (!ok) return;

        const resp = await fetch(url, { method: "PUT" });
        if (!resp.ok) {
            throw new Error("상태 변경 실패 ...");
        }

        const data = await resp.json();
        if (data.result != 1) {
            alert("처리 실패");
            return;
        }

        alert("처리 완료");
        closeDeptModal();
        await loadDeptSummary();
        await reloadDeptListKeepingState();
    } catch (error) {
        console.log(error);
        alert("상태 변경 중 오류 발생 ...");
    }
}

/* =========================================================
   8. 근무위치 수정
   ========================================================= */
function startEditAddress() {
    const currentAddress = getEl("#modal-dept-address").innerText;

    getEl("#address-input").value = currentAddress;
    getEl("#address-view-area").style.display = "none";
    getEl("#address-edit-area").style.display = "grid";
}

function cancelEditAddress() {
    const viewTag = getEl("#address-view-area");
    const editTag = getEl("#address-edit-area");

    if (viewTag) viewTag.style.display = "grid";
    if (editTag) editTag.style.display = "none";
}

async function saveAddress() {
    try {
        const deptAddress = getEl("#address-input").value;

        if (!currentDeptCode) {
            alert("부서 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/dept/${currentDeptCode}/address`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deptAddress })
        });

        if (!resp.ok) {
            throw new Error("근무위치 수정 실패 ...");
        }

        const data = await resp.json();
        if (data.result != 1) {
            alert("근무위치 수정 실패");
            return;
        }

        getEl("#modal-dept-address").innerText = deptAddress;
        cancelEditAddress();

        alert("근무위치 수정 완료");
        await reloadDeptListKeepingState();
    } catch (error) {
        console.log(error);
        alert("근무위치 수정 중 오류 발생 ...");
    }
}

/* =========================================================
   9. 관리자 수정
   ========================================================= */
function startEditManager() {
    const selectTag = getEl("#manager-select");
    const currentManagerName = getEl("#modal-dept-manager").innerText;

    selectTag.innerHTML = "";

    for (let i = 0; i < currentMemberList.length; i++) {
        const member = currentMemberList[i];
        const selected = member.empName === currentManagerName ? "selected" : "";

        selectTag.innerHTML += `
            <option value="${member.empNo}" ${selected}>${member.empName}</option>
        `;
    }

    getEl("#manager-view-area").style.display = "none";
    getEl("#manager-edit-area").style.display = "grid";
}

function cancelEditManager() {
    const viewTag = getEl("#manager-view-area");
    const editTag = getEl("#manager-edit-area");

    if (viewTag) viewTag.style.display = "grid";
    if (editTag) editTag.style.display = "none";
}

async function saveManager() {
    try {
        const managerEmpNo = getEl("#manager-select").value;

        if (!currentDeptCode) {
            alert("부서 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/dept/${currentDeptCode}/manager`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ managerEmpNo })
        });

        if (!resp.ok) {
            throw new Error("관리자 수정 실패 ...");
        }

        const data = await resp.json();
        if (data.result != 1) {
            alert("관리자 수정 실패");
            return;
        }

        const selectedText = getEl("#manager-select").selectedOptions[0].text;
        getEl("#modal-dept-manager").innerText = selectedText;

        cancelEditManager();

        alert("관리자 수정 완료");
        await reloadDeptListKeepingState();
    } catch (error) {
        console.log(error);
        alert("관리자 수정 중 오류 발생 ...");
    }
}

/* =========================================================
   10. 부서 등록
   ========================================================= */
function openInsertDeptModal() {
    getEl("#insert-dept-code").value = "";
    getEl("#insert-dept-name").value = "";
    getEl("#insert-dept-address").value = "";

    showModal("#dept-insert-modal-wrap");
}

function closeInsertDeptModal() {
    hideModal("#dept-insert-modal-wrap");
}

async function insertDept() {
    try {
        const deptCode = getEl("#insert-dept-code").value.trim();
        const deptName = getEl("#insert-dept-name").value.trim();
        const deptAddress = getEl("#insert-dept-address").value.trim();

        if (deptCode === "") {
            alert("부서코드를 입력하세요.");
            return;
        }

        if (deptName === "") {
            alert("부서명을 입력하세요.");
            return;
        }

        if (deptAddress === "") {
            alert("근무위치를 입력하세요.");
            return;
        }

        const resp = await fetch("/dept", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deptCode,
                deptName,
                deptAddress
            })
        });

        if (!resp.ok) {
            throw new Error("부서 등록 실패 ...");
        }

        const data = await resp.json();
        if (data.result != 1) {
            alert("부서 등록 실패");
            return;
        }

        alert("부서 등록 완료 !");
        closeInsertDeptModal();
        await loadDeptSummary();
        await loadDeptList(1);
    } catch (error) {
        console.log(error);
        alert("부서 등록 중 오류 발생 ...");
    }
}

/* =========================================================
   11. 페이징
   ========================================================= */
function renderPagination(pvo) {
    const pageArea = getEl("#dept-pagination-area");
    if (!pageArea) return;

    if (!pvo) {
        pageArea.innerHTML = `
            <button type="button" class="page-btn active">1</button>
        `;
        return;
    }

    let str = "";
    const start = pvo.startPage || 1;
    const end = pvo.endPage || 1;

    for (let i = start; i <= end; i++) {
        str += `
            <button
                type="button"
                class="page-btn ${i === pvo.currentPage ? "active" : ""}"
                onclick="${getDeptPageMoveFunction(i)}"
            >
                ${i}
            </button>
        `;
    }

    if (pvo.endPage < pvo.maxPage) {
        str += `
            <button
                type="button"
                class="page-btn page-next"
                onclick="${getDeptPageMoveFunction(pvo.endPage + 1)}"
            >
                &gt;
            </button>
        `;
    }

    pageArea.innerHTML = str;
}

function getDeptPageMoveFunction(page) {
    if (currentSearchType === "all" || currentKeyword === "") {
        return `loadDeptList(${page})`;
    }

    return `searchDept(${page})`;
}

async function reloadDeptListKeepingState() {
    if (currentSearchType === "all" || currentKeyword === "") {
        await loadDeptList(currentPage);
    } else {
        await searchDept(currentPage);
    }
}