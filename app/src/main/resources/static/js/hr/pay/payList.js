/* =========================================================
   급여관리 JS - 목록 / 상세 / 수정
   ========================================================= */
let currentPage = 1;
let payList = [];
let currentMonth = "";

let currentPayNo = null;
let currentConfirmYn = null;
let currentPayVo = null;

window.addEventListener("DOMContentLoaded", async function () {
    try {
        initDefaultMonth();
        bindEvents();
        initSearchPlaceholder();
        await loadPayList();
    } catch (error) {
        console.log(error);
        alert("급여관리 페이지 로딩 실패 ...");
    }
});

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

        const keywordInput = document.querySelector("#keyword");

        if (this.value === "name") {
            keywordInput.placeholder = "사원명을 입력하세요";
        } else if (this.value === "confirmYn") {
            keywordInput.placeholder = "확정 / 미확정을 입력하세요";
        } else {
            keywordInput.placeholder = "검색어를 입력하세요";
        }

        const keyword = document.querySelector("#keyword")?.value.trim() ?? "";
        if (keyword === "") {
            await loadPayList(1);
        }
    });
    }
}

function initSearchPlaceholder() {
    const searchType = document.querySelector("#search-type")?.value;
    const keywordInput = document.querySelector("#keyword");

    if (!keywordInput) return;

    if (searchType === "name") {
        keywordInput.placeholder = "사원명을 입력하세요";
    } else if (searchType === "confirmYn") {
        keywordInput.placeholder = "확정 / 미확정을 입력하세요";
    } else {
        keywordInput.placeholder = "검색어를 입력하세요";
    }
}

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
    if (value === null || value === undefined) return "";
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

