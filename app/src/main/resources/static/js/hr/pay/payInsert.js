/* =========================================================
   급여등록 JS
   ========================================================= */

let payItemList = [];
let selectedEmp = null;

window.addEventListener("DOMContentLoaded", async function () {
    try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        document.querySelector("#pay-month").value = `${year}-${month}`;
        document.querySelector("#info-pay-month").innerText = `${year}-${month}`;

        document.querySelector("#search-emp-btn").addEventListener("click", searchEmp);
        document.querySelector("#auto-calc-btn").addEventListener("click", autoCalculate);
        document.querySelector("#save-btn").addEventListener("click", insertPay);
        document.querySelector("#cancel-btn").addEventListener("click", function () {
            history.back();
        });

        document.querySelector("#keyword").addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                await searchEmp();
            }
        });

        document.querySelector("#pay-month").addEventListener("change", function () {
            document.querySelector("#info-pay-month").innerText = this.value || "-";
        });

        await loadPayItems();

    } catch (error) {
        console.log(error);
        alert("급여등록 페이지 로딩 실패 ...");
    }
});

/* =========================================================
   공통 함수
   ========================================================= */

function nvl(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return value;
}

function parseNumber(value) {
    if (!value) return 0;
    return Number(String(value).replaceAll(",", "")) || 0;
}

function formatMoney(value) {
    return Number(value || 0).toLocaleString("ko-KR");
}

/* =========================================================
   1. 급여 항목 목록 불러오기
   ========================================================= */
