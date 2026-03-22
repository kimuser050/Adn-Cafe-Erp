/* =========================================================
   근태관리 JS
   ========================================================= */

let attList = [];
let currentMonth = "";
let currentEmpNo = null;
let currentDetailData = null;

/* =========================================================
   1. 시작
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        initDefaultMonth();
        bindEvents();
        await loadAttList();
    } catch (error) {
        console.log(error);
        alert("근태관리 페이지 로딩 실패 ...");
    }
});

/* =========================================================
   2. 초기설정 / 이벤트
   ========================================================= */
function initDefaultMonth() {
    const monthTag = document.querySelector("#month");
    if (!monthTag) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    currentMonth = `${year}-${month}`;
    monthTag.value = currentMonth;
}

function bindEvents() {
    const monthTag = document.querySelector("#month");
    const keywordTag = document.querySelector("#keyword");
    const searchBtn = document.querySelector("#search-btn");
    const searchTypeTag = document.querySelector("#search-type");

    if (monthTag) {
        monthTag.addEventListener("change", async function () {
            currentMonth = this.value;
            await loadAttList();
        });
    }

    if (keywordTag) {
        keywordTag.addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                await searchAtt();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", async function () {
            await searchAtt();
        });
    }

    if (searchTypeTag) {
        searchTypeTag.addEventListener("change", async function () {
            const keyword = document.querySelector("#keyword")?.value.trim() ?? "";
            if (keyword === "") {
                renderTable(attList);
            }
        });
    }
}

/* =========================================================
   3. 공통 함수
   ========================================================= */
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

function toDateTimeString(workDate, timeValue) {
    if (!timeValue || timeValue === "-") {
        return null;
    }
    return `${workDate} ${timeValue}:00`;
}

/* =========================================================
   4. 목록 조회
   ========================================================= */
async function loadAttList() {
    const month = document.querySelector("#month")?.value || currentMonth;

    const resp = await fetch(`/att?month=${encodeURIComponent(month)}`);
    if (!resp.ok) {
        throw new Error("근태 목록 조회 실패 ...");
    }

    const data = await resp.json();

    currentMonth = month;
    attList = data.voList ?? [];

    renderSummary(data.summary);
    renderTable(attList);
}

/* =========================================================
   5. 검색
   - 백엔드 검색 API가 없으므로 프론트에서 현재 월 목록 필터링
   ========================================================= */
async function searchAtt() {
    const searchType = document.querySelector("#search-type")?.value ?? "all";
    const keyword = document.querySelector("#keyword")?.value.trim().toLowerCase() ?? "";

    if (keyword === "" || searchType === "all") {
        renderTable(attList);
        return;
    }

    let filteredList = [];

    if (searchType === "name") {
        filteredList = attList.filter(vo =>
            String(vo.empName ?? "").toLowerCase().includes(keyword)
        );
    } else if (searchType === "dept") {
        filteredList = attList.filter(vo =>
            String(vo.deptName ?? "").toLowerCase().includes(keyword)
        );
    } else {
        filteredList = [...attList];
    }

    renderTable(filteredList);
}

/* =========================================================
   6. 요약 렌더링
   ========================================================= */
function renderSummary(summary) {
    document.querySelector("#total-workingDay-count").innerText = numberOrZero(summary?.attendanceCount);
    document.querySelector("#total-lateDay-count").innerText = numberOrZero(summary?.lateCount);
    document.querySelector("#total-absentDay-count").innerText = numberOrZero(summary?.absentCount);
    document.querySelector("#total-vacationDay-count").innerText = numberOrZero(summary?.vacationCount);
    document.querySelector("#total-overWorkHour-count").innerText = numberOrZero(summary?.otHours);
}

/* =========================================================
   7. 테이블 렌더링
   ========================================================= */
