//0. 전역변수 
// 0.1 현재 보는 부서와 그 부서 사용여부

let currentDeptCode = null;
let currentUseYn = null;
let currentMemberList = [];



//1. 부서 목록 가져오기
async function loadDeptList() {
    try {
        const resp = await fetch("/dept");

        if (!resp.ok) {
            throw new Error("부서 목록 조회 실패");
        }

        const data = await resp.json();
        const voList = data.voList;

        renderSummary(voList);
        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("부서 목록 조회 중 오류 발생");
    }
}

// 요약 카드
function renderSummary(voList) {
    document.querySelector("#dept-count").innerText = voList.length;

    // !!!!!!!!!!!!!아직 총 직원 수가 없어서 임시 처리!!!!!!!!!!!!!!!!!!!!!!!!
    document.querySelector("#member-count").innerText = "-";
}

// 목록 테이블
function renderTable(voList) {
    const tbody = document.querySelector("#dept-list");

    if (!voList || voList.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">조회된 부서가 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < voList.length; i++) {
        const vo = voList[i];

        let statusText = "비활성화";
        let statusClass = "status-off";

        if (vo.useYn === "Y") {
            statusText = "운영";
            statusClass = "status-on";
        }

        str += `
            <tr>
                <td>${i + 1}</td>
                <td class="dept-name-cell">
                    <span class="dept-link" onclick="openDeptModal('${vo.deptCode}')">${vo.deptName}</span>
                </td>
                <td>${vo.managerName ?? "-"}</td>
                <td>-</td>
                <td>${vo.deptAddress ?? ""}</td>
                <td>${formatDate(vo.createdAt)}</td>
                <td>
                    <span class="status-badge">
                        <span class="status-dot ${statusClass}"></span>
                        <span>${statusText}</span>
                    </span>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function formatDate(value) {
    if (!value) {
        return "";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}

loadDeptList();


// ----------------------------------------------------------
// 상세조회 모달 열기
async function openDeptModal(deptCode) {
    
    const toggleBtn = document.querySelector("#toggle-use-btn");
    try {
        const resp = await fetch(`/dept/${deptCode}`);
        
        if (!resp.ok) {
            throw new Error("부서 상세조회 실패");
        }

        const data = await resp.json();
        const vo = data.vo;
        const memberList = data.memberList;

        currentDeptCode = deptCode;
        currentUseYn = vo.useYn;
        currentMemberList = memberList;

        // 부서 상세정보 채우기
        document.querySelector("#modal-dept-name").innerText = vo.deptName;
        document.querySelector("#modal-dept-manager").innerText = vo.managerName ?? "-";
        document.querySelector("#modal-dept-address").innerText = vo.deptAddress ?? "-";
        document.querySelector("#modal-dept-emp").innerText = vo.memberCount + "명";
        document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);

        let statusText = "비활성화";
        if (vo.useYn === "Y") {
            statusText = "운영";
        }
        document.querySelector("#modal-use-yn").innerText = statusText;

        // 여기서 버튼 문구 바꾸기
        const toggleBtn = document.querySelector("#toggle-use-btn");
        if (vo.useYn === "Y") {
            toggleBtn.innerText = "비활성화";
        } else {
            toggleBtn.innerText = "활성화";
        }

        // 소속 인원 목록 채우기
        let str = "";

        for (let i = 0; i < memberList.length; i++) {
            const member = memberList[i];

            str += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${member.empName}</td>
                    <td>${changePosCode(member.posCode)}</td>
                    <td>${member.empNo}</td>
                    <td>${member.empPhone}</td>
                    <td>${formatDate(member.hireDate)}</td>
                </tr>
            `;
        }

        document.querySelector("#modal-member-list").innerHTML = str;

        // 모달 열기
        document.querySelector("#dept-modal-wrap").style.display = "flex";

    } catch (error) {
        console.log(error);
        alert("부서 상세조회 실패");
    }
}

// 직급코드 -> 직급명 바꾸기
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

function closeDeptModal() {
    document.querySelector("#dept-modal-wrap").style.display = "none";
}



//활성화 여부에 따라 버튼 내용 바꾸기
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
            throw new Error("상태 변경 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("처리 실패");
            return;
        }

        alert("처리 완료");
        closeDeptModal();
        loadDeptList();

    } catch (error) {
        console.log(error);
        alert("상태 변경 중 오류 발생");
    }
}


//----------------------------근무위치 수정할때....---------------------------------------------------
function startEditAddress() {
    const currentAddress = document.querySelector("#modal-dept-address").innerText;

    document.querySelector("#address-input").value = currentAddress;
    document.querySelector("#address-view-area").style.display = "none";
    document.querySelector("#address-edit-area").style.display = "flex";
}

function cancelEditAddress() {
    document.querySelector("#address-view-area").style.display = "block";
    document.querySelector("#address-edit-area").style.display = "none";
}


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
            throw new Error("근무위치 수정 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("근무위치 수정 실패");
            return;
        }

        document.querySelector("#modal-dept-address").innerText = deptAddress;
        document.querySelector("#address-view-area").style.display = "block";
        document.querySelector("#address-edit-area").style.display = "none";

        loadDeptList(); // 목록 다시 조회
        alert("근무위치 수정 완료");
    } catch (error) {
        console.log(error);
        alert("근무위치 수정 중 오류 발생");
    }
}

//----------------------------부서 관리자 수정할때....---------------------------------------------------
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
    document.querySelector("#manager-edit-area").style.display = "flex";
}

function cancelEditManager() {
    document.querySelector("#manager-view-area").style.display = "block";
    document.querySelector("#manager-edit-area").style.display = "none";
}

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
            throw new Error("관리자 수정 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("관리자 수정 실패");
            return;
        }

        const selectedText = document.querySelector("#manager-select").selectedOptions[0].text;
        document.querySelector("#modal-dept-manager").innerText = selectedText;

        document.querySelector("#manager-view-area").style.display = "block";
        document.querySelector("#manager-edit-area").style.display = "none";

        loadDeptList();
        alert("관리자 수정 완료");
    } catch (error) {
        console.log(error);
        alert("관리자 수정 중 오류 발생");
    }
}



// -----------------------부서등록 모달-------------------------------------
function openInsertDeptModal() {
    document.querySelector("#insert-dept-code").value = "";
    document.querySelector("#insert-dept-name").value = "";
    document.querySelector("#insert-dept-address").value = "";

    document.querySelector("#dept-insert-modal-wrap").style.display = "flex";
}

function closeInsertDeptModal() {
    document.querySelector("#dept-insert-modal-wrap").style.display = "none";
}


async function insertDept() {
    try {
        const deptCode = document.querySelector("#insert-dept-code").value;
        const deptName = document.querySelector("#insert-dept-name").value;
        const deptAddress = document.querySelector("#insert-dept-address").value;

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
            throw new Error("부서 등록 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("부서 등록 실패");
            return;
        }

        alert("부서 등록 완료");
        closeInsertDeptModal();
        loadDeptList();

    } catch (error) {
        console.log(error);
        alert("부서 등록 중 오류 발생");
    }
}