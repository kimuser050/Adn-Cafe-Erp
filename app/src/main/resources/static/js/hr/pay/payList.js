/* =========================================================
   급여관리 JS - 목록 화면
   - 월별 목록 조회
   - 이름 / 상태 검색
   - 상세조회 모달
   - 확정 / 미확정 처리
   - 삭제 처리
   - 수정 모달 / 수정 저장
   ========================================================= */

/* =========================================================
   0. 전역 변수
   ========================================================= */
let payList = [];
let currentMonth = "";

let currentPayNo = null;        // 현재 보고 있는 급여번호
let currentConfirmYn = null;    // 현재 보고 있는 급여의 확정여부
let currentPayVo = null;        // 상세조회에서 받은 급여 전체 데이터

/* =========================================================
   1. 시작
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        initDefaultMonth();   // 현재 월 기본 세팅
        bindEvents();         // 검색 / 월 변경 이벤트 연결
        await loadPayList();  // 첫 화면 목록 조회
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
            const keyword = document.querySelector("#keyword")?.value.trim() ?? "";

            // 검색 타입이 바뀌었는데 검색어가 비어 있으면 전체목록 다시 조회
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

function parseNumber(value) {
    if (value === null || value === undefined || value === "") {
        return 0;
    }
    return Number(String(value).replaceAll(",", "")) || 0;
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

    // 요약카드는 백엔드 summary가 없어도 현재 목록 기준으로 직접 계산
    renderSummary(payList);
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

    // 검색 결과 기준으로 요약 다시 계산
    renderSummary(payList);
    renderTable(payList);
}

/* =========================================================
   6. 요약 렌더링
   - 현재 화면에 조회된 목록(payList) 기준으로 직접 계산
   - 삭제되지 않은 데이터만 백엔드에서 내려준다고 가정
   ========================================================= */
