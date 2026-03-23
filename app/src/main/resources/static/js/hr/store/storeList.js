/* ================= 전역 ================= */
let currentPage = 1;
let currentSearchType = "all";
let currentKeyword = "";
let currentStoreCode = null;
let currentStoreVo = null;
let currentStoreAddress = "";
let storeMap = null;
let storeMarker = null;
let currentManagerList = [];

/* ================= 시작 ================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        bindEvents();
        initSearchPlaceholder();
        await loadStoreList(1);
    } catch (error) {
        console.log(error);
        alert("매장 페이지 로딩 실패 ...");
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

/* ================= 검색쪽 ================= */
function bindEvents() {
    getEl("#keyword")?.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchStore();
        }
    });

    getEl("#search-btn")?.addEventListener("click", function () {
        searchStore();
    });

    getEl("#search-type")?.addEventListener("change", function () {
        initSearchPlaceholder();

        const keyword = getValue("#keyword").trim();
        if (keyword === "") {
            loadStoreList(1);
        }
    });
}

function initSearchPlaceholder() {
    const type = getValue("#search-type");
    const keywordTag = getEl("#keyword");

    if (!keywordTag) return;

    if (type === "storeName") {
        keywordTag.placeholder = "매장명 입력";
    } else if (type === "statusName") {
        keywordTag.placeholder = "운영 / 휴업 / 폐업";
    } else {
        keywordTag.placeholder = "검색어 입력";
    }
}

/* ================= 요약 + 목록 ================= */
function renderSummary(summary) {
    const safe = summary || {};

    const total = Number(safe.totalCount ?? safe.TOTALCOUNT ?? 0);
    const enable = Number(safe.enableCount ?? safe.ENABLECOUNT ?? 0);
    const rest = Number(safe.restCount ?? safe.RESTCOUNT ?? 0);
    const disable = Number(safe.disableCount ?? safe.DISABLECOUNT ?? 0);

    const totalTag = getEl("#total-store-count");
    const enableTag = getEl("#enable-store-count");
    const restTag = getEl("#rest-store-count");
    const disableTag = getEl("#disable-store-count");

    if (totalTag) totalTag.innerText = total;
    if (enableTag) enableTag.innerText = enable;
    if (restTag) restTag.innerText = rest;
    if (disableTag) disableTag.innerText = disable;
}

async function loadStoreList(page = 1) {
    currentPage = page;
    currentSearchType = "all";
    currentKeyword = "";

    const resp = await fetch(`/store?currentPage=${page}`);
    if (!resp.ok) {
        throw new Error("매장 목록 조회 실패");
    }

    const data = await resp.json();

    renderSummary(data.summary);
    renderTable(data.voList || [], data.pvo);
    renderPagination(data.pvo);
}

function renderTable(list, pvo) {
    const tbody = getEl("#store-list");
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
        const statusInfo = getStatusInfo(v.statusCode, v.statusName);

        return `
            <tr>
                <td>${startNo + i + 1}</td>
                <td class="store-name-cell">
                    <span class="link-text" onclick="openStoreModal('${v.storeCode}')">${nvl(v.storeName)}</span>
                </td>
                <td>${nvl(v.managerName)}</td>
                <td>${nvl(v.storeAddress)}</td>
                <td>${formatDate(v.createdAt)}</td>
                <td><span class="status ${statusInfo.className}">${statusInfo.text}</span></td>
            </tr>
        `;
    }).join("");
}

