/* =========================================================
   직원관리 JS
   - 목록
   - 상세조회 모달
   - 수정 모달
========================================================= */

let empList = [];
let currentEmp = null;
let currentEmpHistoryList = [];
let posList = [];
let deptList = [];
let statusList = [];

/* =========================================================
   1. 시작
========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        await loadEmpList();
        await loadCodeData();

        const keywordTag = document.querySelector("#keyword");
        if (keywordTag) {
            keywordTag.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    searchEmp();
                }
            });
        }
    } catch (error) {
        console.log(error);
        alert("직원 페이지 로딩 실패 ...");
    }
});

/* =========================================================
   2. 공통 함수
========================================================= */
function formatDate(value) {
    if (!value) return "-";
    return String(value).length >= 10 ? String(value).substring(0, 10) : value;
}

function nvl(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return value;
}

function formatNumber(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return Number(value).toLocaleString();
}

function getEmpStatusInfo(vo) {
    if (vo.statusName) {
        const text = vo.statusName;

        if (text === "정상근무") return { text: "재직", statusClass: "working" };
        if (text === "출장") return { text: "출장", statusClass: "trip" };
        if (text === "교육") return { text: "교육", statusClass: "training" };
        if (text === "휴직") return { text: "휴직", statusClass: "leave" };
        if (text === "외근") return { text: "외근", statusClass: "outside" };
        if (text === "재택근무") return { text: "재택근무", statusClass: "remote" };
    }

    const status = String(vo.empStatusNo);

    if (status === "1") return { text: "재직", statusClass: "working" };
    if (status === "2") return { text: "출장", statusClass: "trip" };
    if (status === "3") return { text: "교육", statusClass: "training" };
    if (status === "4") return { text: "휴직", statusClass: "leave" };
    if (status === "5") return { text: "외근", statusClass: "outside" };
    if (status === "6") return { text: "재택근무", statusClass: "remote" };

    return { text: "미정", statusClass: "unknown" };
}

function getOrgName(vo) {
    if (vo.orgName) return vo.orgName;
    if (vo.storeName) return vo.storeName;
    return vo.deptName ?? "-";
}

/* =========================================================
   3. 코드 데이터 조회
========================================================= */
async function loadCodeData() {
    const [posResp, deptResp, statusResp] = await Promise.all([
        fetch("/pos"),
        fetch("/dept"),
        fetch("/emp/status")
    ]);

    if (!posResp.ok) throw new Error("직급 목록 조회 실패");
    if (!deptResp.ok) throw new Error("부서 목록 조회 실패");
    if (!statusResp.ok) throw new Error("상태 목록 조회 실패");

    const posData = await posResp.json();
    const deptData = await deptResp.json();
    const statusData = await statusResp.json();

    posList = posData.voList ?? [];
    deptList = deptData.voList ?? [];
    statusList = statusData.statusList ?? [];
}

/* =========================================================
   4. 직원 목록 조회
========================================================= */
async function loadEmpList() {
    const resp = await fetch("/emp");

    if (!resp.ok) {
        throw new Error("직원 목록 조회 실패 ...");
    }

    const data = await resp.json();
    empList = data.voList ?? [];

    renderSummary(empList);
    renderTable(empList);
}

function renderSummary(voList) {
    let workingCount = 0;
    let leaveCount = 0;
    let businessTripCount = 0;
    let trainingCount = 0;

    for (const vo of voList) {
        const status = String(vo.empStatusNo);

        if (status === "1") workingCount++;
        else if (status === "2") businessTripCount++;
        else if (status === "3") trainingCount++;
        else if (status === "4") leaveCount++;
    }

    const workingTag = document.querySelector("#working-count");
    const leaveTag = document.querySelector("#leave-count");
    const businessTripTag = document.querySelector("#business-trip-count");
    const trainingTag = document.querySelector("#training-count");

    if (workingTag) workingTag.innerText = workingCount;
    if (leaveTag) leaveTag.innerText = leaveCount;
    if (businessTripTag) businessTripTag.innerText = businessTripCount;
    if (trainingTag) trainingTag.innerText = trainingCount;
}

