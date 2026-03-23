/* ================= 전역 ================= */
let attList = [];
let currentMonth = "";
let currentEmpNo = null;
let currentDetailData = null;

let currentPage = 1;
let currentSearchType = "all";
let currentKeyword = "";

/* ================= 시작 ================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        initDefaultMonth();
        bindEvents();
        await loadAttList(1);
    } catch (error) {
        console.log(error);
        alert("근태관리 페이지 로딩 실패 ...");
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
    const tag = getEl(selector);
    if (tag) tag.style.display = "flex";
}

function hideModal(selector) {
    const tag = getEl(selector);
    if (tag) tag.style.display = "none";
}

function nvl(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return value;
}

function numberOrZero(value) {
    if (value === null || value === undefined || value === "") {
        return 0;
    }
    return Number(value) || 0;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function formatMonthLabel(month) {
    if (!month || month.length < 7) return "-";

    const [year, mon] = month.split("-");
    return `${year}-${mon}-01 ~ ${year}-${mon}-${getLastDateOfMonth(year, mon)}`;
}

function getLastDateOfMonth(year, month) {
    return new Date(Number(year), Number(month), 0).getDate();
}

function formatDateShort(workDate) {
    if (!workDate) return "-";

    const date = new Date(workDate);
    if (isNaN(date.getTime())) return workDate;

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = dayNames[date.getDay()];

    return `${month}/${day}(${dayName})`;
}

/* ================= 처음 세팅 ================= */
function initDefaultMonth() {
    const monthTag = getEl("#month");
    if (!monthTag) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    currentMonth = `${year}-${month}`;
    monthTag.value = currentMonth;
}

function bindEvents() {
    const monthTag = getEl("#month");
    const keywordTag = getEl("#keyword");
    const searchBtn = getEl("#search-btn");
    const searchTypeTag = getEl("#search-type");

    if (monthTag) {
        monthTag.addEventListener("change", async function () {
            currentMonth = this.value;
            currentSearchType = "all";
            currentKeyword = "";

            const keywordInput = getEl("#keyword");
            const searchTypeInput = getEl("#search-type");

            if (keywordInput) keywordInput.value = "";
            if (searchTypeInput) searchTypeInput.value = "all";

            await loadAttList(1);
        });
    }

    if (keywordTag) {
        keywordTag.addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                await searchAtt(1);
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", async function () {
            await searchAtt(1);
        });
    }

    if (searchTypeTag) {
        searchTypeTag.addEventListener("change", async function () {
            const keyword = getValue("#keyword").trim();

            if (keyword === "") {
                currentSearchType = "all";
                currentKeyword = "";
                await loadAttList(1);
            }
        });
    }
}

/* ================= 목록 ================= */
async function loadAttList(page = 1) {
    const month = getValue("#month") || currentMonth;

    currentPage = page;
    currentSearchType = "all";
    currentKeyword = "";

    const resp = await fetch(`/att?month=${encodeURIComponent(month)}&currentPage=${page}`);
    if (!resp.ok) {
        throw new Error("근태 목록 조회 실패 ...");
    }

    const data = await resp.json();

    currentMonth = month;
    attList = data.voList ?? [];

    renderSummary(data.summary);
    renderTable(attList, data.pvo);
    renderPagination(data.pvo);
}

/* ================= 검색 ================= */
async function searchAtt(page = 1) {
    const month = getValue("#month") || currentMonth;
    const searchType = getValue("#search-type") || "all";
    const keyword = getValue("#keyword").trim();

    currentPage = page;
    currentSearchType = searchType;
    currentKeyword = keyword;

    if (keyword === "" || searchType === "all") {
        await loadAttList(page);
        return;
    }

    let url = "";

    if (searchType === "name") {
        url = `/att/search/name?month=${encodeURIComponent(month)}&keyword=${encodeURIComponent(keyword)}&currentPage=${page}`;
    } else if (searchType === "dept") {
        url = `/att/search/deptName?month=${encodeURIComponent(month)}&deptName=${encodeURIComponent(keyword)}&currentPage=${page}`;
    } else {
        await loadAttList(page);
        return;
    }

    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error("근태 검색 실패 ...");
    }

    const data = await resp.json();

    currentMonth = month;
    attList = data.voList ?? [];

    renderTable(attList, data.pvo);
    renderPagination(data.pvo);
}