function renderSummary(list) {
    const totalCountTag = document.querySelector("#total-count");
    const totalNetAmountTag = document.querySelector("#total-net-amount");
    const unconfirmedCountTag = document.querySelector("#unconfirmed-count");
    const confirmedCountTag = document.querySelector("#confirmed-count");

    const safeList = Array.isArray(list) ? list : [];

    let totalCount = 0;
    let totalNetAmount = 0;
    let unconfirmedCount = 0;
    let confirmedCount = 0;

    for (let i = 0; i < safeList.length; i++) {
        const vo = safeList[i];

        totalCount += 1;
        totalNetAmount += parseNumber(vo.netAmount);

        if (String(vo.confirmYn) === "Y") {
            confirmedCount += 1;
        } else {
            unconfirmedCount += 1;
        }
    }

    if (totalCountTag) {
        totalCountTag.innerText = totalCount;
    }

    if (totalNetAmountTag) {
        totalNetAmountTag.innerText = `₩ ${formatMoney(totalNetAmount)}`;
    }

    if (unconfirmedCountTag) {
        unconfirmedCountTag.innerText = unconfirmedCount;
    }

    if (confirmedCountTag) {
        confirmedCountTag.innerText = confirmedCount;
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
   8. 화면 이동
   ========================================================= */
function goPayRegisterPage() {
    location.href = "/hr/pay/insert";
}

/* =========================================================
   9. 상세조회 모달 열기
   - 백엔드는 PayMasterVo 안에 detailList를 넣어서 반환 중
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

        const modalWrap = document.querySelector("#pay-modal-wrap");
        if (modalWrap) {
            modalWrap.style.display = "flex";
        }

    } catch (error) {
        console.log(error);
        alert("급여 상세조회 실패...");
    }
}

/* =========================================================
   10. 상세조회 모달 기본정보 출력
   ========================================================= */
function renderPayDetail(vo) {
    document.querySelector("#modal-pay-empName").innerText = nvl(vo.empName);
    document.querySelector("#modal-pay-dept").innerText = nvl(vo.deptName);
    document.querySelector("#modal-pay-empNo").innerText = nvl(vo.empNo);
    document.querySelector("#modal-pay-pos").innerText = nvl(vo.posName);
    document.querySelector("#modal-pay-payYearMonth").innerText = nvl(vo.payMonth);

    currentConfirmYn = vo.confirmYn;

    if (vo.confirmYn === "Y") {
        document.querySelector("#modal-pay-confirmYn").innerText = "확정";
    } else {
        document.querySelector("#modal-pay-confirmYn").innerText = "미확정";
    }

    document.querySelector("#modal-pay-totalEarnAmount").innerText = formatMoney(vo.totalEarnAmount);
    document.querySelector("#modal-pay-totalDeductAmount").innerText = formatMoney(vo.totalDeductAmount);
    document.querySelector("#modal-pay-netAmount").innerText = formatMoney(vo.netAmount);

    // 확정/미확정 버튼 문구
    const toggleBtn = document.querySelector("#toggle-confirm-btn");
    if (toggleBtn) {
        toggleBtn.innerText = (vo.confirmYn === "Y") ? "확정취소" : "급여확정";
    }

    // 수정 / 삭제 버튼은 비활성화하지 않고 "막힌 느낌"만 줌
    // 그래야 눌렀을 때 안내 알람을 띄울 수 있음
    applyLockedButtonStyle(vo.confirmYn);
}

/* =========================================================
   10-1. 확정 상태일 때 수정/삭제 버튼 잠김 스타일 처리
   ========================================================= */
function applyLockedButtonStyle(confirmYn) {
    const editBtn = document.querySelector("#open-edit-btn");
    const deleteBtn = document.querySelector("#delete-pay-btn");

    const isConfirmed = String(confirmYn) === "Y";

    if (editBtn) {
        editBtn.disabled = false; // 클릭은 가능해야 알람 띄울 수 있음
        editBtn.classList.toggle("btn-locked", isConfirmed);
        editBtn.title = isConfirmed ? "확정상태에서는 변경이 불가합니다." : "";
    }

    if (deleteBtn) {
        deleteBtn.disabled = false; // 클릭은 가능해야 알람 띄울 수 있음
        deleteBtn.classList.toggle("btn-locked", isConfirmed);
        deleteBtn.title = isConfirmed ? "확정상태에서는 변경이 불가합니다." : "";
    }
}

/* =========================================================
   11. 상세조회 모달 상세항목 리스트 출력
   ========================================================= */
function renderPayDetailItemList(detailList) {
    const tbody = document.querySelector("#modal-payDetail-list");
    if (!tbody) return;

    if (!detailList || detailList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">상세 항목이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < detailList.length; i++) {
        const item = detailList[i];
        const taxText = item.isTaxable === "Y" ? "과세" : "비과세";

        str += `
            <tr>
                <td>${nvl(item.itemName)}</td>
                <td>${nvl(item.itemType)}</td>
                <td>${taxText}</td>
                <td>${formatMoney(item.amount)}</td>
                <td>${nvl(item.payNote)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

/* =========================================================
   12. 확정 / 미확정 변경
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
        if (!ok) {
            return;
        }

        const resp = await fetch(url, {
            method: "PUT"
        });

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

/* =========================================================
   13. 급여 삭제 (논리삭제)
   - 확정 상태에서는 프론트에서도 먼저 막고 안내문 출력
   ========================================================= */
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
        if (!ok) {
            return;
        }

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
   14. 상세조회 모달 닫기
   ========================================================= */
function closePayModal() {
    const modalWrap = document.querySelector("#pay-modal-wrap");
    if (modalWrap) {
        modalWrap.style.display = "none";
    }
}

/* =========================================================
   15. 수정 모달 열기
   - 확정 상태에서는 프론트에서도 먼저 막고 안내문 출력
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

    const payNoTag = document.querySelector("#edit-pay-no");
    if (payNoTag) {
        payNoTag.value = currentPayVo.payNo;
    }

    renderPayEditItemList(currentPayVo.detailList);

    const editModalWrap = document.querySelector("#pay-edit-modal-wrap");
    if (editModalWrap) {
        editModalWrap.style.display = "flex";
    }
}

/* =========================================================
   16. 수정 모달 취소
   - 수정 모달 닫고 다시 상세조회 모달로 복귀
   ========================================================= */
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

/* =========================================================
   17. 수정 모달 상세항목 리스트 출력
   - 기본급 / 보너스는 직급 기준 고정값이라 수정 불가
   ========================================================= */
function renderPayEditItemList(detailList) {
    const tbody = document.querySelector("#payList-edit-body");
    if (!tbody) return;

    if (!detailList || detailList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">상세 항목이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < detailList.length; i++) {
        const item = detailList[i];
        const taxText = item.isTaxable === "Y" ? "과세" : "비과세";

        const isFixedItem = item.itemName === "기본급" || item.itemName === "보너스";

        const amountReadonly = isFixedItem ? "readonly" : "";
        const amountClass = isFixedItem
            ? "edit-amount-input fixed-input"
            : "edit-amount-input";

        const noteReadonly = isFixedItem ? "readonly" : "";
        const noteClass = isFixedItem
            ? "edit-note-input fixed-input"
            : "edit-note-input";

        const noteValue = isFixedItem
            ? "직급기준"
            : (item.payNote ? item.payNote : "");

        str += `
            <tr data-item-code="${item.itemCode}" data-item-type="${item.itemType}" data-fixed="${isFixedItem ? "Y" : "N"}">
                <td>${nvl(item.itemName)}</td>
                <td>${nvl(item.itemType)}</td>
                <td>${taxText}</td>
                <td>
                    <input
                        type="text"
                        class="${amountClass}"
                        value="${nvl(item.amount)}"
                        ${amountReadonly}
                    >
                </td>
                <td>
                    <input
                        type="text"
                        class="${noteClass}"
                        value="${noteValue}"
                        ${noteReadonly}
                    >
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

/* =========================================================
   18. 급여 수정 저장
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

        for (let i = 0; i < rowList.length; i++) {
            const row = rowList[i];

            const itemCode = row.dataset.itemCode;
            const itemType = row.dataset.itemType;

            const amountInput = row.querySelector(".edit-amount-input");
            const noteInput = row.querySelector(".edit-note-input");

            const amount = parseNumber(amountInput.value);
            const payNote = noteInput.value.trim();

            if (amount > 0) {
                detailList.push({
                    itemCode: itemCode,
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