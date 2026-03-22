/* =========================================================
   매장관리 JS (복구 완료 전체본)
   ========================================================= */
let currentPage = 1;
let currentSearchType = "all";
let currentKeyword = "";
let currentStoreCode = null;
let currentStoreVo = null;
let currentStoreAddress = "";
let storeMap = null;
let storeMarker = null;
let currentManagerList = [];

window.addEventListener("DOMContentLoaded", async function () {
    try {
        bindEvents();
        initSearchPlaceholder();
        await loadStoreSummary();
        await loadStoreList();
    } catch (error) {
        console.log(error);
        alert("매장 페이지 로딩 실패 ...");
    }
});

/* ================= 공통 ================= */
function nvl(v) {
    return (v === null || v === undefined || v === "") ? "-" : v;
}

function formatDate(v) {
    return v ? String(v).substring(0, 10) : "";
}

function getStatusInfo(code, name) {
    if (String(code) === "1" || name === "운영") {
        return { text: "운영", className: "status-confirmed" };
    }
    if (String(code) === "2" || name === "휴업") {
        return { text: "휴업", className: "status-pending" };
    }
    return { text: "폐업", className: "status-off" };
}

/* ================= 검색 ================= */
function bindEvents() {
    document.querySelector("#keyword")?.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchStore();
        }
    });

    document.querySelector("#search-btn")?.addEventListener("click", function () {
        searchStore();
    });

    document.querySelector("#search-type")?.addEventListener("change", function () {
        initSearchPlaceholder();

        const keyword = document.querySelector("#keyword")?.value.trim() ?? "";
        if (keyword === "") {
            loadStoreList();
        }
    });
}

function initSearchPlaceholder() {
    const t = document.querySelector("#search-type")?.value;
    const i = document.querySelector("#keyword");

    if (!i) return;

    if (t === "storeName") {
        i.placeholder = "매장명 입력";
    } else if (t === "statusName") {
        i.placeholder = "운영 / 휴업 / 폐업";
    } else {
        i.placeholder = "검색어 입력";
    }
}

/* ================= 요약 ================= */
async function loadStoreSummary() {
    await loadStoreList(1);
}

function renderSummary(summary) {
    const safe = summary || {};

    const total = Number(safe.totalCount ?? safe.TOTALCOUNT ?? 0);
    const enable = Number(safe.enableCount ?? safe.ENABLECOUNT ?? 0);
    const rest = Number(safe.restCount ?? safe.RESTCOUNT ?? 0);
    const disable = Number(safe.disableCount ?? safe.DISABLECOUNT ?? 0);

    const totalTag = document.querySelector("#total-store-count");
    const enableTag = document.querySelector("#enable-store-count");
    const restTag = document.querySelector("#rest-store-count");
    const disableTag = document.querySelector("#disable-store-count");

    if (totalTag) totalTag.innerText = total;
    if (enableTag) enableTag.innerText = enable;
    if (restTag) restTag.innerText = rest;
    if (disableTag) disableTag.innerText = disable;
}

/* ================= 목록 ================= */
async function loadStoreList(page = 1) {
    currentPage = page;
    currentSearchType = "all";
    currentKeyword = "";

    const resp = await fetch(`/store?currentPage=${page}`);
    const data = await resp.json();

    renderSummary(data.summary);
    renderTable(data.voList || [], data.pvo);
    renderPagination(data.pvo);
}