async function loadPayList(page = 1) {
    const month = document.querySelector("#month")?.value || currentMonth;
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
    const month = document.querySelector("#month")?.value || currentMonth;
    const searchType = document.querySelector("#search-type")?.value ?? "all";
    const keyword = document.querySelector("#keyword")?.value.trim() ?? "";

    currentPage = page;

    if (searchType === "all" || keyword === "") {
        await loadPayList(page);
        return;
    }

    let url = "";

    if (searchType === "name") {
        url = `/pay/search/name?month=${encodeURIComponent(month)}&keyword=${encodeURIComponent(keyword)}&currentPage=${page}`;
    } else if (searchType === "confirmYn") {
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

function renderSummary(summary) {
    const totalCountTag = document.querySelector("#total-count");
    const totalNetAmountTag = document.querySelector("#total-net-amount");
    const unconfirmedCountTag = document.querySelector("#unconfirmed-count");
    const confirmedCountTag = document.querySelector("#confirmed-count");

    const safeSummary = summary || {};

    const totalCount = Number(
        safeSummary.totalCount ?? safeSummary.TOTALCOUNT ?? 0
    );

    const totalNetAmount = Number(
        safeSummary.totalNetAmount ?? safeSummary.TOTALNETAMOUNT ?? 0
    );

    const unconfirmedCount = Number(
        safeSummary.unconfirmedCount ?? safeSummary.UNCONFIRMEDCOUNT ?? 0
    );

    const confirmedCount = Number(
        safeSummary.confirmedCount ?? safeSummary.CONFIRMEDCOUNT ?? 0
    );

    if (totalCountTag) totalCountTag.innerText = totalCount;
    if (totalNetAmountTag) totalNetAmountTag.innerText = `₩ ${formatMoney(totalNetAmount)}`;
    if (unconfirmedCountTag) unconfirmedCountTag.innerText = unconfirmedCount;
    if (confirmedCountTag) confirmedCountTag.innerText = confirmedCount;
}

function renderTable(list) {
    const tbodyTag = document.querySelector("#pay-list");
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

        const modalWrap = document.querySelector("#pay-modal-wrap");
        if (modalWrap) {
            modalWrap.style.display = "flex";
        }

    } catch (error) {
        console.log(error);
        alert("급여 상세조회 실패...");
    }
}

function renderPayDetail(vo) {
    document.querySelector("#modal-pay-empName").innerText = nvl(vo.empName);
    document.querySelector("#modal-pay-dept").innerText = nvl(vo.deptName);
    document.querySelector("#modal-pay-empNo").innerText = nvl(vo.empNo);
    document.querySelector("#modal-pay-pos").innerText = nvl(vo.posName);
    document.querySelector("#modal-pay-payYearMonth").innerText = nvl(vo.payMonth);

    currentConfirmYn = vo.confirmYn;

    const confirmTag = document.querySelector("#modal-pay-confirmYn");
    if (confirmTag) {
        const confirmInfo = getConfirmInfo(vo.confirmYn);
        confirmTag.className = `status ${confirmInfo.className}`;
        confirmTag.innerText = confirmInfo.text;
    }

    document.querySelector("#modal-pay-totalEarnAmount").innerText = formatMoney(vo.totalEarnAmount);
    document.querySelector("#modal-pay-totalDeductAmount").innerText = formatMoney(vo.totalDeductAmount);
    document.querySelector("#modal-pay-netAmount").innerText = formatMoney(vo.netAmount);

    const toggleBtn = document.querySelector("#toggle-confirm-btn");
    if (toggleBtn) {
        toggleBtn.innerText = (vo.confirmYn === "Y") ? "확정취소" : "급여확정";
    }

    applyLockedButtonStyle(vo.confirmYn);
}

function applyLockedButtonStyle(confirmYn) {
    const editBtn = document.querySelector("#open-edit-btn");
    const deleteBtn = document.querySelector("#delete-pay-btn");

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

function renderPayDetailItemList(detailList) {
    const tbody = document.querySelector("#modal-payDetail-list");
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

function closePayModal() {
    const modalWrap = document.querySelector("#pay-modal-wrap");
    if (modalWrap) {
        modalWrap.style.display = "none";
    }
}

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

    const payNoTag = document.querySelector("#edit-pay-no");
    if (payNoTag) {
        payNoTag.value = currentPayVo.payNo;
    }

    renderPayEditItemList(currentPayVo.detailList || []);

    const editModalWrap = document.querySelector("#pay-edit-modal-wrap");
    if (editModalWrap) {
        editModalWrap.style.display = "flex";
    }
}

async function cancelEditModal() {
    const editModalWrap = document.querySelector("#pay-edit-modal-wrap");
    if (editModalWrap) {
        editModalWrap.style.display = "none";
    }

    const detailModalWrap = document.querySelector("#pay-modal-wrap");
    if (detailModalWrap) {
        detailModalWrap.style.display = "flex";
    }
}

function renderPayEditItemList(detailList) {
    const tbody = document.querySelector("#payList-edit-body");
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

        /* -------------------------------------------------
           1. 완전 고정 항목
           - 항목명 / 구분 / 과세여부 / 금액 / 비고 전부 수정불가
           ------------------------------------------------- */
        const isFullyFixed =
            itemName === "기본급" ||
            itemName === "보너스" ||
            itemName === "연장근무수당";

        /* -------------------------------------------------
           2. 일부 고정 항목
           - 항목명 / 구분 / 과세여부만 수정불가
           - 금액 / 비고는 수정 가능
           ------------------------------------------------- */
        const isPartialFixed =
            itemName === "식대" ||
            itemName === "소득세" ||
            itemName === "건강보험";

        /* -------------------------------------------------
           3. 각 컬럼별 수정 가능 여부
           ------------------------------------------------- */
        const lockItemName = isFullyFixed || isPartialFixed;
        const lockItemType = isFullyFixed || isPartialFixed;
        const lockTaxable = isFullyFixed || isPartialFixed;
        const lockAmount = isFullyFixed;
        const lockNote = isFullyFixed;

        str += `
            <tr data-fixed="${isFullyFixed ? "Y" : "N"}"
                data-item-code="${escapeHtml(item.itemCode || "")}">
                
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

        const editModalWrap = document.querySelector("#pay-edit-modal-wrap");
        if (editModalWrap) {
            editModalWrap.style.display = "none";
        }

        await loadPayList();
        await openPayDetail(currentPayNo);

    } catch (error) {
        console.log(error);
        alert("급여 수정 중 오류 발생...");
    }
}


function renderPagination(pvo) {
    const pageArea = document.querySelector("#pay-pagination-area");
    if (!pageArea) return;

    // pvo 없으면 기본 1페이지라도 생성
    if (!pvo) {
        pageArea.innerHTML = `
            <button type="button" class="page-btn active">1</button>
        `;
        return;
    }

    const searchType = document.querySelector("#search-type")?.value ?? "all";
    const keyword = document.querySelector("#keyword")?.value.trim() ?? "";

    let str = "";

    // 🔥 최소 1페이지 보장
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

    // 다음 버튼
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