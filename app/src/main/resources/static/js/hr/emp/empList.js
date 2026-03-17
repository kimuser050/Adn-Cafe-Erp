/* =========================================================
   직원관리 JS
   - 직원 목록 조회
   - 목록 기반 검색
   - 상세조회 모달
   - 수정 모달 열기/닫기
   - 세미프로젝트 수준으로 단순화
   ========================================================= */

/* =========================================================
   0. 전역 변수
   - allEmpList     : 서버에서 받아온 전체 직원 목록
   - filteredList   : 검색 후 현재 화면에 보여줄 목록
   - currentEmpNo   : 현재 선택한 직원 사번
   ========================================================= */
let allEmpList = [];
let filteredEmpList = [];
let currentEmpNo = null;

/* =========================================================
   1. 페이지 최초 실행
   - 페이지 진입 시 직원 목록만 조회
   - summary API 같은 추가 호출은 하지 않음
   ========================================================= */
window.addEventListener("DOMContentLoaded", () => {
    loadEmpList();
});

/* =========================================================
   2. 공통 유틸 함수
   ========================================================= */

// null, undefined, 빈 문자열이면 기본값 반환
function nvl(value, defaultValue = "-") {
    if (value === null || value === undefined || value === "") {
        return defaultValue;
    }
    return value;
}

// 날짜 문자열 YYYY-MM-DD 형태로 표시
function formatDate(value) {
    if (!value) return "-";
    return value.length >= 10 ? value.substring(0, 10) : value;
}

// 숫자 콤마 처리
function formatMoney(value) {
    if (value === null || value === undefined || value === "") return "-";
    return Number(value).toLocaleString();
}

// 특정 요소에 text 넣기
function setText(selector, value, defaultValue = "-") {
    const el = document.querySelector(selector);
    if (!el) return;
    el.innerText = nvl(value, defaultValue);
}

/* =========================================================
   3. 상태 뱃지 관련 함수
   ========================================================= */

// 상태명에 따라 CSS class 반환
function getStatusClass(statusName) {
    const map = {
        "재직": "working",
        "퇴직": "retired",
        "휴직": "leave",
        "출장": "trip",
        "교육": "training"
    };

    return map[statusName] || "unknown";
}

// 상태 뱃지 HTML 생성
function makeStatusBadge(statusName) {
    const className = getStatusClass(statusName);
    return `<span class="status ${className}">${nvl(statusName, "미정")}</span>`;
}

/* =========================================================
   4. 직원 목록 조회
   - /emp API 호출
   - 전체 목록 저장
   - 테이블 렌더링
   - 요약 카드도 같이 계산
   ========================================================= */
async function loadEmpList() {
    try {
        const resp = await fetch("/emp");
        if (!resp.ok) {
            throw new Error("직원 목록 조회 실패");
        }

        const data = await resp.json();

        allEmpList = data.voList || [];
        filteredEmpList = [...allEmpList];

        renderEmpList(filteredEmpList);
        renderSummaryCard(allEmpList);
    } catch (error) {
        console.error(error);
        alert("직원 목록 불러오기 실패");
    }
}

/* =========================================================
   5. 요약 카드 렌더링
   - 별도 summary API 없이
   - 현재 전체 목록 데이터로 계산
   ========================================================= */
function renderSummaryCard(list) {
    let workingCount = 0;
    let businessTripCount = 0;
    let trainingCount = 0;
    let leaveCount = 0;

    list.forEach(emp => {
        const statusName = emp.statusName;

        if (statusName === "재직") workingCount++;
        else if (statusName === "출장") businessTripCount++;
        else if (statusName === "교육") trainingCount++;
        else if (statusName === "휴직") leaveCount++;
    });

    setText("#working-count", workingCount, "0");
    setText("#business-trip-count", businessTripCount, "0");
    setText("#training-count", trainingCount, "0");
    setText("#leave-count", leaveCount, "0");
}

/* =========================================================
   6. 직원 목록 테이블 렌더링
   ========================================================= */
