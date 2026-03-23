/* =========================================================
   급여등록 JS
   ========================================================= */

/* =========================================================
   1. 전역 변수
   ========================================================= */
let payItemList = [];
let selectedEmp = null;

/* =========================================================
   2. 시작
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    initCurrentMonth();
    bindEvents();
    await loadPayItems();
});

/* =========================================================
   3. 공통 DOM / 유틸
   ========================================================= */
function getEl(selector) {
    return document.querySelector(selector);
}

function getValue(selector) {
    return getEl(selector)?.value ?? "";
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("ko-KR");
}

function formatWon(value) {
    return `₩ ${formatNumber(value)}`;
}

function flashSummary() {
    const box = getEl("#summary-box");
    if (!box) return;

    box.classList.remove("summary-flash");
    void box.offsetWidth;
    box.classList.add("summary-flash");
}

/* =========================================================
   4. 초기 세팅
   ========================================================= */
function initCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;

    updateMonthUI(currentMonth);
}

function bindEvents() {
    getEl("#search-emp-btn")?.addEventListener("click", searchEmp);
    getEl("#auto-calc-btn")?.addEventListener("click", autoCalculate);
    getEl("#save-btn")?.addEventListener("click", insertPay);

    getEl("#cancel-btn")?.addEventListener("click", function () {
        location.href = "/hr/pay/list";
    });

    getEl("#keyword")?.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchEmp();
        }
    });

    getEl("#pay-month")?.addEventListener("change", function () {
        const month = this.value || "-";
        updateMonthUI(month);
    });
}

/* =========================================================
   5. 화면 표시용 함수
   ========================================================= */
function updateMonthUI(month) {
    getEl("#pay-month").value = month;
    getEl("#info-pay-month").innerText = month;
    getEl("#top-selected-month").innerText = `지급월 ${month}`;
}

function clearEmpInfo() {
    getEl("#emp-name").innerText = "-";
    getEl("#emp-no").innerText = "-";
    getEl("#emp-dept").innerText = "-";
    getEl("#emp-pos").innerText = "-";
    getEl("#top-selected-emp").innerText = "선택 직원 없음";
}

function setEmpInfo(emp) {
    getEl("#emp-name").innerText = emp.empName || "-";
    getEl("#emp-no").innerText = emp.empNo || "-";
    getEl("#emp-dept").innerText = emp.deptName || "-";
    getEl("#emp-pos").innerText = emp.posName || "-";
    getEl("#top-selected-emp").innerText = `${emp.empName} (${emp.empNo})`;
}

function renderEmpSearchLoading() {
    getEl("#emp-search-result").innerHTML = `
        <div class="emp-empty">직원을 검색 중입니다...</div>
    `;
}

function renderEmpSearchFail() {
    getEl("#emp-search-result").innerHTML = `
        <div class="emp-empty">직원 검색에 실패했습니다.</div>
    `;
}

function renderEmpSearchEmpty() {
    getEl("#emp-search-result").innerHTML = `
        <div class="emp-empty">검색 결과가 없습니다.</div>
    `;
}

/* =========================================================
   6. 급여 항목 불러오기
   ========================================================= */
async function loadPayItems() {
    const resp = await fetch("/pay/items");

    if (!resp.ok) {
        alert("급여 항목 조회 실패");
        return;
    }

    payItemList = await resp.json();
    renderPayItems(payItemList);
    bindAmountInputs();
}