function renderTable(list, pvo) {
    const tbody = document.querySelector("#store-list");
    if (!tbody) return;

    if (!list.length) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">조회된 매장이 없습니다.</td>
            </tr>
        `;
        return;
    }

    const startNo = pvo ? ((pvo.currentPage - 1) * pvo.boardLimit) : 0;

    tbody.innerHTML = list.map((v, i) => {
        const s = getStatusInfo(v.statusCode, v.statusName);
        return `
        <tr>
            <td>${startNo + i + 1}</td>
            <td class="store-name-cell">
                <span class="link-text" onclick="openStoreModal('${v.storeCode}')">${nvl(v.storeName)}</span>
            </td>
            <td>${nvl(v.managerName)}</td>
            <td>${nvl(v.storeAddress)}</td>
            <td>${formatDate(v.createdAt)}</td>
            <td><span class="status ${s.className}">${s.text}</span></td>
        </tr>`;
    }).join("");
}

/* ================= 검색 ================= */
async function searchStore(page = 1) {
    const t = document.querySelector("#search-type")?.value ?? "all";
    const k = document.querySelector("#keyword")?.value.trim() ?? "";

    currentPage = page;
    currentSearchType = t;
    currentKeyword = k;

    if (!k || t === "all") {
        return loadStoreList(page);
    }

    let url = "";
    if (t === "storeName") {
        url = `/store/search/name?keyword=${encodeURIComponent(k)}&currentPage=${page}`;
    } else {
    let statusKeyword = k.trim();

    if (
        statusKeyword.includes("운영") ||
        statusKeyword.includes("영업") ||
        statusKeyword.includes("오픈")
    ) {
        statusKeyword = "영업중";
    } else if (statusKeyword.includes("휴업")) {
        statusKeyword = "휴업";
    } else if (statusKeyword.includes("폐업")) {
        statusKeyword = "폐업";
    }

    url = `/store/search/statusName?statusName=${encodeURIComponent(statusKeyword)}&currentPage=${page}`;
}

    const resp = await fetch(url);
    const data = await resp.json();

    renderSummary(data.summary);
    renderTable(data.voList || [], data.pvo);
    renderPagination(data.pvo);
}

/* ================= 상세 ================= */
async function openStoreModal(code) {
    const resp = await fetch(`/store/${code}`);
    const data = await resp.json();

    const vo = data.vo;
    currentStoreCode = code;
    currentStoreVo = vo;
    currentStoreAddress = vo.storeAddress ?? "";
    currentManagerList = data.managerList || [];

    document.querySelector("#modal-store-name").innerText = nvl(vo.storeName);
    document.querySelector("#modal-store-manager").innerText = nvl(vo.managerName);
    document.querySelector("#modal-store-address").innerText = nvl(vo.storeAddress);
    document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);
    document.querySelector("#modal-store-code").innerText = nvl(vo.storeCode);

    const s = getStatusInfo(vo.statusCode, vo.statusName);
    const tag = document.querySelector("#modal-store-status");
    if (tag) {
        tag.className = `status ${s.className}`;
        tag.innerText = s.text;
    }

    cancelEditAll();

    document.querySelector("#store-modal-wrap").style.display = "flex";

    setTimeout(function () {
        drawStoreMap(vo.storeAddress);
    }, 100);
}

function closeStoreModal() {
    document.querySelector("#store-modal-wrap").style.display = "none";
}

/* ================= 담당자 ================= */
function startEditManager() {
    const sel = document.querySelector("#manager-select");
    if (!sel) return;

    sel.innerHTML = "";
    currentManagerList.forEach(m => {
        const selected = (String(m.empNo) === String(currentStoreVo?.ownerEmpNo ?? "")) ? "selected" : "";
        sel.innerHTML += `<option value="${m.empNo}" ${selected}>${m.empName}</option>`;
    });

    toggle("manager", true);
}

function cancelEditManager() {
    toggle("manager", false);
}

async function saveManager() {
    try {
        const ownerEmpNo = document.querySelector("#manager-select")?.value;

        const resp = await fetch(`/store/${currentStoreCode}/manager`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ownerEmpNo })
        });

        const data = await resp.json();
        if (!resp.ok || data.result != 1) {
            alert(data.msg || "담당자 수정 실패");
            return;
        }

        const txt = document.querySelector("#manager-select").selectedOptions[0]?.text ?? "-";
        document.querySelector("#modal-store-manager").innerText = txt;

        currentStoreVo.ownerEmpNo = ownerEmpNo;
        currentStoreVo.managerName = txt;

        cancelEditManager();
        await reloadStoreListKeepingState();
        alert(data.msg || "담당자 수정 완료");
    } catch (error) {
        console.log(error);
        alert("담당자 수정 중 오류 발생 ...");
    }
}

/* ================= 주소 ================= */
function startEditAddress() {
    document.querySelector("#address-input").value =
        document.querySelector("#modal-store-address").innerText;
    toggle("address", true);
}

function cancelEditAddress() {
    toggle("address", false);
}

async function saveAddress() {
    try {
        const addr = document.querySelector("#address-input")?.value?.trim();

        const resp = await fetch(`/store/${currentStoreCode}/address`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storeAddress: addr })
        });

        const data = await resp.json();
        if (!resp.ok || data.result != 1) {
            alert(data.msg || "주소 수정 실패");
            return;
        }

        document.querySelector("#modal-store-address").innerText = addr;
        currentStoreVo.storeAddress = addr;
        currentStoreAddress = addr;

        cancelEditAddress();
        await reloadStoreListKeepingState();
        drawStoreMap(addr);
        alert(data.msg || "주소 수정 완료");
    } catch (error) {
        console.log(error);
        alert("주소 수정 중 오류 발생 ...");
    }
}

/* ================= 상태 ================= */
function startEditStatus() {
    document.querySelector("#status-select").value = currentStoreVo.statusCode;
    toggle("status", true);
}

function cancelEditStatus() {
    toggle("status", false);
}

async function saveStatus() {
    try {
        const statusCode = document.querySelector("#status-select")?.value;

        const resp = await fetch(`/store/${currentStoreCode}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ statusCode })
        });

        const data = await resp.json();
        if (!resp.ok || data.result != 1) {
            alert(data.msg || "상태 수정 실패");
            return;
        }

        const s = getStatusInfo(statusCode);
        const tag = document.querySelector("#modal-store-status");
        tag.className = `status ${s.className}`;
        tag.innerText = s.text;

        currentStoreVo.statusCode = statusCode;

        cancelEditStatus();
        await reloadStoreListKeepingState();
        await reloadStoreListKeepingState();
        alert(data.msg || "상태 수정 완료");
    } catch (error) {
        console.log(error);
        alert("상태 수정 중 오류 발생 ...");
    }
}

