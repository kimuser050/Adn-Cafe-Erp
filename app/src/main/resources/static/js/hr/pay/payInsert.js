/* =========================================================
   급여등록 JS (초보자 이해용 버전)
   - 기능 유지
   - 구조 단순화
   ========================================================= */

// 전역 변수
let payItemList = [];   // 급여 항목 목록
let selectedEmp = null; // 선택된 직원

/* =========================================================
   1. 페이지 시작
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {

    // 1. 현재 년월 자동 세팅
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;

    document.querySelector("#pay-month").value = currentMonth;
    document.querySelector("#info-pay-month").innerText = currentMonth;

    // 2. 버튼 이벤트 연결
    document.querySelector("#search-emp-btn").addEventListener("click", searchEmp);
    document.querySelector("#auto-calc-btn").addEventListener("click", autoCalculate);
    document.querySelector("#save-btn").addEventListener("click", insertPay);

    document.querySelector("#cancel-btn").addEventListener("click", function () {
        location.href = "/hr/pay/list";
    });

    // 엔터로 검색
    document.querySelector("#keyword").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchEmp();
        }
    });

    // 3. 급여 항목 불러오기
    await loadPayItems();
});

/* =========================================================
   2. 급여 항목 불러오기
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

    for (let i = 0; i < payItemList.length; i++) {
    const item = payItemList[i];

    const taxText = item.isTaxable === "Y" ? "과세" : "비과세";

    const isFixed =
    item.itemName === "기본급" ||
    item.itemName === "보너스" ||
    item.itemName === "연장근무수당";

    str += `
        <tr data-code="${item.itemCode}" data-type="${item.itemType}" data-name="${item.itemName}">
            <td>${item.itemName}</td>
            <td>${item.itemType}</td>
            <td>${taxText}</td>
            <td><input type="text" class="amount" ${isFixed ? "readonly" : ""}></td>
            <td><input type="text" class="note"></td>
        </tr>
    `;
    }

    tbody.innerHTML = str;

    // 금액 입력 이벤트
    const inputs = document.querySelectorAll(".amount");

    inputs.forEach(function (input) {
        input.addEventListener("input", function () {

            // 숫자만 입력
            this.value = this.value.replace(/[^\d]/g, "");

            calculateSummary();
        });
    });
}

/* =========================================================
   3. 직원 검색
   ========================================================= */
async function searchEmp() {

    const keyword = document.querySelector("#keyword").value;

    if (keyword === "") {
        alert("검색어 입력하세요");
        return;
    }

    const resp = await fetch(`/pay/emps?keyword=${encodeURIComponent(keyword)}`);
    const list = await resp.json();

    const box = document.querySelector("#emp-search-result");

    let str = "";

    for (let i = 0; i < list.length; i++) {
        const emp = list[i];

        str += `
            <div onclick="selectEmp('${emp.empNo}')">
                ${emp.empName} / ${emp.empNo}
            </div>
        `;
    }

    box.innerHTML = str;
}

/* =========================================================
   4. 직원 선택
   ========================================================= */
async function selectEmp(empNo) {

    const resp = await fetch(`/pay/emps/${empNo}`);
    selectedEmp = await resp.json();

    document.querySelector("#emp-name").innerText = selectedEmp.empName;
    document.querySelector("#emp-no").innerText = selectedEmp.empNo;
    document.querySelector("#emp-dept").innerText = selectedEmp.deptName;
    document.querySelector("#emp-pos").innerText = selectedEmp.posName;
}

/* =========================================================
   5. 자동계산
   ========================================================= */
async function autoCalculate() {

    if (!selectedEmp) {
        alert("직원 먼저 선택");
        return;
    }

    const month = document.querySelector("#pay-month").value;

    if (!month) {
        alert("지급월을 먼저 선택하세요");
        return;
    }

    // 1. 기본급 / 보너스 계산
    const base = Number(selectedEmp.baseSalary || 0);
    const bonus = Math.round(base * Number(selectedEmp.bonusRate || 0));

    // 2. 근태에서 인정 연장근무시간 조회
    const resp = await fetch(`/pay/emps/${selectedEmp.empNo}/attendance-summary?month=${month}`);

    if (!resp.ok) {
        alert("근태 연장근무 조회 실패");
        return;
    }

    const attData = await resp.json();
    const otHours = Number(attData.otHours || 0);

    // 3. 연장근무수당 계산
    const overtimePay = 30000 * otHours;

    // 4. 항목 자동 입력
    const rows = document.querySelectorAll("#pay-item-body tr");

    rows.forEach(function (row) {
        const name = row.dataset.name;

       if (name === "기본급") {
    row.querySelector(".amount").value = base;
    row.querySelector(".note").value = "직급 기준 자동 반영";
}

if (name === "보너스") {
    row.querySelector(".amount").value = bonus;
    row.querySelector(".note").value = "직급 기준 자동 반영";
}

if (name === "연장근무수당") {
    row.querySelector(".amount").value = overtimePay;
    row.querySelector(".note").value = `${otHours}시간 반영 후 시간당 30000원 적용`;
}
    });

    calculateSummary();
}

/* =========================================================
   6. 합계 계산
   ========================================================= */
function calculateSummary() {

    const rows = document.querySelectorAll("#pay-item-body tr");

    let earn = 0;
    let deduct = 0;

    rows.forEach(function (row) {

        const type = row.dataset.type;
        const value = Number(row.querySelector(".amount").value || 0);

        if (type === "지급") {
            earn += value;
        } else {
            deduct += value;
        }
    });

    const net = earn - deduct;

    document.querySelector("#total-earn-amount").innerText = earn;
    document.querySelector("#total-deduct-amount").innerText = deduct;
    document.querySelector("#net-amount").innerText = net;
}

/* =========================================================
   7. 저장
   ========================================================= */
async function insertPay() {

    if (!selectedEmp) {
        alert("직원 선택하세요");
        return;
    }

    const month = document.querySelector("#pay-month").value;
    const rows = document.querySelectorAll("#pay-item-body tr");

    const detailList = [];

    let totalEarnAmount = 0;
    let totalDeductAmount = 0;

    rows.forEach(function (row) {

        const amount = Number(row.querySelector(".amount").value || 0);
        const type = row.dataset.type;

        if (amount > 0) {
            detailList.push({
                itemCode: row.dataset.code,
                amount: String(amount),
                payNote: row.querySelector(".note").value
            });

            if (type === "지급") {
                totalEarnAmount += amount;
            } else {
                totalDeductAmount += amount;
            }
        }
    });

    if (detailList.length === 0) {
        alert("금액 입력하세요");
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