function renderPayItems(list) {
    const tbody = getEl("#pay-item-body");
    let str = "";

    for (const item of list) {
        const isFixed =
            item.itemName === "기본급" ||
            item.itemName === "보너스" ||
            item.itemName === "연장근무수당";

        const taxText = item.isTaxable === "Y"
            ? `<span class="tax-badge taxable">과세</span>`
            : `<span class="tax-badge nontaxable">비과세</span>`;

        str += `
            <tr data-code="${item.itemCode}" data-type="${item.itemType}" data-name="${item.itemName}">
                <td class="pay-item-name">${item.itemName}</td>
                <td class="pay-item-type">${item.itemType}</td>
                <td>${taxText}</td>
                <td>
                    <input type="text"
                           class="form-input amount amount-input"
                           placeholder="0"
                           ${isFixed ? "readonly" : ""}>
                </td>
                <td>
                    <input type="text"
                           class="form-input note note-input"
                           placeholder="비고 입력">
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function bindAmountInputs() {
    const amountInputs = document.querySelectorAll(".amount");

    amountInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/[^\d]/g, "");
            calculateSummary();
        });
    });
}

/* =========================================================
   7. 직원 검색
   ========================================================= */
async function searchEmp() {
    const keyword = getValue("#keyword").trim();

    if (keyword === "") {
        alert("검색어를 입력하세요");
        return;
    }

    renderEmpSearchLoading();

    const resp = await fetch(`/pay/emps?keyword=${encodeURIComponent(keyword)}`);

    if (!resp.ok) {
        renderEmpSearchFail();
        alert("직원 검색 실패");
        return;
    }

    const list = await resp.json();

    if (!list || list.length === 0) {
        renderEmpSearchEmpty();
        return;
    }

    let str = "";
    for (const emp of list) {
        str += `
            <div class="emp-result-item"
                 data-emp-no="${emp.empNo}"
                 onclick="selectEmp('${emp.empNo}', this)">
                <div class="emp-result-name">${emp.empName}</div>
                <div class="emp-result-no">${emp.empNo}</div>
                <div class="emp-result-dept">${emp.deptName ?? "-"}</div>
                <div class="emp-result-pos">${emp.posName ?? "-"}</div>
                <div class="emp-result-arrow">›</div>
            </div>
        `;
    }

    getEl("#emp-search-result").innerHTML = str;
}

/* =========================================================
   8. 직원 선택
   ========================================================= */
async function selectEmp(empNo, element) {
    const resp = await fetch(`/pay/emps/${empNo}`);

    if (!resp.ok) {
        alert("직원 정보 조회 실패");
        return;
    }

    selectedEmp = await resp.json();
    setEmpInfo(selectedEmp);

    document.querySelectorAll(".emp-result-item").forEach(function (item) {
        item.classList.remove("selected");
    });

    if (element) {
        element.classList.add("selected");
    }
}

/* =========================================================
   9. 자동계산
   ========================================================= */
async function autoCalculate() {
    if (!selectedEmp) {
        alert("직원을 먼저 선택하세요");
        return;
    }

    const month = getValue("#pay-month");
    if (!month) {
        alert("지급월을 먼저 선택하세요");
        return;
    }

    const base = Number(selectedEmp.baseSalary || 0);
    const bonus = Math.round(base * Number(selectedEmp.bonusRate || 0));

    const resp = await fetch(`/pay/emps/${selectedEmp.empNo}/attendance-summary?month=${month}`);
    if (!resp.ok) {
        alert("근태 연장근무 조회 실패");
        return;
    }

    const attData = await resp.json();
    const otHours = Number(attData.otHours || 0);
    const overtimePay = 30000 * otHours;

    const rows = document.querySelectorAll("#pay-item-body tr");

    rows.forEach(function (row) {
        const name = row.dataset.name;
        const amountInput = row.querySelector(".amount");
        const noteInput = row.querySelector(".note");

        amountInput.classList.remove("auto-filled");
        noteInput.classList.remove("auto-filled");

        if (name === "기본급") {
            amountInput.value = base;
            noteInput.value = "직급 기준 자동 반영";
            amountInput.classList.add("auto-filled");
            noteInput.classList.add("auto-filled");
        }

        if (name === "보너스") {
            amountInput.value = bonus;
            noteInput.value = "직급 기준 자동 반영";
            amountInput.classList.add("auto-filled");
            noteInput.classList.add("auto-filled");
        }

        if (name === "연장근무수당") {
            amountInput.value = overtimePay;
            noteInput.value = `${otHours}시간 반영 / 시간당 30,000원`;
            amountInput.classList.add("auto-filled");
            noteInput.classList.add("auto-filled");
        }
    });

    calculateSummary();
}

/* =========================================================
   10. 합계 계산
   ========================================================= */
function calculateSummary() {
    const rows = document.querySelectorAll("#pay-item-body tr");

    let earn = 0;
    let deduct = 0;

    rows.forEach(function (row) {
        const type = row.dataset.type;
        const amountInput = row.querySelector(".amount");

        if (!amountInput) return;

        const value = Number(amountInput.value || 0);

        if (type === "지급") {
            earn += value;
        } else {
            deduct += value;
        }
    });

    const net = earn - deduct;

    getEl("#total-earn-amount").innerText = formatWon(earn);
    getEl("#total-deduct-amount").innerText = formatWon(deduct);
    getEl("#net-amount").innerText = formatWon(net);

    flashSummary();
}

/* =========================================================
   11. 저장
   ========================================================= */
async function insertPay() {
    if (!selectedEmp) {
        alert("직원을 선택하세요");
        return;
    }

    const month = getValue("#pay-month");
    if (!month) {
        alert("지급월을 선택하세요");
        return;
    }

    const rows = document.querySelectorAll("#pay-item-body tr");
    const detailList = [];

    let totalEarnAmount = 0;
    let totalDeductAmount = 0;

    rows.forEach(function (row) {
        const amountInput = row.querySelector(".amount");
        const noteInput = row.querySelector(".note");

        if (!amountInput || !noteInput) return;

        const amount = Number(amountInput.value || 0);
        const type = row.dataset.type;

        if (amount > 0) {
            detailList.push({
                itemCode: row.dataset.code,
                amount: String(amount),
                payNote: noteInput.value
            });

            if (type === "지급") {
                totalEarnAmount += amount;
            } else {
                totalDeductAmount += amount;
            }
        }
    });

    if (detailList.length === 0) {
        alert("금액을 입력하세요");
        return;
    }

    const netAmount = totalEarnAmount - totalDeductAmount;

    const payload = {
        empNo: selectedEmp.empNo,
        payMonth: month + "-01",
        totalEarnAmount: String(totalEarnAmount),
        totalDeductAmount: String(totalDeductAmount),
        netAmount: String(netAmount),
        detailList: detailList
    };

    const resp = await fetch("/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!resp.ok) {
        alert("등록 실패");
        return;
    }

    alert("등록 성공");
    location.href = "/hr/pay/list";
}