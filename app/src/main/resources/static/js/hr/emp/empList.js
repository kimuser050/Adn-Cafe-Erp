/* =========================================================
   직원관리 JS
   - 요약 카드
   - 전체 목록 조회
   - 프론트 검색
   - 상세조회 모달
   ========================================================= */

/* =========================================================
   0. 전역 변수
   ========================================================= */
let empList = [];
let currentEmp = null;

/* =========================================================
   1. 페이지 진입 시 실행
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        await loadEmpList();
    } catch (error) {
        console.log(error);
        alert("직원 페이지 로딩 실패 ...");
    }
});

/* =========================================================
   2. 공통 함수
   ========================================================= */

// 날짜를 YYYY-MM-DD 형태로 잘라서 보여주는 함수
function formatDate(value) {
    if (!value) {
        return "-";
    }

    return String(value).length >= 10 ? String(value).substring(0, 10) : value;
}

// null, undefined, 빈값 방어
function nvl(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }
    return value;
}

// 상태번호 -> 화면용 상태 변환
function getEmpStatusInfo(empStatusNo) {
    const status = String(empStatusNo);

    if (status === "1") {
        return { text: "재직", statusClass: "working" };
    }
    if (status === "2") {
        return { text: "퇴직", statusClass: "retired" };
    }
    if (status === "3") {
        return { text: "휴직", statusClass: "leave" };
    }
    if (status === "4") {
        return { text: "출장", statusClass: "trip" };
    }
    if (status === "5") {
        return { text: "교육", statusClass: "training" };
    }

    return { text: "미정", statusClass: "unknown" };
}

// 소속명 만들기
function getOrgName(vo) {
    // 백엔드에서 orgName을 따로 내려주면 그걸 우선 사용
    if (vo.orgName) {
        return vo.orgName;
    }

    // 점주이고 storeName이 있으면 매장명
    if (vo.storeName) {
        return vo.storeName;
    }

    // 기본은 부서명
    return vo.deptName ?? "-";
}

/* =========================================================
   3. 목록 조회 + 요약 카드
   ========================================================= */
function getOrgName(vo) {
    return vo.orgName ?? "-";
}

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
        else if (status === "3") leaveCount++;
        else if (status === "4") businessTripCount++;
        else if (status === "5") trainingCount++;
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
        const statusInfo = getEmpStatusInfo(vo.empStatusNo);

        str += `
            <tr>
                <td>${i + 1}</td>
                <td class="emp-name-cell">
                    <span class="link-text" onclick="openEmpModal('${vo.empNo}')">${nvl(vo.empName)}</span>
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
   4. 검색
   - 백엔드 검색 API 없이 프론트 필터링
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
        const statusText = getEmpStatusInfo(vo.empStatusNo).text.toLowerCase();

        if (searchType === "empName") {
            return empName.includes(keyword);
        }

        if (searchType === "posName") {
            return posName.includes(keyword);
        }

        if (searchType === "status") {
            return statusText.includes(keyword);
        }

        return true;
    });

    renderTable(filteredList);
}

// 검색창 엔터 처리
const keywordTag = document.querySelector("#keyword");
if (keywordTag) {
    keywordTag.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchEmp();
        }
    });
}

/* =========================================================
   5. 상세조회 모달
   - 현재는 목록 데이터 기준으로 모달 채움
   - 나중에 /emp/{empNo} 상세 API 생기면 교체 가능
   ========================================================= */

function openEmpModal(empNo) {
    const vo = empList.find(item => String(item.empNo) === String(empNo));

    if (!vo) {
        alert("직원 정보를 찾을 수 없습니다.");
        return;
    }

    currentEmp = vo;

    document.querySelector("#modal-emp-name").innerText = nvl(vo.empName);
    document.querySelector("#modal-emp-no").innerText = nvl(vo.empNo);
    document.querySelector("#modal-pos-name").innerText = nvl(vo.posName);
    document.querySelector("#modal-org-name").innerText = nvl(getOrgName(vo));
    document.querySelector("#modal-emp-phone").innerText = nvl(vo.empPhone);
    document.querySelector("#modal-emp-email").innerText = nvl(vo.empEmail);
    document.querySelector("#modal-emp-address").innerText = nvl(vo.empAddress);
    document.querySelector("#modal-hire-date").innerText = formatDate(vo.hireDate);
    document.querySelector("#modal-resign-date").innerText = formatDate(vo.resignDate);

    const statusInfo = getEmpStatusInfo(vo.empStatusNo);
    document.querySelector("#modal-emp-status").innerText = statusInfo.text;

    document.querySelector("#emp-modal-wrap").style.display = "flex";
}

function closeEmpModal() {
    document.querySelector("#emp-modal-wrap").style.display = "none";
}