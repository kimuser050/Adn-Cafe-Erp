/* =========================================================
   급여관리 JS - 목록 화면
   ========================================================= */

let payList = [];
let currentMonth = "";

/* =========================================================
   1. 시작
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        initDefaultMonth();
        bindEvents();
        await loadPayList();
    } catch (error) {
        console.log(error);
        alert("급여관리 페이지 로딩 실패 ...");
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
            await searchPay();
        });
    }

    if (keywordTag) {
        keywordTag.addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                await searchPay();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", async function () {
            await searchPay();
        });
    }

    if (searchTypeTag) {
        searchTypeTag.addEventListener("change", async function () {
            const keyword = document.querySelector("#keyword").value.trim();

            if (keyword === "") {
                await loadPayList();
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

function formatMoney(value) {
    if (value === null || value === undefined || value === "") {
        return "0";
    }
    return Number(value).toLocaleString("ko-KR");
}

function getConfirmInfo(confirmYn) {
    if (String(confirmYn) === "Y") {
        return {
            text: "확정",
            className: "confirmed"
        };
    }

    return {
        text: "미확정",
        className: "unconfirmed"
    };
}

/* =========================================================
   4. 목록 조회
   ========================================================= */
async function loadPayList() {
    const month = document.querySelector("#month")?.value || currentMonth;

    const resp = await fetch(`/pay?month=${encodeURIComponent(month)}`);
    if (!resp.ok) {
        throw new Error("급여 목록 조회 실패 ...");
    }

    const data = await resp.json();

    currentMonth = data.month ?? month;
    payList = data.voList ?? [];

    renderSummary(data.summary ?? {});
    renderTable(payList);
}

/* =========================================================
   5. 검색
   ========================================================= */
async function searchPay() {
    const month = document.querySelector("#month")?.value || currentMonth;
    const searchType = document.querySelector("#search-type")?.value ?? "all";
    const keyword = document.querySelector("#keyword")?.value.trim() ?? "";

    if (searchType === "all" || keyword === "") {
        await loadPayList();
        return;
    }

    let url = "";

    if (searchType === "name") {
        url = `/pay/search/name?month=${encodeURIComponent(month)}&keyword=${encodeURIComponent(keyword)}`;
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

        url = `/pay/search/confirmYn?month=${encodeURIComponent(month)}&confirmYn=${confirmYn}`;
    }

    const resp = await fetch(url);
    if (!resp.ok) {
        throw new Error("급여 검색 실패 ...");
    }

    const data = await resp.json();

    currentMonth = data.month ?? month;
    payList = data.voList ?? [];

    renderSummary(data.summary ?? {});
    renderTable(payList);
}

/* =========================================================
   6. 요약 렌더링
   ========================================================= */
function renderSummary(summary) {
    const totalCountTag = document.querySelector("#total-count");
    const totalNetAmountTag = document.querySelector("#total-net-amount");
    const unconfirmedCountTag = document.querySelector("#unconfirmed-count");
    const confirmedCountTag = document.querySelector("#confirmed-count");

    if (totalCountTag) {
        totalCountTag.innerText = summary.totalCount ?? 0;
    }

    if (totalNetAmountTag) {
        totalNetAmountTag.innerText = `₩ ${formatMoney(summary.totalNetAmount ?? 0)}`;
    }

    if (unconfirmedCountTag) {
        unconfirmedCountTag.innerText = summary.unconfirmedCount ?? 0;
    }

    if (confirmedCountTag) {
        confirmedCountTag.innerText = summary.confirmedCount ?? 0;
    }
}

/* =========================================================
   7. 테이블 렌더링
   ========================================================= */
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
                        ${nvl(vo.empName)}
                    </span>
                </td>
                <td>${nvl(vo.empNo)}</td>
                <td>${nvl(vo.posName)}</td>
                <td>${nvl(vo.deptName)}</td>
                <td>${nvl(vo.payMonth)}</td>
                <td>${formatMoney(vo.netAmount)}</td>
                <td>
                    <span class="confirm-badge ${confirmInfo.className}">
                        ${confirmInfo.text}
                    </span>
                </td>
            </tr>
        `;
    }

    tbodyTag.innerHTML = str;
}

/* =========================================================
   8. 화면 이동 / 다음단계 연결
   ========================================================= */
function goPayRegisterPage() {
    location.href = "/hr/pay/insert";
}

function openPayDetail(payNo) {
    // 다음 단계에서 상세조회 모달 연결 예정
    console.log("상세조회 payNo :", payNo);
    alert(`상세조회 연결 예정 - payNo: ${payNo}`);
}