function renderTable(list) {
    const tbodyTag = document.querySelector("#att-list");
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

    for (let i = 0; i < list.length; i++) {
        const vo = list[i];

        str += `
            <tr>
                <td>${i + 1}</td>
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

/* =========================================================
   8. 상세조회 모달 열기
   ========================================================= */
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

        const modalWrap = document.querySelector("#att-modal-wrap");
        if (modalWrap) {
            modalWrap.style.display = "flex";
        }
    } catch (error) {
        console.log(error);
        alert("근태 상세조회 실패...");
    }
}

/* =========================================================
   9. 상세조회 기본정보 출력
   ========================================================= */
function renderAttDetail(data) {
    const memberInfo = data.memberInfo ?? {};
    const summary = data.summary ?? {};

    document.querySelector("#modal-att-empName").innerText = nvl(memberInfo.empName);
    document.querySelector("#modal-att-dept").innerText = nvl(memberInfo.deptName);
    document.querySelector("#modal-att-empNo").innerText = nvl(memberInfo.empNo);
    document.querySelector("#modal-att-pos").innerText = nvl(memberInfo.posName);

    document.querySelector("#modal-workingDay-count").innerText = numberOrZero(summary.attendanceCount);
    document.querySelector("#modal-lateDay-count").innerText = numberOrZero(summary.lateCount);
    document.querySelector("#modal-absentDay-count").innerText = numberOrZero(summary.absentCount);
    document.querySelector("#modal-vacationDay-count").innerText = numberOrZero(summary.vacationCount);
    document.querySelector("#modal-overWorkHour-count").innerText = numberOrZero(summary.otHours);

    const monthLabelTag = document.querySelector("#modal-att-month-label");
    if (monthLabelTag) {
        monthLabelTag.innerText = `조회기간: ${formatMonthLabel(currentMonth)}`;
    }

    const historyTitleTag = document.querySelector("#modal-history-title");
    if (historyTitleTag) {
        historyTitleTag.innerText = `${currentMonth} 근태이력`;
    }
}

/* =========================================================
   10. 상세조회 이력 리스트 출력
   ========================================================= */
function renderAttHistory(historyList) {
    const tbody = document.querySelector("#att-history-list");
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

/* =========================================================
   11. 상세조회 모달 닫기
   ========================================================= */
function closeAttModal() {
    const modalWrap = document.querySelector("#att-modal-wrap");
    if (modalWrap) {
        modalWrap.style.display = "none";
    }
}

/* =========================================================
   12. 수정 모달 열기
   ========================================================= */
function openEditModal() {
    if (!currentDetailData) {
        alert("수정할 근태 정보가 없습니다.");
        return;
    }

    closeAttModal();
    renderAttEditList(currentDetailData.historyList ?? []);

    const editModalWrap = document.querySelector("#att-edit-modal-wrap");
    if (editModalWrap) {
        editModalWrap.style.display = "flex";
    }
}

/* =========================================================
   13. 수정 모달 취소
   ========================================================= */
function cancelEditModal() {
    const editModalWrap = document.querySelector("#att-edit-modal-wrap");
    if (editModalWrap) {
        editModalWrap.style.display = "none";
    }

    const detailModalWrap = document.querySelector("#att-modal-wrap");
    if (detailModalWrap) {
        detailModalWrap.style.display = "flex";
    }
}

/* =========================================================
   14. 수정 모달 리스트 출력
   ========================================================= */
function renderAttEditList(historyList) {
    const tbody = document.querySelector("#att-edit-list");
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

/* =========================================================
   15. 수정 저장
   - 현재 백엔드는 1행씩 수정하는 구조
   - 그래서 행마다 PUT 요청
   ========================================================= */
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

        const editModalWrap = document.querySelector("#att-edit-modal-wrap");
        if (editModalWrap) {
            editModalWrap.style.display = "none";
        }

        await loadAttList();
        await openAttDetail(currentEmpNo);

    } catch (error) {
        console.log(error);
        alert("근태 수정 실패...");
    }
}