async function loadPayItems() {
    const resp = await fetch("/pay/items");
    if (!resp.ok) {
        throw new Error("급여 항목 조회 실패 ...");
    }

    payItemList = await resp.json();

    const tbody = document.querySelector("#pay-item-body");

    if (payItemList.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">등록된 급여 항목이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < payItemList.length; i++) {
        const item = payItemList[i];

        let itemTypeText = item.itemType;
        if (item.itemType === "지급") {
            itemTypeText = "수당";
        }

        let taxText = "비과세";
        let taxClass = "nontaxable";
        if (item.isTaxable === "Y") {
            taxText = "과세";
            taxClass = "taxable";
        }

        str += `
            <tr data-item-code="${item.itemCode}" data-item-type="${item.itemType}" data-item-name="${item.itemName}">
                <td class="pay-item-name">${item.itemName}</td>
                <td class="pay-item-type">${itemTypeText}</td>
                <td>
                    <span class="tax-badge ${taxClass}">${taxText}</span>
                </td>
                <td>
                    <input type="text" class="amount-input" placeholder="0">
                </td>
                <td>
                    <input type="text" class="note-input" placeholder="비고 입력">
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;

    const amountInputs = document.querySelectorAll(".amount-input");
    amountInputs.forEach(input => {
        input.addEventListener("input", function () {
            this.value = this.value.replaceAll(",", "").replace(/[^\d]/g, "");
            calculateSummary();
        });

        input.addEventListener("blur", function () {
            const num = parseNumber(this.value);
            if (num > 0) {
                this.value = formatMoney(num);
            } else {
                this.value = "";
            }
            calculateSummary();
        });
    });

    calculateSummary();
}

/* =========================================================
   2. 직원 검색
   ========================================================= */
async function searchEmp() {
    const keyword = document.querySelector("#keyword").value.trim();
    const resultBox = document.querySelector("#emp-search-result");

    if (keyword === "") {
        alert("사번 또는 이름을 입력해주세요.");
        return;
    }

    const resp = await fetch(`/pay/emps?keyword=${encodeURIComponent(keyword)}`);
    if (!resp.ok) {
        throw new Error("직원 검색 실패 ...");
    }

    const list = await resp.json();

    if (list.length === 0) {
        resultBox.innerHTML = "검색 결과가 없습니다.";
        return;
    }

    let str = "";

    for (let i = 0; i < list.length; i++) {
        const emp = list[i];

        str += `
            <div class="emp-result-item" onclick="selectEmp('${emp.empNo}')">
                <span class="emp-result-name">${nvl(emp.empName)}</span>
                <span class="emp-result-no">${nvl(emp.empNo)}</span>
                <span class="emp-result-dept">${nvl(emp.deptName)}</span>
                <span class="emp-result-pos">${nvl(emp.posName)}</span>
                <button type="button" class="btn btn-sm btn-mid emp-result-select">선택</button>
            </div>
        `;
    }

    resultBox.innerHTML = str;
}

/* =========================================================
   3. 직원 선택
   ========================================================= */
async function selectEmp(empNo) {
    const resp = await fetch(`/pay/emps/${empNo}`);
    if (!resp.ok) {
        throw new Error("직원 상세 조회 실패 ...");
    }

    selectedEmp = await resp.json();

    document.querySelector("#emp-name").innerText = nvl(selectedEmp.empName);
    document.querySelector("#emp-no").innerText = nvl(selectedEmp.empNo);
    document.querySelector("#emp-dept").innerText = nvl(selectedEmp.deptName);
    document.querySelector("#emp-pos").innerText = nvl(selectedEmp.posName);
    document.querySelector("#info-pay-month").innerText =
        document.querySelector("#pay-month").value || "-";
}

/* =========================================================
   4. 자동계산
   - 기본급
   - 보너스
   ========================================================= */
function autoCalculate() {
    if (selectedEmp === null) {
        alert("먼저 직원을 선택해주세요.");
        return;
    }

    const baseSalary = parseNumber(selectedEmp.baseSalary);
    const bonusRate = Number(selectedEmp.bonusRate || 0);
    const bonusAmount = Math.round(baseSalary * bonusRate);

    const rows = document.querySelectorAll("#pay-item-body tr");

    rows.forEach(row => {
        const itemName = row.dataset.itemName;
        const amountInput = row.querySelector(".amount-input");
        const noteInput = row.querySelector(".note-input");

        if (itemName === "기본급") {
            amountInput.value = formatMoney(baseSalary);
            noteInput.value = "직급기준";
        }

        if (itemName === "보너스") {
            amountInput.value = formatMoney(bonusAmount);
            noteInput.value = "직급기준";
        }
    });

    calculateSummary();
    alert("기본급 / 보너스 자동계산 완료");
}

/* =========================================================
   5. 합계 계산
   ========================================================= */
function calculateSummary() {
    const rows = document.querySelectorAll("#pay-item-body tr");

    let totalEarn = 0;
    let totalDeduct = 0;

    rows.forEach(row => {
        const itemType = row.dataset.itemType;
        const amount = parseNumber(row.querySelector(".amount-input").value);

        if (itemType === "지급") {
            totalEarn += amount;
        } else if (itemType === "공제") {
            totalDeduct += amount;
        }
    });

    const netAmount = totalEarn - totalDeduct;

    document.querySelector("#total-earn-amount").innerText = `₩ ${formatMoney(totalEarn)}`;
    document.querySelector("#total-deduct-amount").innerText = `₩ ${formatMoney(totalDeduct)}`;
    document.querySelector("#net-amount").innerText = `₩ ${formatMoney(netAmount)}`;
}

/* =========================================================
   6. 저장
   ========================================================= */
async function insertPay() {
    if (selectedEmp === null) {
        alert("직원을 먼저 선택해주세요.");
        return;
    }

    const month = document.querySelector("#pay-month").value;
    if (month === "") {
        alert("지급월을 선택해주세요.");
        return;
    }

    const rows = document.querySelectorAll("#pay-item-body tr");
    const detailList = [];

    rows.forEach(row => {
        const itemCode = row.dataset.itemCode;
        const amount = parseNumber(row.querySelector(".amount-input").value);
        const payNote = row.querySelector(".note-input").value.trim();

        if (amount > 0) {
            detailList.push({
                itemCode: itemCode,
                amount: String(amount),
                payNote: payNote
            });
        }
    });

    if (detailList.length === 0) {
        alert("급여 항목 금액을 1개 이상 입력해주세요.");
        return;
    }

    const totalEarnAmount = parseNumber(document.querySelector("#total-earn-amount").innerText.replace("₩", ""));
    const totalDeductAmount = parseNumber(document.querySelector("#total-deduct-amount").innerText.replace("₩", ""));
    const netAmount = parseNumber(document.querySelector("#net-amount").innerText.replace("₩", ""));

    const payload = {
        empNo: String(selectedEmp.empNo),
        payMonth: month + "-01",
        totalEarnAmount: String(totalEarnAmount),
        totalDeductAmount: String(totalDeductAmount),
        netAmount: String(netAmount),
        detailList: detailList
    };

    const resp = await fetch("/pay", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await resp.json();

    if (!resp.ok) {
        alert(data.errorMsg || "급여 등록 실패 ...");
        return;
    }

    alert(data.msg || "급여 등록 성공");
    location.href = "/hr/pay/list";
}