/* ================= 검색 ================= */
async function searchStore(page = 1) {
    const searchType = getValue("#search-type") || "all";
    const keyword = getValue("#keyword").trim();

    currentPage = page;
    currentSearchType = searchType;
    currentKeyword = keyword;

    if (!keyword || searchType === "all") {
        return loadStoreList(page);
    }

    let url = "";

    if (searchType === "storeName") {
        url = `/store/search/name?keyword=${encodeURIComponent(keyword)}&currentPage=${page}`;
    } else {
        let statusKeyword = keyword;

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
    if (!resp.ok) {
        throw new Error("매장 검색 실패");
    }

    const data = await resp.json();

    renderSummary(data.summary);
    renderTable(data.voList || [], data.pvo);
    renderPagination(data.pvo);
}

/* ================= 상세 ================= */
async function openStoreModal(storeCode) {
    const resp = await fetch(`/store/${storeCode}`);
    if (!resp.ok) {
        throw new Error("매장 상세조회 실패");
    }

    const data = await resp.json();
    const vo = data.vo;

    currentStoreCode = storeCode;
    currentStoreVo = vo;
    currentStoreAddress = vo.storeAddress ?? "";
    currentManagerList = data.managerList || [];

    getEl("#modal-store-name").innerText = nvl(vo.storeName);
    getEl("#modal-store-manager").innerText = nvl(vo.managerName);
    getEl("#modal-store-address").innerText = nvl(vo.storeAddress);
    getEl("#modal-created-at").innerText = formatDate(vo.createdAt);
    getEl("#modal-store-code").innerText = nvl(vo.storeCode);

    const statusInfo = getStatusInfo(vo.statusCode, vo.statusName);
    const statusTag = getEl("#modal-store-status");
    if (statusTag) {
        statusTag.className = `status ${statusInfo.className}`;
        statusTag.innerText = statusInfo.text;
    }

    cancelEditAll();
    showModal("#store-modal-wrap");

    setTimeout(function () {
        drawStoreMap(vo.storeAddress);
    }, 100);
}

function closeStoreModal() {
    hideModal("#store-modal-wrap");
}

/* ================= 담당자 ================= */
function startEditManager() {
    const selectTag = getEl("#manager-select");
    if (!selectTag) return;

    selectTag.innerHTML = "";

    currentManagerList.forEach(function (manager) {
        const selected = String(manager.empNo) === String(currentStoreVo?.ownerEmpNo ?? "")
            ? "selected"
            : "";

        selectTag.innerHTML += `
            <option value="${manager.empNo}" ${selected}>${manager.empName}</option>
        `;
    });

    toggle("manager", true);
}

function cancelEditManager() {
    toggle("manager", false);
}

async function saveManager() {
    try {
        const ownerEmpNo = getEl("#manager-select")?.value;

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

        const selectedName = getEl("#manager-select").selectedOptions[0]?.text ?? "-";
        getEl("#modal-store-manager").innerText = selectedName;

        currentStoreVo.ownerEmpNo = ownerEmpNo;
        currentStoreVo.managerName = selectedName;

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
    getEl("#address-input").value = getEl("#modal-store-address").innerText;
    toggle("address", true);
}

function cancelEditAddress() {
    toggle("address", false);
}

async function saveAddress() {
    try {
        const storeAddress = getEl("#address-input")?.value?.trim();

        const resp = await fetch(`/store/${currentStoreCode}/address`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ storeAddress })
        });

        const data = await resp.json();

        if (!resp.ok || data.result != 1) {
            alert(data.msg || "주소 수정 실패");
            return;
        }

        getEl("#modal-store-address").innerText = storeAddress;
        currentStoreVo.storeAddress = storeAddress;
        currentStoreAddress = storeAddress;

        cancelEditAddress();
        await reloadStoreListKeepingState();
        drawStoreMap(storeAddress);
        alert(data.msg || "주소 수정 완료");
    } catch (error) {
        console.log(error);
        alert("주소 수정 중 오류 발생 ...");
    }
}

/* ================= 상태 ================= */
function startEditStatus() {
    getEl("#status-select").value = currentStoreVo.statusCode;
    toggle("status", true);
}

function cancelEditStatus() {
    toggle("status", false);
}

async function saveStatus() {
    try {
        const statusCode = getEl("#status-select")?.value;

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

        const statusInfo = getStatusInfo(statusCode);
        const statusTag = getEl("#modal-store-status");

        statusTag.className = `status ${statusInfo.className}`;
        statusTag.innerText = statusInfo.text;

        currentStoreVo.statusCode = statusCode;

        cancelEditStatus();
        await reloadStoreListKeepingState();
        alert(data.msg || "상태 수정 완료");
    } catch (error) {
        console.log(error);
        alert("상태 수정 중 오류 발생 ...");
    }
}

/* ================= 등록 ================= */
function openInsertStoreModal() {
    const codeTag = getEl("#insert-store-code");
    const nameTag = getEl("#insert-store-name");
    const addressTag = getEl("#insert-store-address");

    if (codeTag) codeTag.value = "";
    if (nameTag) nameTag.value = "";
    if (addressTag) addressTag.value = "";

    showModal("#store-insert-modal-wrap");
}

function closeInsertStoreModal() {
    hideModal("#store-insert-modal-wrap");
}

async function insertStore() {
    try {
        const storeCode = getEl("#insert-store-code")?.value?.trim();
        const storeName = getEl("#insert-store-name")?.value?.trim();
        const storeAddress = getEl("#insert-store-address")?.value?.trim();

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
        await loadStoreList(1);
    } catch (error) {
        console.log(error);
        alert("매장 등록 중 오류 발생 ...");
    }
}

/* ================= 수정줄 on/off ================= */
function toggle(type, isEdit) {
    const viewTag = getEl(`#${type}-view-area`);
    const editTag = getEl(`#${type}-edit-area`);

    if (viewTag) viewTag.style.display = isEdit ? "none" : "grid";
    if (editTag) editTag.style.display = isEdit ? "grid" : "none";
}

function cancelEditAll() {
    cancelEditManager();
    cancelEditAddress();
    cancelEditStatus();
}

/* ================= 주소검색 ================= */
function searchAddress() {
    new daum.Postcode({
        oncomplete: function (data) {
            getEl("#address-input").value = data.address;
        }
    }).open();
}

function searchInsertAddress() {
    new daum.Postcode({
        oncomplete: function (data) {
            getEl("#insert-store-address").value = data.address;
        }
    }).open();
}

/* ================= 지도 ================= */
function drawStoreMap(address) {
    if (!address || address === "-") return;

    const mapContainer = getEl("#store-map");
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

/* ================= 페이징 ================= */
function renderPagination(pvo) {
    const area = getEl("#store-pagination-area");
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