/* ================= 요약 ================= */
function renderSummary(summary) {
    const safe = summary || {};

    getEl("#total-workingDay-count").innerText = numberOrZero(safe.attendanceCount);
    getEl("#total-lateDay-count").innerText = numberOrZero(safe.lateCount);
    getEl("#total-absentDay-count").innerText = numberOrZero(safe.absentCount);
    getEl("#total-vacationDay-count").innerText = numberOrZero(safe.vacationCount);
    getEl("#total-overWorkHour-count").innerText = numberOrZero(safe.otHours);
}

/* ================= 테이블 ================= */
function renderTable(list, pvo) {
    const tbodyTag = getEl("#att-list");
    if (!tbodyTag) return;

    if (!list || list.length === 0) {
        tbodyTag.innerHTML = `
            <tr class="empty-row">
                <td colspan="9">조회된 근태 데이터가 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";
    const startNo = pvo ? ((pvo.currentPage - 1) * pvo.boardLimit) : 0;

    for (let i = 0; i < list.length; i++) {
        const vo = list[i];

        str += `
            <tr>
                <td>${startNo + i + 1}</td>
                <td>
                    <span class="link-text" onclick="openAttDetail('${vo.empNo}')">
                        ${escapeHtml(nvl(vo.empName))}
                    </span>
                </td>
                <td>${escapeHtml(nvl(vo.posName))}</td>
                <td>${escapeHtml(nvl(vo.deptName))}</td>
                <td>${numberOrZero(vo.attCount)}</td>
                <td>${numberOrZero(vo.lateCount)}</td>
                <td>${numberOrZero(vo.absentCount)}</td>
                <td>${numberOrZero(vo.vacationCount)}</td>
                <td>${numberOrZero(vo.otHours)}</td>
            </tr>
        `;
    }

    tbodyTag.innerHTML = str;
}

/* ================= 상세 ================= */
async function openAttDetail(empNo) {
    try {
        const resp = await fetch(`/att/${empNo}?month=${encodeURIComponent(currentMonth)}`);
        if (!resp.ok) {
            throw new Error("근태 상세조회 실패");
        }

        const data = await resp.json();

        currentEmpNo = empNo;
        currentDetailData = data;

        renderAttDetail(data);
        renderAttHistory(data.historyList ?? []);
        showModal("#att-modal-wrap");
    } catch (error) {
        console.log(error);
        alert("근태 상세조회 실패...");
    }
}

function renderAttDetail(data) {
    const memberInfo = data.memberInfo ?? {};
    const summary = data.summary ?? {};

    getEl("#modal-att-empName").innerText = nvl(memberInfo.empName);
    getEl("#modal-att-dept").innerText = nvl(memberInfo.deptName);
    getEl("#modal-att-empNo").innerText = nvl(memberInfo.empNo);
    getEl("#modal-att-pos").innerText = nvl(memberInfo.posName);

    getEl("#modal-workingDay-count").innerText = numberOrZero(summary.attendanceCount);
    getEl("#modal-lateDay-count").innerText = numberOrZero(summary.lateCount);
    getEl("#modal-absentDay-count").innerText = numberOrZero(summary.absentCount);
    getEl("#modal-vacationDay-count").innerText = numberOrZero(summary.vacationCount);
    getEl("#modal-overWorkHour-count").innerText = numberOrZero(summary.otHours);

    const monthLabelTag = getEl("#modal-att-month-label");
    if (monthLabelTag) {
        monthLabelTag.innerText = `조회기간: ${formatMonthLabel(currentMonth)}`;
    }

    const historyTitleTag = getEl("#modal-history-title");
    if (historyTitleTag) {
        historyTitleTag.innerText = `${currentMonth} 근태이력`;
    }
}

function renderAttHistory(historyList) {
    const tbody = getEl("#att-history-list");
    if (!tbody) return;

    if (!historyList || historyList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">이력 없음</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (const item of historyList) {
        str += `
            <tr>
                <td>${escapeHtml(formatDateShort(item.workDate))}</td>
                <td>${escapeHtml(nvl(item.statusName))}</td>
                <td>${escapeHtml(nvl(item.checkInAt))}</td>
                <td>${escapeHtml(nvl(item.checkOutAt))}</td>
                <td>${numberOrZero(item.otConfirmedHours)}</td>
                <td>${escapeHtml(nvl(item.attNote))}</td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function closeAttModal() {
    hideModal("#att-modal-wrap");
}

/* ================= 수정 ================= */
function openEditModal() {
    if (!currentDetailData) {
        alert("수정할 근태 정보가 없습니다.");
        return;
    }

    closeAttModal();
    renderAttEditList(currentDetailData.historyList ?? []);
    showModal("#att-edit-modal-wrap");
}

function cancelEditModal() {
    hideModal("#att-edit-modal-wrap");
    showModal("#att-modal-wrap");
}

function renderAttEditList(historyList) {
    const tbody = getEl("#att-edit-list");
    if (!tbody) return;

    if (!historyList || historyList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">수정할 데이터가 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (const item of historyList) {
        str += `
            <tr data-att-no="${item.attNo}" data-work-date="${item.workDate}">
                <td>${escapeHtml(formatDateShort(item.workDate))}</td>
                <td>
                    <select class="edit-status">
                        <option value="1" ${String(item.statusCode) === "1" ? "selected" : ""}>출근</option>
                        <option value="2" ${String(item.statusCode) === "2" ? "selected" : ""}>지각</option>
                        <option value="3" ${String(item.statusCode) === "3" ? "selected" : ""}>결근</option>
                        <option value="4" ${String(item.statusCode) === "4" ? "selected" : ""}>휴가</option>
                    </select>
                </td>
                <td>
                    <input type="time" class="edit-check-in" value="${item.checkInAt ?? ""}">
                </td>
                <td>
                    <input type="time" class="edit-check-out" value="${item.checkOutAt ?? ""}">
                </td>
                <td>
                    <input type="number" min="0" class="edit-ot-hours" value="${numberOrZero(item.otConfirmedHours)}">
                </td>
                <td>
                    <input type="text" class="edit-note" value="${escapeHtml(item.attNote ?? "")}">
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

async function saveAttEdit() {
    try {
        const rowList = document.querySelectorAll("#att-edit-list tr[data-att-no]");
        if (rowList.length === 0) {
            alert("수정할 행이 없습니다.");
            return;
        }

        for (const row of rowList) {
            const attNo = row.dataset.attNo;
            const workDate = row.dataset.workDate;

            const statusCode = row.querySelector(".edit-status")?.value ?? "";
            const checkInAt = row.querySelector(".edit-check-in")?.value ?? "";
            const checkOutAt = row.querySelector(".edit-check-out")?.value ?? "";
            const otConfirmedHours = row.querySelector(".edit-ot-hours")?.value ?? 0;
            const attNote = row.querySelector(".edit-note")?.value ?? "";

            const body = {
                statusCode: statusCode,
                checkInAt: checkInAt ? `${workDate} ${checkInAt}:00` : null,
                checkOutAt: checkOutAt ? `${workDate} ${checkOutAt}:00` : null,
                attNote: attNote,
                otApprovedHours: null,
                otConfirmedHours: Number(otConfirmedHours)
            };

            const resp = await fetch(`/att/${attNo}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!resp.ok) {
                throw new Error(`근태 수정 실패 - attNo: ${attNo}`);
            }
        }

        alert("근태 수정 완료");

        hideModal("#att-edit-modal-wrap");
        await reloadAttListKeepingState();
        await openAttDetail(currentEmpNo);
    } catch (error) {
        console.log(error);
        alert("근태 수정 실패...");
    }
}

/* ================= 페이징 ================= */
function renderPagination(pvo) {
    const pageArea = getEl("#att-pagination-area");
    if (!pageArea) return;

    if (!pvo) {
        pageArea.innerHTML = "";
        return;
    }

    let str = "";

    if (pvo.startPage > 1) {
        str += `
            <button
                type="button"
                class="page-btn"
                onclick="${getPageMoveFunction(pvo.startPage - 1)}"
            >
                &lt;
            </button>
        `;
    }

    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        str += `
            <button
                type="button"
                class="page-btn ${i === pvo.currentPage ? "active" : ""}"
                onclick="${getPageMoveFunction(i)}"
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
                onclick="${getPageMoveFunction(pvo.endPage + 1)}"
            >
                &gt;
            </button>
        `;
    }

    pageArea.innerHTML = str;
}

function getPageMoveFunction(page) {
    if (currentSearchType === "all" || currentKeyword === "") {
        return `loadAttList(${page})`;
    }
    return `searchAtt(${page})`;
}

async function reloadAttListKeepingState() {
    if (currentSearchType === "all" || currentKeyword === "") {
        await loadAttList(currentPage);
    } else {
        await searchAtt(currentPage);
    }
}