function renderTable(voList) {
    const tbody = document.querySelector("#emp-list");
    if (!tbody) return;

    if (!voList || voList.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">조회된 직원이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < voList.length; i++) {
        const vo = voList[i];
        const statusInfo = getEmpStatusInfo(vo);

        str += `
            <tr>
                <td>${i + 1}</td>
                <td class="emp-name-cell">
                    <span class="link-text" onclick="openEmpModal('${vo.empNo}')">
                        ${nvl(vo.empName)}
                    </span>
                </td>
                <td>${nvl(vo.empNo)}</td>
                <td>${nvl(vo.posName)}</td>
                <td>${nvl(getOrgName(vo))}</td>
                <td>${nvl(vo.empPhone)}</td>
                <td>
                    <span class="status ${statusInfo.statusClass}">${statusInfo.text}</span>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

/* =========================================================
   5. 검색
========================================================= */
function searchEmp() {
    const searchType = document.querySelector("#search-type").value;
    const keyword = document.querySelector("#keyword").value.trim().toLowerCase();

    if (searchType === "all" || keyword === "") {
        renderTable(empList);
        return;
    }

    const filteredList = empList.filter(vo => {
        const empName = String(vo.empName ?? "").toLowerCase();
        const posName = String(vo.posName ?? "").toLowerCase();
        const statusText = getEmpStatusInfo(vo).text.toLowerCase();

        if (searchType === "empName") return empName.includes(keyword);
        if (searchType === "posName") return posName.includes(keyword);
        if (searchType === "status") return statusText.includes(keyword);

        return true;
    });

    renderTable(filteredList);
}

/* =========================================================
   6. 상세조회 모달
========================================================= */
async function openEmpModal(empNo) {
    try {
        const resp = await fetch(`/emp/${empNo}`);
        if (!resp.ok) {
            throw new Error("직원 상세조회 실패 ...");
        }

        const data = await resp.json();
        const vo = data.vo;
        const empHistoryList = data.empHistoryList ?? [];

        if (!vo) {
            throw new Error("직원 상세정보 없음");
        }

        currentEmp = vo;
        currentEmpHistoryList = empHistoryList;

        renderEmpDetail(vo);
        renderEmpHistory(empHistoryList);

        const modalWrap = document.querySelector("#emp-modal-wrap");
        if (modalWrap) {
            modalWrap.style.display = "flex";
        }
    } catch (error) {
        console.log(error);
        alert("직원 상세조회 실패 ...");
    }
}

function renderEmpDetail(vo) {
    const setText = (selector, value) => {
        const tag = document.querySelector(selector);
        if (tag) tag.innerText = value;
    };

    setText("#modal-emp-name", nvl(vo.empName));
    setText("#modal-emp-no", nvl(vo.empNo));
    setText("#modal-pos-name", nvl(vo.posName));
    setText("#modal-org-name", nvl(getOrgName(vo)));
    setText("#modal-emp-phone", nvl(vo.empPhone));
    setText("#modal-emp-email", nvl(vo.empEmail));
    setText("#modal-emp-address", nvl(vo.empAddress));
    setText("#modal-hire-date", formatDate(vo.hireDate));
    setText("#modal-resign-date", formatDate(vo.resignDate));

    const statusInfo = getEmpStatusInfo(vo);
    setText("#modal-emp-status", statusInfo.text);
    setText("#modal-base-salary", formatNumber(vo.baseSalary));
    setText("#modal-bonus-rate", nvl(vo.bonusRate));
    setText("#modal-expected-salary", formatNumber(vo.expectedSalary));

    const profileImgTag = document.querySelector("#modal-profile-img");
    if (profileImgTag) {
        if (vo.profileChangeName) {
            profileImgTag.src = `/upload/profile/${vo.profileChangeName}`;
        } else {
            profileImgTag.src = "/img/common/default-profile.png";
        }
    }
}

function renderEmpHistory(historyList) {
    const tbody = document.querySelector("#emp-history-list");
    if (!tbody) return;

    if (!historyList || historyList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3">인사이력이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (const vo of historyList) {
        str += `
            <tr>
                <td>${formatDate(vo.hisDate)}</td>
                <td>${nvl(vo.hisEvent)}</td>
                <td>${nvl(vo.hisContent)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function closeEmpModal() {
    const modalWrap = document.querySelector("#emp-modal-wrap");
    if (modalWrap) {
        modalWrap.style.display = "none";
    }
}

/* =========================================================
   7. 수정 모달 열기/닫기
========================================================= */
function openEditModal() {
    if (!currentEmp) {
        alert("직원 정보가 없습니다.");
        return;
    }

    closeEmpModal();
    fillEditModal();

    const editModalWrap = document.querySelector("#emp-edit-modal-wrap");
    if (editModalWrap) {
        editModalWrap.style.display = "flex";
    }
}

function closeEditModal() {
    const editModalWrap = document.querySelector("#emp-edit-modal-wrap");
    if (editModalWrap) {
        editModalWrap.style.display = "none";
    }
}

function fillEditModal() {
    const vo = currentEmp;
    const historyList = currentEmpHistoryList ?? [];

    document.querySelector("#edit-emp-no").value = vo.empNo;
    document.querySelector("#edit-emp-no-view").value = vo.empNo;
    document.querySelector("#edit-emp-name").value = nvl(vo.empName);
    document.querySelector("#edit-hire-date").value = formatDate(vo.hireDate);

    renderEditSelectOptions();

    document.querySelector("#edit-pos-code").value = vo.posCode ?? "";
    document.querySelector("#edit-dept-code").value = vo.deptCode ?? "";
    document.querySelector("#edit-emp-status-no").value = vo.empStatusNo ?? "";

    renderHistoryEditRows(historyList);
}

function renderEditSelectOptions() {
    const posTag = document.querySelector("#edit-pos-code");
    const deptTag = document.querySelector("#edit-dept-code");
    const statusTag = document.querySelector("#edit-emp-status-no");
    
    if (posTag) {
        let posStr = "";
        for (const vo of posList) {
            posStr += `<option value="${vo.posCode}">${vo.posName}</option>`;
        }
        posTag.innerHTML = posStr;
    }

    if (deptTag) {
        let deptStr = "";
        for (const vo of deptList) {
            deptStr += `<option value="${vo.deptCode}">${vo.deptName}</option>`;
        }
        deptTag.innerHTML = deptStr;
    }

    if (statusTag) {
        let statusStr = "";
        for (const vo of statusList) {
            statusStr += `<option value="${vo.empStatusNo}">${vo.statusName}</option>`;
        }
        statusTag.innerHTML = statusStr;
    }
}

/* =========================================================
   8. 인사이력 수정/추가
========================================================= */
function renderHistoryEditRows(historyList) {
    const tbody = document.querySelector("#history-edit-body");
    if (!tbody) return;

    if (!historyList || historyList.length === 0) {
        tbody.innerHTML = "";
        return;
    }

    let str = "";

    for (const vo of historyList) {
        str += `
            <tr class="history-row" data-his-no="${vo.hisNo}">
                <td>
                    <input type="date" class="his-date" value="${formatDate(vo.hisDate)}">
                </td>
                <td>
                    <select class="his-event">
                        <option value="신규입사" ${vo.hisEvent === "신규입사" ? "selected" : ""}>신규입사</option>
                        <option value="퇴직" ${vo.hisEvent === "퇴직" ? "selected" : ""}>퇴직</option>
                        <option value="부서배치" ${vo.hisEvent === "부서배치" ? "selected" : ""}>부서배치</option>
                        <option value="매장배정" ${vo.hisEvent === "매장배정" ? "selected" : ""}>매장배정</option>
                        <option value="직급변경 ${vo.hisEvent === "직급변경" ? "selected" : ""}>직급변경</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="his-content" value="${vo.hisContent ?? ""}" placeholder="설명 입력">
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function addHistoryRow() {
    const tbody = document.querySelector("#history-edit-body");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.className = "history-row";
    tr.dataset.hisNo = "";

    tr.innerHTML = `
        <td>
            <input type="date" class="his-date">
        </td>
        <td>
            <select class="his-event">
                <option value="신규입사">신규입사</option>
                <option value="부서배치">부서배치</option>
                <option value="직급부여">직급부여</option>
                <option value="부서이동">부서이동</option>
                <option value="직급승진">직급승진</option>
                <option value="수습배치">수습배치</option>
                <option value="매장배정">매장배정</option>
            </select>
        </td>
        <td>
            <input type="text" class="his-content" placeholder="설명 입력">
        </td>
    `;

    tbody.appendChild(tr);
}

/* =========================================================
   9. 저장
========================================================= */
async function saveEmpEdit() {
    try {
        const empNo = document.querySelector("#edit-emp-no").value;
        const posCode = document.querySelector("#edit-pos-code").value;
        const deptCode = document.querySelector("#edit-dept-code").value;
        const empStatusNo = document.querySelector("#edit-emp-status-no").value;

        // 1. 직원 기본정보 수정
        const resp = await fetch(`/emp/${empNo}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                posCode,
                deptCode,
                empStatusNo
            })
        });

        if (!resp.ok) {
            throw new Error("직원 기본정보 수정 실패");
        }

        const data = await resp.json();
        if (data.result != 1) {
            throw new Error("직원 기본정보 수정 실패");
        }

        // 2. 인사이력 수정 / 추가
        const rows = document.querySelectorAll(".history-row");

        for (const row of rows) {
            const hisNo = row.dataset.hisNo;
            const hisDate = row.querySelector(".his-date").value;
            const hisEvent = row.querySelector(".his-event").value;
            const hisContent = row.querySelector(".his-content").value;

            if (!hisDate || !hisEvent) {
                continue;
            }

            if (hisNo) {
                const editResp = await fetch(`/emp/history/${hisNo}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        hisDate,
                        hisEvent,
                        hisContent
                    })
                });

                if (!editResp.ok) {
                    throw new Error("인사이력 수정 실패");
                }

                const editData = await editResp.json();
                if (editData.result != 1) {
                    throw new Error("인사이력 수정 실패");
                }

            } else {
                const insertResp = await fetch(`/emp/${empNo}/history`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        hisDate,
                        hisEvent,
                        hisContent
                    })
                });

                if (!insertResp.ok) {
                    throw new Error("인사이력 추가 실패");
                }

                const insertData = await insertResp.json();
                if (insertData.result != 1) {
                    throw new Error("인사이력 추가 실패");
                }
            }
        }

        alert("직원 정보 수정 완료 !");
        closeEditModal();
        await loadEmpList();
        await openEmpModal(empNo);

    } catch (error) {
        console.log(error);
        alert("직원 수정 실패 ...");
    }
}