function renderEmpList(list) {
    const tbody = document.querySelector("#emp-list");

    if (!tbody) return;

    if (!list.length) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">조회된 직원이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    list.forEach((emp, index) => {
        str += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <span class="link-text" onclick="openEmpModal('${emp.empNo}')">
                        ${nvl(emp.empName)}
                    </span>
                </td>
                <td>${nvl(emp.empNo)}</td>
                <td>${nvl(emp.posName)}</td>
                <td>${nvl(emp.orgName)}</td>
                <td>${nvl(emp.empPhone)}</td>
                <td>${makeStatusBadge(emp.statusName)}</td>
            </tr>
        `;
    });

    tbody.innerHTML = str;
}

/* =========================================================
   7. 검색
   - 백엔드 /emp/search 없이
   - 현재 목록 데이터를 프론트에서 필터링
   ========================================================= */
function searchEmp() {
    const searchType = document.querySelector("#search-type").value;
    const keyword = document.querySelector("#keyword").value.trim().toLowerCase();

    // 검색어 없으면 전체목록 다시 표시
    if (!keyword) {
        filteredEmpList = [...allEmpList];
        renderEmpList(filteredEmpList);
        return;
    }

    filteredEmpList = allEmpList.filter(emp => {
        const empName = String(emp.empName || "").toLowerCase();
        const posName = String(emp.posName || "").toLowerCase();
        const statusName = String(emp.statusName || "").toLowerCase();
        const orgName = String(emp.orgName || "").toLowerCase();
        const empNo = String(emp.empNo || "").toLowerCase();

        if (searchType === "empName") {
            return empName.includes(keyword);
        }

        if (searchType === "posName") {
            return posName.includes(keyword);
        }

        if (searchType === "statusName") {
            return statusName.includes(keyword);
        }

        // 전체 검색
        return (
            empName.includes(keyword) ||
            posName.includes(keyword) ||
            statusName.includes(keyword) ||
            orgName.includes(keyword) ||
            empNo.includes(keyword)
        );
    });

    renderEmpList(filteredEmpList);
}

/* =========================================================
   8. 상세조회 모달 열기
   - /emp/{empNo} 호출
   - 직원 기본정보 + 인사이력 표시
   ========================================================= */
async function openEmpModal(empNo) {
    try {
        currentEmpNo = empNo;

        const resp = await fetch(`/emp/${empNo}`);
        if (!resp.ok) {
            throw new Error("직원 상세조회 실패");
        }

        const data = await resp.json();
        const vo = data.vo || {};
        const empHistoryList = data.empHistoryList || [];

        renderEmpDetail(vo, empHistoryList);

        document.querySelector("#emp-modal-wrap").style.display = "flex";
    } catch (error) {
        console.error(error);
        alert("직원 상세조회 실패");
    }
}

/* =========================================================
   9. 상세조회 모달 닫기
   ========================================================= */
function closeEmpModal() {
    document.querySelector("#emp-modal-wrap").style.display = "none";
}

/* =========================================================
   10. 상세조회 모달 데이터 출력
   ========================================================= */
function renderEmpDetail(vo, empHistoryList) {
    // 기본정보
    setText("#modal-emp-name", vo.empName);
    setText("#modal-emp-no", vo.empNo);
    setText("#modal-pos-name", vo.posName);
    setText("#modal-org-name", vo.orgName);
    setText("#modal-hire-date", formatDate(vo.hireDate));
    setText("#modal-emp-phone", vo.empPhone);
    setText("#modal-emp-email", vo.empEmail);
    setText("#modal-emp-address", vo.empAddress);
    setText("#modal-resign-date", formatDate(vo.resignDate));

    // 상태는 뱃지로 출력
    const statusArea = document.querySelector("#modal-emp-status");
    if (statusArea) {
        statusArea.innerHTML = makeStatusBadge(vo.statusName);
    }

    // 급여정보
    setText("#modal-base-salary", vo.baseSalary ? `${formatMoney(vo.baseSalary)}원` : "-");
    setText("#modal-bonus-rate", vo.bonusRate);
    setText("#modal-expected-salary", vo.expectedSalary ? `${formatMoney(vo.expectedSalary)}원` : "-");

    // 프로필 이미지
    const profileImg = document.querySelector("#modal-profile-img");
    if (profileImg) {
        profileImg.src = vo.profileChangeName
            ? `/img/profile/${vo.profileChangeName}`
            : "/img/common/default-profile.png";
    }

    // 근태정보는 아직 미연결 상태
    setText("#modal-workingDay-count", "-");
    setText("#modal-overWorkingDay-count", "-");
    setText("#modal-lateDay-count", "-");
    setText("#modal-absenceDay-count", "-");

    // 인사이력
    renderEmpHistory(empHistoryList);

    // 수정 모달용 기본값도 같이 세팅
    fillEditModal(vo, empHistoryList);
}

/* =========================================================
   11. 인사이력 출력
   ========================================================= */
function renderEmpHistory(list) {
    const tbody = document.querySelector("#emp-history-list");
    if (!tbody) return;

    if (!list.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3">이력 없음</td>
            </tr>
        `;
        return;
    }

    let str = "";

    list.forEach(item => {
        str += `
            <tr>
                <td>${formatDate(item.hisDate || item.historyDate)}</td>
                <td>${nvl(item.eventName || item.hisType)}</td>
                <td>${nvl(item.hisContent || item.historyDesc)}</td>
            </tr>
        `;
    });

    tbody.innerHTML = str;
}

