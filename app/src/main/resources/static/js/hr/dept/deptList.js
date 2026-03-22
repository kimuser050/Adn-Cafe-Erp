/* =========================================================
   부서관리 JS
   - 요약 카드
   - 전체 목록 조회
   - 검색
   - 상세조회 모달
   - 활성화 / 비활성화
   - 근무위치 수정
   - 관리자 수정
   - 부서 등록
   ========================================================= */

/* =========================================================
   0. 전역 변수
   ========================================================= */
let currentPage = 1;
let currentSearchType = "all";
let currentKeyword = "";
let currentDeptCode = null;     // 현재 보고 있는 부서코드
let currentUseYn = null;        // 현재 보고 있는 부서의 사용여부
let currentMemberList = [];     // 현재 부서 소속 인원 목록

/* =========================================================
   1. 페이지 진입 시 실행
   ========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        initSearchPlaceholder();
        bindDeptEvents();
        await loadDeptSummary();
        await loadDeptList(1);
    } catch (error) {
        console.log(error);
        alert("부서 페이지 로딩 실패 ...");
    }
});

/* =========================================================
   2. 공통 함수
   ========================================================= */

// 날짜를 YYYY-MM-DD 형태로 잘라서 보여주는 함수
function formatDate(value) {
    if (!value) {
        return "";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}

// useYn 값을 화면용 상태 텍스트/클래스로 변환
function getUseYnInfo(useYn) {
    if (useYn === "Y") {
        return { text: "사용", statusClass: "status-confirmed" };
    }
    return { text: "미사용", statusClass: "status-pending" };
}

// 직급코드를 직급명으로 바꾸는 함수
function changePosCode(posCode) {
    if (posCode == "100001") return "대표";
    if (posCode == "100002") return "부장";
    if (posCode == "100003") return "과장";
    if (posCode == "100004") return "대리";
    if (posCode == "100005") return "주임";
    if (posCode == "100006") return "사원";
    if (posCode == "100011") return "점주";

    return posCode;
}

function initSearchPlaceholder(){
    const type = document.querySelector("#search-type")?.value;
    const input = document.querySelector("#keyword");

    if(!input) return;

    if (type === "deptName") {
        input.placeholder = "부서명을 입력하세요";
    } else if (type === "useYn") {
        input.placeholder = "사용 / 미사용 입력";
    } else {
        input.placeholder = "검색어를 입력하세요";
    }
}

initSearchPlaceholder();

/* =========================================================
   3. 요약 카드
   - 검색결과와 상관없이 항상 전체 기준
   ========================================================= */

// 상단 요약 카드용 전체 목록 조회
async function loadDeptSummary() {
    try {
        const resp = await fetch("/dept");

        if (!resp.ok) {
            throw new Error("부서 요약 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderSummary(voList);

    } catch (error) {
        console.log(error);
        alert("부서 요약 조회 중 오류 발생 ...");
    }
}

// 요약 카드 숫자 세팅
function renderSummary(voList){
    const totalDeptTag = document.querySelector("#dept-count");
    const memberCountTag = document.querySelector("#member-count");

    totalDeptTag.innerText = voList.length;

    let total = 0;
    for(const vo of voList){
        total += (vo.memberCount ?? 0);
    }

    memberCountTag.innerText = total;
}

/* =========================================================
   4. 목록 조회
   ========================================================= */

// 전체 부서 목록 가져오기
async function loadDeptList(page = 1) {
    try {
        currentPage = page;
        currentSearchType = "all";
        currentKeyword = "";

        const resp = await fetch(`/dept?currentPage=${page}`);

        if (!resp.ok) {
            throw new Error("부서 목록 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList, data.pvo);
        renderPagination(data.pvo);

    } catch (error) {
        console.log(error);
        alert("부서 목록 조회 중 오류 발생 ...");
    }
}

// 목록 테이블 렌더링
function renderTable(voList, pvo) {
    const tbody = document.querySelector("#dept-list");
    if (!tbody) return;

    if (!voList || voList.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">조회된 부서가 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";
    const startNo = pvo ? ((pvo.currentPage - 1) * pvo.boardLimit) : 0;

    for (let i = 0; i < voList.length; i++) {
        const vo = voList[i];
        const statusInfo = getUseYnInfo(vo.useYn);

        str += `
            <tr>
                <td>${startNo + i + 1}</td>
                <td class="dept-name-cell">
                    <span class="link-text" onclick="openDeptModal('${vo.deptCode}')">${vo.deptName ?? "-"}</span>
                </td>
                <td>${vo.managerName ?? "-"}</td>
                <td>${vo.memberCount == null ? 0 : vo.memberCount}</td>
                <td>${vo.deptAddress ?? "-"}</td>
                <td>${formatDate(vo.createdAt)}</td>
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
   - pos.js와 같은 방식
   ========================================================= */
// 검색 placeholder 변경
const searchTypeTag = document.querySelector("#search-type");

if (searchTypeTag) {
    searchTypeTag.addEventListener("change", function () {

        const keywordInput = document.querySelector("#keyword");

        if (this.value === "deptName") {
            keywordInput.placeholder = "부서명을 입력하세요";
        } else if (this.value === "useYn") {
            keywordInput.placeholder = "사용 / 미사용 입력";
        } else {
            keywordInput.placeholder = "검색어를 입력하세요";
        }

        const keyword = keywordInput.value.trim();
        if (keyword === "") {
            loadDeptList();
        }
    });
}

   
// 검색 버튼 클릭 시 분기
async function searchDept(page = 1) {
    const searchType = document.querySelector("#search-type")?.value ?? "all";
    const keyword = document.querySelector("#keyword")?.value.trim() ?? "";

    currentPage = page;
    currentSearchType = searchType;
    currentKeyword = keyword;

    if (searchType === "all" || keyword === "") {
        await loadDeptList(page);
        return;
    }

    if (searchType === "deptName") {
        await loadDeptListByName(page);
    } else if (searchType === "useYn") {
        await loadDeptListByUseYn(page);
    }
}

// 부서명으로 검색
async function loadDeptListByName(page = 1) {
    try {
        const keyword = document.querySelector("#keyword").value.trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        currentPage = page;
        currentSearchType = "deptName";
        currentKeyword = keyword;

        const resp = await fetch(`/dept/search/name?keyword=${encodeURIComponent(keyword)}&currentPage=${page}`);

        if (!resp.ok) {
            throw new Error("부서명 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList, data.pvo);
        renderPagination(data.pvo);

    } catch (error) {
        console.log(error);
        alert("부서명 검색 중 오류 발생 ...");
    }
}

// 사용여부로 검색
async function loadDeptListByUseYn(page = 1) {
    try {
        const keyword = document.querySelector("#keyword").value.trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        let useYn = "";

        if (keyword === "사용" || keyword === "운영" || keyword.toUpperCase() === "Y") {
            useYn = "Y";
        } else if (keyword === "미사용" || keyword === "비활성화" || keyword.toUpperCase() === "N") {
            useYn = "N";
        } else {
            alert("사용여부는 사용 / 미사용 / Y / N 으로 입력하세요.");
            return;
        }

        currentPage = page;
        currentSearchType = "useYn";
        currentKeyword = keyword;

        const resp = await fetch(`/dept/search/useYn?useYn=${useYn}&currentPage=${page}`);

        if (!resp.ok) {
            throw new Error("사용여부 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList, data.pvo);
        renderPagination(data.pvo);

    } catch (error) {
        console.log(error);
        alert("사용여부 검색 중 오류 발생 ...");
    }
}

// 검색창 엔터 처리
const deptKeywordTag = document.querySelector("#keyword");
if (deptKeywordTag) {
    deptKeywordTag.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchDept();
        }
    });
}

/* =========================================================
   6. 상세조회 모달
   ========================================================= */

// 부서 상세조회 모달 열기
async function openDeptModal(deptCode) {
    try {
        const resp = await fetch(`/dept/${deptCode}`);

        if (!resp.ok) {
            throw new Error("부서 상세조회 실패 ...");
        }

        const data = await resp.json();
        const vo = data.vo;
        const memberList = data.memberList ?? [];

        currentDeptCode = deptCode;
        currentUseYn = vo.useYn;
        currentMemberList = memberList;

        // 부서 상세정보 채우기
        document.querySelector("#modal-dept-name").innerText = vo.deptName ?? "-";
        document.querySelector("#modal-dept-manager").innerText = vo.managerName ?? "-";
        document.querySelector("#modal-dept-address").innerText = vo.deptAddress ?? "-";
        document.querySelector("#modal-dept-emp").innerText = (vo.memberCount ?? 0) + "명";
        document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);

        const statusInfo = getUseYnInfo(vo.useYn);
        const modalUseYnTag = document.querySelector("#modal-use-yn");
        modalUseYnTag.className = `status ${statusInfo.statusClass}`;
        modalUseYnTag.innerText = statusInfo.text;
        

        // 활성/비활성 버튼 문구 세팅
        const toggleBtn = document.querySelector("#toggle-use-btn");
        if (toggleBtn) {
            if (vo.useYn === "Y") {
                toggleBtn.innerText = "비활성화";
            } else {
                toggleBtn.innerText = "활성화";
            }
        }

        // 소속 인원 목록 채우기
        renderDeptMemberList(memberList);

        // 수정 UI 초기화
        cancelEditAddress();
        cancelEditManager();

        document.querySelector("#dept-modal-wrap").style.display = "flex";

    } catch (error) {
        console.log(error);
        alert("부서 상세조회 실패 ...");
    }
}

// 소속 인원 테이블 렌더링
function renderDeptMemberList(memberList) {
    const tbody = document.querySelector("#modal-member-list");

    if (!tbody) {
        return;
    }

    if (!memberList || memberList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">소속 인원이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < memberList.length; i++) {
        const member = memberList[i];

        str += `
            <tr>
                <td>${i + 1}</td>
                <td>${member.empName ?? "-"}</td>
                <td>${changePosCode(member.posCode)}</td>
                <td>${member.empNo ?? "-"}</td>
                <td>${member.empPhone ?? "-"}</td>
                <td>${formatDate(member.hireDate)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

// 상세조회 모달 닫기
function closeDeptModal() {
    document.querySelector("#dept-modal-wrap").style.display = "none";
}

/* =========================================================
   7. 활성화 / 비활성화
   ========================================================= */

// 현재 부서 사용여부 토글
async function toggleDeptUseYn() {
    try {
        if (currentDeptCode == null || currentUseYn == null) {
            alert("부서 정보가 없습니다.");
            return;
        }

        let url = "";
        let msg = "";

        if (currentUseYn === "Y") {
            url = `/dept/${currentDeptCode}/disable`;
            msg = "정말 비활성화 하시겠습니까?";
        } else {
            url = `/dept/${currentDeptCode}/enable`;
            msg = "정말 활성화 하시겠습니까?";
        }

        const ok = confirm(msg);
        if (!ok) {
            return;
        }

        const resp = await fetch(url, {
            method: "PUT",
        });

        if (!resp.ok) {
            throw new Error("상태 변경 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("처리 실패");
            return;
        }

        alert("처리 완료");
        closeDeptModal();
        loadDeptSummary();
        loadDeptList();

    } catch (error) {
        console.log(error);
        alert("상태 변경 중 오류 발생 ...");
    }
}

/* =========================================================
   8. 근무위치 수정
   ========================================================= */

// 근무위치 수정 시작
function startEditAddress() {
    const currentAddress = document.querySelector("#modal-dept-address").innerText;

    document.querySelector("#address-input").value = currentAddress;
    document.querySelector("#address-view-area").style.display = "none";
    document.querySelector("#address-edit-area").style.display = "grid";
}

// 근무위치 수정 취소
function cancelEditAddress() {
    const viewTag = document.querySelector("#address-view-area");
    const editTag = document.querySelector("#address-edit-area");

    if (viewTag) viewTag.style.display = "grid";
    if (editTag) editTag.style.display = "none";
}

// 근무위치 수정 저장
async function saveAddress() {
    try {
        const deptAddress = document.querySelector("#address-input").value;

        if (!currentDeptCode) {
            alert("부서 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/dept/${currentDeptCode}/address`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ deptAddress }),
        });

        if (!resp.ok) {
            throw new Error("근무위치 수정 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("근무위치 수정 실패");
            return;
        }

        document.querySelector("#modal-dept-address").innerText = deptAddress;
        cancelEditAddress();

        alert("근무위치 수정 완료");
        loadDeptList();

    } catch (error) {
        console.log(error);
        alert("근무위치 수정 중 오류 발생 ...");
    }
}

/* =========================================================
   9. 관리자 수정
   ========================================================= */

// 관리자 수정 시작
function startEditManager() {
    const selectTag = document.querySelector("#manager-select");
    selectTag.innerHTML = "";

    for (let i = 0; i < currentMemberList.length; i++) {
        const member = currentMemberList[i];
        let selected = "";

        if (member.empName === document.querySelector("#modal-dept-manager").innerText) {
            selected = "selected";
        }

        selectTag.innerHTML += `
            <option value="${member.empNo}" ${selected}>${member.empName}</option>
        `;
    }

    document.querySelector("#manager-view-area").style.display = "none";
    document.querySelector("#manager-edit-area").style.display = "grid";
}

// 관리자 수정 취소
function cancelEditManager() {
    const viewTag = document.querySelector("#manager-view-area");
    const editTag = document.querySelector("#manager-edit-area");

    if (viewTag) viewTag.style.display = "grid";
    if (editTag) editTag.style.display = "none";
}

// 관리자 수정 저장
async function saveManager() {
    try {
        const managerEmpNo = document.querySelector("#manager-select").value;

        if (!currentDeptCode) {
            alert("부서 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/dept/${currentDeptCode}/manager`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ managerEmpNo }),
        });

        if (!resp.ok) {
            throw new Error("관리자 수정 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("관리자 수정 실패");
            return;
        }

        const selectedText = document.querySelector("#manager-select").selectedOptions[0].text;
        document.querySelector("#modal-dept-manager").innerText = selectedText;

        cancelEditManager();

        alert("관리자 수정 완료");
        loadDeptList();

    } catch (error) {
        console.log(error);
        alert("관리자 수정 중 오류 발생 ...");
    }
}

/* =========================================================
   10. 부서 등록
   ========================================================= */

// 등록 모달 열기
function openInsertDeptModal() {
    document.querySelector("#insert-dept-code").value = "";
    document.querySelector("#insert-dept-name").value = "";
    document.querySelector("#insert-dept-address").value = "";

    document.querySelector("#dept-insert-modal-wrap").style.display = "flex";
}

// 등록 모달 닫기
function closeInsertDeptModal() {
    document.querySelector("#dept-insert-modal-wrap").style.display = "none";
}

// 부서 등록
async function insertDept() {
    try {
        const deptCode = document.querySelector("#insert-dept-code").value.trim();
        const deptName = document.querySelector("#insert-dept-name").value.trim();
        const deptAddress = document.querySelector("#insert-dept-address").value.trim();

        if (deptCode === "") {
            alert("부서코드를 입력하세요.");
            return;
        }

        if (deptName === "") {
            alert("부서명을 입력하세요.");
            return;
        }

        if (deptAddress === "") {
            alert("근무위치를 입력하세요.");
            return;
        }

        const resp = await fetch("/dept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                deptCode,
                deptName,
                deptAddress,
            }),
        });

        if (!resp.ok) {
            throw new Error("부서 등록 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("부서 등록 실패");
            return;
        }

        alert("부서 등록 완료 !");
        closeInsertDeptModal();

        loadDeptSummary();
        loadDeptList();

    } catch (error) {
        console.log(error);
        alert("부서 등록 중 오류 발생 ...");
    }
}


function bindDeptEvents() {
    const searchTypeTag = document.querySelector("#search-type");
    const keywordTag = document.querySelector("#keyword");
    const searchBtn = document.querySelector("#search-btn");

    if (searchTypeTag) {
        searchTypeTag.addEventListener("change", async function () {
            const keywordInput = document.querySelector("#keyword");

            if (this.value === "deptName") {
                keywordInput.placeholder = "부서명을 입력하세요";
            } else if (this.value === "useYn") {
                keywordInput.placeholder = "사용 / 미사용 입력";
            } else {
                keywordInput.placeholder = "검색어를 입력하세요";
            }

            const keyword = keywordInput.value.trim();
            if (keyword === "") {
                currentSearchType = "all";
                currentKeyword = "";
                await loadDeptList(1);
            }
        });
    }

    if (keywordTag) {
        keywordTag.addEventListener("keydown", async function (e) {
            if (e.key === "Enter") {
                await searchDept(1);
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", async function () {
            await searchDept(1);
        });
    }
}


function renderPagination(pvo) {
    const pageArea = document.querySelector("#dept-pagination-area");
    if (!pageArea) return;

    if (!pvo) {
        pageArea.innerHTML = `
            <button type="button" class="page-btn active">1</button>
        `;
        return;
    }

    let str = "";

    const start = pvo.startPage || 1;
    const end = pvo.endPage || 1;

    for (let i = start; i <= end; i++) {
        str += `
            <button
                type="button"
                class="page-btn ${i === pvo.currentPage ? "active" : ""}"
                onclick="${getDeptPageMoveFunction(i)}"
            >
                ${i}
            </button>
        `;
    }

    if (pvo.endPage < pvo.maxPage) {
        str += `
            <button
                type="button"
                class="page-btn page-next"
                onclick="${getDeptPageMoveFunction(pvo.endPage + 1)}"
            >
                &gt;
            </button>
        `;
    }

    pageArea.innerHTML = str;
}


function getDeptPageMoveFunction(page) {
    if (currentSearchType === "all" || currentKeyword === "") {
        return `loadDeptList(${page})`;
    }

    return `searchDept(${page})`;
}

async function reloadDeptListKeepingState() {
    if (currentSearchType === "all" || currentKeyword === "") {
        await loadDeptList(currentPage);
    } else {
        await searchDept(currentPage);
    }
}