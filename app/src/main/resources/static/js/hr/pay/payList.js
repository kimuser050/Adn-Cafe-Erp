/* =========================================================
   급여관리 JS
   - 목록 / 상세조회 / 수정
   ========================================================= */

/* =========================================================
   1. 전역 상태값
   ========================================================= */
let currentPage = 1;
let currentMonth = "";

let payList = [];

let currentPayNo = null;
let currentConfirmYn = null;
let currentPayVo = null;

/* =========================================================
   2. 시작
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        initDefaultMonth();
        bindEvents();
        setSearchPlaceholder();
        await loadPayList();
    } catch (error) {
        console.log(error);
        alert("급여관리 페이지 로딩 실패 ...");
    }
});

/* =========================================================
   3. 공통 DOM
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

/* =========================================================
   4. 초기 설정
   ========================================================= */
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
            await searchPay(1);
        });
    }

    if (keywordTag) {
        keywordTag.addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                await searchPay(1);
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", async function () {
            await searchPay(1);
        });
    }

    if (searchTypeTag) {
        searchTypeTag.addEventListener("change", async function () {
            setSearchPlaceholder();

            const keyword = getValue("#keyword").trim();
            if (keyword === "") {
                await loadPayList(1);
            }
        });
    }
}

function setSearchPlaceholder() {
    const searchType = getValue("#search-type");
    const keywordInput = getEl("#keyword");

    if (!keywordInput) return;

    if (searchType === "name") {
        keywordInput.placeholder = "사원명을 입력하세요";
        return;
    }

    if (searchType === "confirmYn") {
        keywordInput.placeholder = "확정 / 미확정을 입력하세요";
        return;
    }

    keywordInput.placeholder = "검색어를 입력하세요";
}

/* =========================================================
   5. 공통 유틸
   ========================================================= */
function nvl(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return value;
}

function formatMoney(value) {
    if (value === null || value === undefined || value === "") {
        return "0";
    }
    return Number(value).toLocaleString("ko-KR");
}

function parseNumber(value) {
    if (value === null || value === undefined || value === "") {
        return 0;
    }
    return Number(String(value).replaceAll(",", "")) || 0;
}

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function getConfirmInfo(confirmYn) {
    if (String(confirmYn) === "Y") {
        return {
            text: "확정",
            className: "status-confirmed"
        };
    }

    return {
        text: "미확정",
        className: "status-pending"
    };
}

function getMonthValue() {
    return getValue("#month") || currentMonth;
}

function getSearchState() {
    return {
        searchType: getValue("#search-type") || "all",
        keyword: getValue("#keyword").trim()
    };
}

/* =========================================================
   6. 목록 조회 / 검색
   ========================================================= */
async function loadPayList(page = 1) {
    const month = getMonthValue();
    currentPage = page;

    const resp = await fetch(`/pay?month=${encodeURIComponent(month)}&currentPage=${page}`);
    if (!resp.ok) {
        throw new Error("급여 목록 조회 실패 ...");
    }

    const data = await resp.json();

    currentMonth = data.month ?? month;
    payList = data.voList ?? [];

    renderSummary(data.summary);
    renderTable(payList);
    renderPagination(data.pvo);
}

async function searchPay(page = 1) {
    const month = getMonthValue();
    const { searchType, keyword } = getSearchState();

    currentPage = page;

    // 전체 검색이거나 검색어 없으면 그냥 목록 재조회
    if (searchType === "all" || keyword === "") {
        await loadPayList(page);
        return;
    }

    let url = "";

    if (searchType === "name") {
        url = `/pay/search/name?month=${encodeURIComponent(month)}&keyword=${encodeURIComponent(keyword)}&currentPage=${page}`;
    }

    if (searchType === "confirmYn") {
        let confirmYn = "";

        if (keyword === "확정" || keyword.toUpperCase() === "Y") {
            confirmYn = "Y";
        } else if (keyword === "미확정" || keyword.toUpperCase() === "N") {
            confirmYn = "N";
        } else {
            alert("상태 검색은 '확정', '미확정', 'Y', 'N' 중 하나로 입력해주세요.");
            return;
        }

        url = `/pay/search/confirmYn?month=${encodeURIComponent(month)}&confirmYn=${confirmYn}&currentPage=${page}`;
    }

    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error("급여 검색 실패 ...");
    }

    const data = await resp.json();

    currentMonth = data.month ?? month;
    payList = data.voList ?? [];

    renderSummary(data.summary);
    renderTable(payList);
    renderPagination(data.pvo);
}