/* =========================================================
   12. 수정 모달 기본값 채우기
   - 아직 저장 기능이 완성 전이어도
   - 상세조회한 값을 수정창에 미리 넣어둠
   ========================================================= */
function fillEditModal(vo, empHistoryList) {
    setText("#edit-emp-no", vo.empNo);
    document.querySelector("#edit-emp-no").value = nvl(vo.empNo, "");

    document.querySelector("#edit-emp-name").value = nvl(vo.empName, "");
    document.querySelector("#edit-emp-no-view").value = nvl(vo.empNo, "");
    document.querySelector("#edit-hire-date").value = formatDate(vo.hireDate);

    // select는 아직 목록 API 연결 전이면 비워두기
    renderHistoryEditTable(empHistoryList);
}

/* =========================================================
   13. 수정 모달 인사이력 테이블 출력
   ========================================================= */
function renderHistoryEditTable(list) {
    const tbody = document.querySelector("#history-edit-body");
    if (!tbody) return;

    if (!list.length) {
        tbody.innerHTML = `
            <tr>
                <td><input type="date"></td>
                <td><input type="text" placeholder="이벤트"></td>
                <td><input type="text" placeholder="설명"></td>
            </tr>
        `;
        return;
    }

    let str = "";

    list.forEach(item => {
        const dateValue = formatDate(item.hisDate || item.historyDate);
        const eventValue = nvl(item.eventName || item.hisType, "");
        const descValue = nvl(item.hisContent || item.historyDesc, "");

        str += `
            <tr>
                <td><input type="date" value="${dateValue !== "-" ? dateValue : ""}"></td>
                <td><input type="text" value="${eventValue}"></td>
                <td><input type="text" value="${descValue}"></td>
            </tr>
        `;
    });

    tbody.innerHTML = str;
}

/* =========================================================
   14. 수정 모달 열기 / 닫기
   ========================================================= */
function openEditModal() {
    document.querySelector("#emp-modal-wrap").style.display = "none";
    document.querySelector("#emp-edit-modal-wrap").style.display = "flex";
}

function closeEditModal() {
    document.querySelector("#emp-edit-modal-wrap").style.display = "none";
}

/* =========================================================
   15. 인사이력 수정 테이블에 빈 행 추가
   ========================================================= */
function addHistoryRow() {
    const tbody = document.querySelector("#history-edit-body");
    if (!tbody) return;

    tbody.insertAdjacentHTML("beforeend", `
        <tr>
            <td><input type="date"></td>
            <td><input type="text" placeholder="이벤트"></td>
            <td><input type="text" placeholder="설명"></td>
        </tr>
    `);
}

/* =========================================================
   16. 저장
   - 아직 저장 API 연결 전이면 알림만 처리
   ========================================================= */
async function saveEmpEdit() {
    alert("수정 저장 기능은 아직 연결 전입니다.");
}