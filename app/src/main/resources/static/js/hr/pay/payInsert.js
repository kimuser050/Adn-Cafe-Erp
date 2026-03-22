/* =========================================================
   급여등록 JS
   - 클릭 선택 UX 강화
   - 금액 포맷팅 / 요약 갱신 강화
   - 자동계산 시 강조 효과 추가
   ========================================================= */

// 전역 변수
let payItemList = [];
let selectedEmp = null;

/* =========================================================
   1. 시작
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    initCurrentMonth();
    bindEvents();
    await loadPayItems();
});

/* =========================================================
   2. 초기 세팅
   ========================================================= */
function initCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;

    document.querySelector("#pay-month").value = currentMonth;
    document.querySelector("#info-pay-month").innerText = currentMonth;
    document.querySelector("#top-selected-month").innerText = `지급월 ${currentMonth}`;
}

function bindEvents() {
    document.querySelector("#search-emp-btn").addEventListener("click", searchEmp);
    document.querySelector("#auto-calc-btn").addEventListener("click", autoCalculate);
    document.querySelector("#save-btn").addEventListener("click", insertPay);

    document.querySelector("#cancel-btn").addEventListener("click", function () {
        location.href = "/hr/pay/list";
    });

    document.querySelector("#keyword").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchEmp();
        }
    });

    document.querySelector("#pay-month").addEventListener("change", function () {
        const month = this.value || "-";
        document.querySelector("#info-pay-month").innerText = month;
        document.querySelector("#top-selected-month").innerText = `지급월 ${month}`;
    });
}

/* =========================================================
   3. 공통 함수
   ========================================================= */
function formatNumber(value) {
    return Number(value || 0).toLocaleString("ko-KR");
}

function formatWon(value) {
    return `₩ ${formatNumber(value)}`;
}

function flashSummary() {
    const box = document.querySelector("#summary-box");
    box.classList.remove("summary-flash");
    void box.offsetWidth;
    box.classList.add("summary-flash");
}

function clearEmpInfo() {
    document.querySelector("#emp-name").innerText = "-";
    document.querySelector("#emp-no").innerText = "-";
    document.querySelector("#emp-dept").innerText = "-";
    document.querySelector("#emp-pos").innerText = "-";
    document.querySelector("#top-selected-emp").innerText = "선택 직원 없음";
}

function setEmpInfo(emp) {
    document.querySelector("#emp-name").innerText = emp.empName || "-";
    document.querySelector("#emp-no").innerText = emp.empNo || "-";
    document.querySelector("#emp-dept").innerText = emp.deptName || "-";
    document.querySelector("#emp-pos").innerText = emp.posName || "-";
    document.querySelector("#top-selected-emp").innerText = `${emp.empName} (${emp.empNo})`;
}

/* =========================================================
   4. 급여 항목 불러오기
   ========================================================= */
async function loadPayItems() {
    const resp = await fetch("/pay/items");

    if (!resp.ok) {
        alert("급여 항목 조회 실패");
        return;
    }

    payItemList = await resp.json();

    const tbody = document.querySelector("#pay-item-body");
    let str = "";

    for (const item of payItemList) {
        const taxText = item.isTaxable === "Y"
            ? `<span class="tax-badge taxable">과세</span>`
            : `<span class="tax-badge nontaxable">비과세</span>`;

        const isFixed =
            item.itemName === "기본급" ||
            item.itemName === "보너스" ||
            item.itemName === "연장근무수당";

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

    const amountInputs = document.querySelectorAll(".amount");
    amountInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/[^\d]/g, "");
            calculateSummary();
        });
    });
}

/* =========================================================
   5. 직원 검색
   ========================================================= */
async function searchEmp() {
    const keyword = document.querySelector("#keyword").value.trim();
    const box = document.querySelector("#emp-search-result");

    if (keyword === "") {
        alert("검색어를 입력하세요");
        return;
    }

    box.innerHTML = `
        <div class="emp-empty">
            직원을 검색 중입니다...
        </div>
    `;

    const resp = await fetch(`/pay/emps?keyword=${encodeURIComponent(keyword)}`);

    if (!resp.ok) {
        box.innerHTML = `
            <div class="emp-empty">
                직원 검색에 실패했습니다.
            </div>
        `;
        alert("직원 검색 실패");
        return;
    }

    const list = await resp.json();

    if (!list || list.length === 0) {
        box.innerHTML = `
            <div class="emp-empty">
                검색 결과가 없습니다.
            </div>
        `;
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

    box.innerHTML = str;
}

/* =========================================================
   6. 직원 선택
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
   7. 자동계산
   ========================================================= */
async function autoCalculate() {
    if (!selectedEmp) {
        alert("직원을 먼저 선택하세요");
        return;
    }

    const month = document.querySelector("#pay-month").value;
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
   8. 합계 계산
   ========================================================= */
function calculateSummary() {
    const rows = document.querySelectorAll("#pay-item-body tr");

    let earn = 0;
    let deduct = 0;

    rows.forEach(function (row) {
        const type = row.dataset.type;
        const amountInput = row.querySelector(".amount");
        if (!amountInput) {
            return;
        }

        const value = Number(amountInput.value || 0);

        if (type === "지급") {
            earn += value;
        } else {
            deduct += value;
        }
    });

    const net = earn - deduct;

    document.querySelector("#total-earn-amount").innerText = formatWon(earn);
    document.querySelector("#total-deduct-amount").innerText = formatWon(deduct);
    document.querySelector("#net-amount").innerText = formatWon(net);

    flashSummary();
}

/* =========================================================
   9. 저장
   ========================================================= */
async function insertPay() {
    if (!selectedEmp) {
        alert("직원을 선택하세요");
        return;
    }

    const month = document.querySelector("#pay-month").value;
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

        if (!amountInput || !noteInput) {
            return;
        }

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