/* =========================================================
   7. 목록 렌더링
   ========================================================= */
function renderSummary(summary) {
    const safeSummary = summary || {};

    const totalCount = Number(safeSummary.totalCount ?? safeSummary.TOTALCOUNT ?? 0);
    const totalNetAmount = Number(safeSummary.totalNetAmount ?? safeSummary.TOTALNETAMOUNT ?? 0);
    const unconfirmedCount = Number(safeSummary.unconfirmedCount ?? safeSummary.UNCONFIRMEDCOUNT ?? 0);
    const confirmedCount = Number(safeSummary.confirmedCount ?? safeSummary.CONFIRMEDCOUNT ?? 0);

    const totalCountTag = getEl("#total-count");
    const totalNetAmountTag = getEl("#total-net-amount");
    const unconfirmedCountTag = getEl("#unconfirmed-count");
    const confirmedCountTag = getEl("#confirmed-count");

    if (totalCountTag) totalCountTag.innerText = totalCount;
    if (totalNetAmountTag) totalNetAmountTag.innerText = `₩ ${formatMoney(totalNetAmount)}`;
    if (unconfirmedCountTag) unconfirmedCountTag.innerText = unconfirmedCount;
    if (confirmedCountTag) confirmedCountTag.innerText = confirmedCount;
}