/* ================= 등록 ================= */
function openInsertStoreModal() {
    const codeTag = document.querySelector("#insert-store-code");
    const nameTag = document.querySelector("#insert-store-name");
    const addrTag = document.querySelector("#insert-store-address");

    if (codeTag) codeTag.value = "";
    if (nameTag) nameTag.value = "";
    if (addrTag) addrTag.value = "";

    document.querySelector("#store-insert-modal-wrap").style.display = "flex";
}

function closeInsertStoreModal() {
    document.querySelector("#store-insert-modal-wrap").style.display = "none";
}

async function insertStore() {
    try {
        const storeCode = document.querySelector("#insert-store-code")?.value?.trim();
        const storeName = document.querySelector("#insert-store-name")?.value?.trim();
        const storeAddress = document.querySelector("#insert-store-address")?.value?.trim();

        if (!storeCode) {
            alert("매장코드를 입력하세요.");
            return;
        }

        if (!storeName) {
            alert("매장명을 입력하세요.");
            return;
        }

        if (!storeAddress) {
            alert("매장위치를 입력하세요.");
            return;
        }

        const resp = await fetch("/store", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                storeCode,
                storeName,
                storeAddress
            })
        });

        const data = await resp.json();

        if (!resp.ok || data.result != 1) {
            alert(data.msg || "매장 등록 실패");
            return;
        }

        alert(data.msg || "매장 등록 완료");
        closeInsertStoreModal();
        await loadStoreSummary();
        await loadStoreList();
    } catch (error) {
        console.log(error);
        alert("매장 등록 중 오류 발생 ...");
    }
}

/* ================= 공통 토글 ================= */
function toggle(type, edit) {
    const viewTag = document.querySelector(`#${type}-view-area`);
    const editTag = document.querySelector(`#${type}-edit-area`);

    if (viewTag) viewTag.style.display = edit ? "none" : "grid";
    if (editTag) editTag.style.display = edit ? "grid" : "none";
}

function cancelEditAll() {
    cancelEditManager();
    cancelEditAddress();
    cancelEditStatus();
}

/* ================= 주소검색 ================= */
function searchAddress() {
    new daum.Postcode({
        oncomplete: data => {
            document.querySelector("#address-input").value = data.address;
        }
    }).open();
}

function searchInsertAddress() {
    new daum.Postcode({
        oncomplete: data => {
            document.querySelector("#insert-store-address").value = data.address;
        }
    }).open();
}

/* ================= 지도 ================= */
function drawStoreMap(address) {
    if (!address || address === "-") return;

    const mapContainer = document.querySelector("#store-map");
    if (!window.kakao || !window.kakao.maps || !mapContainer) return;

    const defaultPos = new kakao.maps.LatLng(37.499361, 127.033202);

    if (!storeMap) {
        storeMap = new kakao.maps.Map(mapContainer, {
            center: defaultPos,
            level: 3
        });

        storeMarker = new kakao.maps.Marker({
            position: defaultPos
        });
        storeMarker.setMap(storeMap);
    }

    const geo = new kakao.maps.services.Geocoder();
    geo.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            storeMap.relayout();
            storeMap.setCenter(coords);
            storeMarker.setPosition(coords);
            storeMarker.setMap(storeMap);
        } else {
            storeMap.relayout();
            storeMap.setCenter(defaultPos);
            storeMarker.setPosition(defaultPos);
            storeMarker.setMap(storeMap);
        }
    });
}

function renderPagination(pvo) {
    const area = document.querySelector("#store-pagination-area");
    if (!area) return;

    if (!pvo) {
        area.innerHTML = `<button class="page-btn active">1</button>`;
        return;
    }

    let str = "";

    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        str += `
            <button
                type="button"
                class="page-btn ${i === pvo.currentPage ? "active" : ""}"
                onclick="${getStorePageMoveFunction(i)}"
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
                onclick="${getStorePageMoveFunction(pvo.endPage + 1)}"
            >
                &gt;
            </button>
        `;
    }

    area.innerHTML = str;
}


function getStorePageMoveFunction(page) {
    if (currentSearchType === "all" || currentKeyword === "") {
        return `loadStoreList(${page})`;
    }
    return `searchStore(${page})`;
}

async function reloadStoreListKeepingState() {
    if (currentSearchType === "all" || currentKeyword === "") {
        await loadStoreList(currentPage);
    } else {
        await searchStore(currentPage);
    }
}