function renderTable(list) {
    const tbodyTag = getEl("#pay-list");
    if (!tbodyTag) return;

    if (!list || list.length === 0) {
        tbodyTag.innerHTML = `
            <tr class="empty-row">
                <td colspan="8">조회된 급여 데이터가 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < list.length; i++) {
        const vo = list[i];
        const confirmInfo = getConfirmInfo(vo.confirmYn);

        str += `
            <tr>
                <td>${i + 1}</td>
                <td>
                    <span class="link-text" onclick="openPayDetail('${vo.payNo}')">
                        ${escapeHtml(nvl(vo.empName))}
                    </span>
                </td>
                <td>${escapeHtml(nvl(vo.empNo))}</td>
                <td>${escapeHtml(nvl(vo.posName))}</td>
                <td>${escapeHtml(nvl(vo.deptName))}</td>
                <td>${escapeHtml(nvl(vo.payMonth))}</td>
                <td>${formatMoney(vo.netAmount)}</td>
                <td>
                    <span class="status ${confirmInfo.className}">
                        ${confirmInfo.text}
                    </span>
                </td>
            </tr>
        `;
    }

    tbodyTag.innerHTML = str;
}

function goPayRegisterPage() {
    location.href = "/hr/pay/insert";
}

/* =========================================================
   8. 상세조회 모달
   ========================================================= */
async function openPayDetail(payNo) {
    try {
        const resp = await fetch(`/pay/${payNo}`);
        if (!resp.ok) {
            throw new Error("급여 상세조회 실패");
        }

        const vo = await resp.json();

        currentPayNo = payNo;
        currentConfirmYn = vo.confirmYn;
        currentPayVo = vo;

        renderPayDetail(vo);
        renderPayDetailItemList(vo.detailList);

        showModal("#pay-modal-wrap");
    } catch (error) {
        console.log(error);
        alert("급여 상세조회 실패...");
    }
}

function renderPayDetail(vo) {
    getEl("#modal-pay-empName").innerText = nvl(vo.empName);
    getEl("#modal-pay-dept").innerText = nvl(vo.deptName);
    getEl("#modal-pay-empNo").innerText = nvl(vo.empNo);
    getEl("#modal-pay-pos").innerText = nvl(vo.posName);
    getEl("#modal-pay-payYearMonth").innerText = nvl(vo.payMonth);

    currentConfirmYn = vo.confirmYn;

    const confirmTag = getEl("#modal-pay-confirmYn");
    if (confirmTag) {
        const confirmInfo = getConfirmInfo(vo.confirmYn);
        confirmTag.className = `status ${confirmInfo.className}`;
        confirmTag.innerText = confirmInfo.text;
    }

    getEl("#modal-pay-totalEarnAmount").innerText = formatMoney(vo.totalEarnAmount);
    getEl("#modal-pay-totalDeductAmount").innerText = formatMoney(vo.totalDeductAmount);
    getEl("#modal-pay-netAmount").innerText = formatMoney(vo.netAmount);

    const toggleBtn = getEl("#toggle-confirm-btn");
    if (toggleBtn) {
        toggleBtn.innerText = (vo.confirmYn === "Y") ? "확정취소" : "급여확정";
    }

    applyLockedButtonStyle(vo.confirmYn);
}

function renderPayDetailItemList(detailList) {
    const tbody = getEl("#modal-payDetail-list");
    if (!tbody) return;

    if (!detailList || detailList.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">상세 항목이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (const item of detailList) {
        const taxText = item.isTaxable === "Y" ? "과세" : "비과세";

        str += `
            <tr>
                <td>${escapeHtml(nvl(item.itemName))}</td>
                <td>${escapeHtml(nvl(item.itemType))}</td>
                <td>${taxText}</td>
                <td>${formatMoney(item.amount)}</td>
                <td>${escapeHtml(nvl(item.payNote))}</td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function closePayModal() {
    hideModal("#pay-modal-wrap");
}

/* =========================================================
   9. 상세 모달 버튼 상태
   ========================================================= */
function applyLockedButtonStyle(confirmYn) {
    const editBtn = getEl("#open-edit-btn");
    const deleteBtn = getEl("#delete-pay-btn");

    const isConfirmed = String(confirmYn) === "Y";

    if (editBtn) {
        editBtn.disabled = false;
        editBtn.classList.toggle("btn-locked", isConfirmed);
        editBtn.title = isConfirmed ? "확정상태에서는 변경이 불가합니다." : "";
    }

    if (deleteBtn) {
        deleteBtn.disabled = false;
        deleteBtn.classList.toggle("btn-locked", isConfirmed);
        deleteBtn.title = isConfirmed ? "확정상태에서는 변경이 불가합니다." : "";
    }
}

/* =========================================================
   10. 확정 / 삭제
   ========================================================= */
async function toggleConfirmYn() {
    try {
        if (!currentPayNo) {
            alert("선택된 급여가 없습니다.");
            return;
        }

        let url = "";
        let msg = "";

        if (currentConfirmYn === "Y") {
            url = `/pay/${currentPayNo}/confirmN`;
            msg = "미확정으로 변경하시겠습니까?";
        } else {
            url = `/pay/${currentPayNo}/confirmY`;
            msg = "확정 하시겠습니까?";
        }

        const ok = confirm(msg);
        if (!ok) return;

        const resp = await fetch(url, { method: "PUT" });
        const data = await resp.json();

        if (!resp.ok) {
            alert(data.errorMsg || data.msg || "상태 변경 실패");
            return;
        }

        if (data.result != 1) {
            alert(data.msg || "처리 실패");
            return;
        }

        alert(data.msg || "처리 완료");

        await loadPayList();
        await openPayDetail(currentPayNo);
    } catch (error) {
        console.log(error);
        alert("확정 상태 변경 실패...");
    }
}

async function deletePay() {
    try {
        if (!currentPayNo) {
            alert("선택된 급여가 없습니다.");
            return;
        }

        if (currentConfirmYn === "Y") {
            alert("확정상태에서는 변경이 불가합니다.");
            return;
        }

        const ok = confirm("정말 삭제하시겠습니까?");
        if (!ok) return;

        const resp = await fetch(`/pay/${currentPayNo}/delete`, {
            method: "PUT"
        });

        const data = await resp.json();

        if (!resp.ok) {
            alert(data.errorMsg || data.msg || "삭제 실패");
            return;
        }

        if (data.result != 1) {
            alert(data.msg || "삭제 처리 실패");
            return;
        }

        alert(data.msg || "삭제 완료");

        closePayModal();
        await loadPayList();
    } catch (error) {
        console.log(error);
        alert("삭제 중 오류 발생...");
    }
}

/* =========================================================
   11. 수정 모달 열기 / 닫기
   ========================================================= */
function openEditModal() {
    if (!currentPayVo) {
        alert("수정할 급여 정보가 없습니다.");
        return;
    }

    if (currentConfirmYn === "Y") {
        alert("확정상태에서는 변경이 불가합니다.");
        return;
    }

    closePayModal();

    const payNoTag = getEl("#edit-pay-no");
    if (payNoTag) {
        payNoTag.value = currentPayVo.payNo;
    }

    renderPayEditItemList(currentPayVo.detailList || []);
    showModal("#pay-edit-modal-wrap");
}

async function cancelEditModal() {
    hideModal("#pay-edit-modal-wrap");
    showModal("#pay-modal-wrap");
}

/* =========================================================
   12. 수정 모달 렌더링
   ========================================================= */
function renderPayEditItemList(detailList) {
    const tbody = getEl("#payList-edit-body");
    if (!tbody) return;

    if (!detailList || detailList.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">상세 항목이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (const item of detailList) {
        const itemName = item.itemName || "";

        // 완전 고정 항목
        const isFullyFixed =
            itemName === "기본급" ||
            itemName === "보너스" ||
            itemName === "연장근무수당";

        // 일부 고정 항목
        const isPartialFixed =
            itemName === "식대" ||
            itemName === "소득세" ||
            itemName === "건강보험";

        // 각 칸별 잠금 여부
        const lockItemName = isFullyFixed || isPartialFixed;
        const lockItemType = isFullyFixed || isPartialFixed;
        const lockTaxable = isFullyFixed || isPartialFixed;
        const lockAmount = isFullyFixed;
        const lockNote = isFullyFixed;

        str += `
            <tr
                data-fixed="${isFullyFixed ? "Y" : "N"}"
                data-item-code="${escapeHtml(item.itemCode || "")}"
            >
                <!-- 항목명 -->
                <td>
                    <input
                        type="text"
                        class="form-input ${lockItemName ? "fixed-input" : ""}"
                        value="${escapeHtml(itemName)}"
                        ${lockItemName ? "readonly" : ""}
                    >
                </td>

                <!-- 구분 -->
                <td class="${lockItemType ? "" : "editable-cell"}">
                    <select
                        class="form-select ${lockItemType ? "fixed-select" : ""}"
                        ${lockItemType ? "disabled" : ""}
                    >
                        <option value="지급" ${item.itemType === "지급" ? "selected" : ""}>지급</option>
                        <option value="공제" ${item.itemType === "공제" ? "selected" : ""}>공제</option>
                    </select>
                </td>

                <!-- 과세여부 -->
                <td class="${lockTaxable ? "" : "editable-cell"}">
                    <select
                        class="form-select ${lockTaxable ? "fixed-select" : ""}"
                        ${lockTaxable ? "disabled" : ""}
                    >
                        <option value="Y" ${item.isTaxable === "Y" ? "selected" : ""}>과세</option>
                        <option value="N" ${item.isTaxable === "N" ? "selected" : ""}>비과세</option>
                    </select>
                </td>

                <!-- 금액 -->
                <td class="${lockAmount ? "" : "editable-cell"}">
                    <input
                        type="text"
                        class="form-input edit-amount-input ${lockAmount ? "fixed-input" : ""}"
                        value="${formatMoney(item.amount)}"
                        ${lockAmount ? "readonly" : ""}
                    >
                </td>

                <!-- 비고 -->
                <td class="${lockNote ? "" : "editable-cell"}">
                    <input
                        type="text"
                        class="form-input edit-note-input ${lockNote ? "fixed-input" : ""}"
                        value="${escapeHtml(item.payNote || "")}"
                        ${lockNote ? "readonly" : ""}
                    >
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

/* =========================================================
   13. 수정 저장
   ========================================================= */
async function savePayEdit() {
    try {
        if (!currentPayNo) {
            alert("수정할 급여가 없습니다.");
            return;
        }

        if (currentConfirmYn === "Y") {
            alert("확정상태에서는 변경이 불가합니다.");
            return;
        }

        const rowList = document.querySelectorAll("#payList-edit-body tr");

        let totalEarnAmount = 0;
        let totalDeductAmount = 0;
        const detailList = [];

        for (const row of rowList) {
            const itemCode = row.dataset.itemCode;

            const selectList = row.querySelectorAll("select");
            const itemType = selectList[0]?.value || "";
            const isTaxable = selectList[1]?.value || "Y";

            const amountInput = row.querySelector(".edit-amount-input");
            const noteInput = row.querySelector(".edit-note-input");

            const amount = parseNumber(amountInput?.value || 0);
            const payNote = (noteInput?.value || "").trim();

            // 금액 0보다 큰 항목만 전송
            if (amount > 0) {
                detailList.push({
                    itemCode: itemCode,
                    itemType: itemType,
                    isTaxable: isTaxable,
                    amount: String(amount),
                    payNote: payNote
                });

                if (itemType === "지급") {
                    totalEarnAmount += amount;
                } else if (itemType === "공제") {
                    totalDeductAmount += amount;
                }
            }
        }

        if (detailList.length === 0) {
            alert("금액을 1개 이상 입력해주세요.");
            return;
        }

        const netAmount = totalEarnAmount - totalDeductAmount;

        const payload = {
            totalEarnAmount: String(totalEarnAmount),
            totalDeductAmount: String(totalDeductAmount),
            netAmount: String(netAmount),
            detailList: detailList
        };

        const resp = await fetch(`/pay/${currentPayNo}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();

        if (!resp.ok) {
            alert(data.errorMsg || data.msg || "급여 수정 실패");
            return;
        }

        if (data.result != 1) {
            alert(data.msg || "급여 수정 실패");
            return;
        }

        alert(data.msg || "급여 수정 성공");

        hideModal("#pay-edit-modal-wrap");
        await loadPayList();
        await openPayDetail(currentPayNo);
    } catch (error) {
        console.log(error);
        alert("급여 수정 중 오류 발생...");
    }
}

/* =========================================================
   14. 페이징
   ========================================================= */
function renderPagination(pvo) {
    const pageArea = getEl("#pay-pagination-area");
    if (!pageArea) return;

    if (!pvo) {
        pageArea.innerHTML = `
            <button type="button" class="page-btn active">1</button>
        `;
        return;
    }

    const { searchType, keyword } = getSearchState();

    let str = "";

    const start = pvo.startPage || 1;
    const end = pvo.endPage || 1;

    for (let i = start; i <= end; i++) {
        str += `
            <button
                type="button"
                class="page-btn ${i === pvo.currentPage ? "active" : ""}"
                onclick="${getPageMoveFunction(i, searchType, keyword)}"
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
                onclick="${getPageMoveFunction(pvo.endPage + 1, searchType, keyword)}"
            >
                &gt;
            </button>
        `;
    }

    pageArea.innerHTML = str;
}

function getPageMoveFunction(page, searchType, keyword) {
    if (searchType === "all" || keyword === "") {
        return `loadPayList(${page})`;
    }

    return `searchPay(${page})`;
}