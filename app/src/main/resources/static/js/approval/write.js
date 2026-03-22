// async function insertDocument(){
//     try {
//         const categoryNo = document.querySelector("#categoryNo").value;
//         const writerNo = document.querySelector("#writerNo").value;
//         const deptCode = document.querySelector("#deptCode").value;
//         const title = document.querySelector("#title").value;
//         const content = document.querySelector("#content").value;
//         const approverNo = document.querySelector("#approverNo").value;
//         const startDate = document.querySelector("#startDate").value;
//         const endDate = document.querySelector("#endDate").value;

//         const resp = await fetch(`/api/approval/document/write` , {
//             method : "POST",
//             headers : {
//                 "Content-Type":"application/json" , 
//             },
//             body : JSON.stringify({ 
//                 categoryNo
//                 , writerNo
//                 , deptCode
//                 , title
//                 , content
//                 , approverNo
//                 , startDate
//                 , endDate})
//         })
    
//         if(!resp.ok){
//             throw new Error("insert fail");
//         }
    
//         alert("상신 완료");
//         location.href="/approval/document/myDocList"
//     } catch (error) {
//         location.href="/home"
//         console.log(error)
//     }
// }

const formTitle = document.querySelector("#formTitle");
const categoryTypeInput = document.querySelector("#categoryType");
const categoryNoInput = document.querySelector("#categoryNo");

const formCards = document.querySelectorAll(".form-card");
const vacationRows = document.querySelectorAll(".vacation-row");
const overtimeRows = document.querySelectorAll(".overtime-row");

init();

function init() {
    bindFormTypeEvents();
}

function bindFormTypeEvents() {
    formCards.forEach(card => {
        card.addEventListener("click", () => {
            formCards.forEach(x => x.classList.remove("active"));
            card.classList.add("active");
            changeFormType(card.dataset.type);
        });
    });
}

function changeFormType(type) {
    categoryTypeInput.value = type;

    if (type === "VACATION") {
        formTitle.innerText = "휴가신청";
        categoryNoInput.value = "1";

        vacationRows.forEach(row => row.classList.remove("hidden"));
        overtimeRows.forEach(row => row.classList.add("hidden"));

        clearOvertimeFields();
    } else if (type === "OVERTIME") {
        formTitle.innerText = "연장근무신청";
        categoryNoInput.value = "2";

        vacationRows.forEach(row => row.classList.add("hidden"));
        overtimeRows.forEach(row => row.classList.remove("hidden"));

        clearVacationFields();
    }
}

function clearVacationFields() {
    document.querySelector("#startDate").value = "";
    document.querySelector("#endDate").value = "";
}

function clearOvertimeFields() {
    document.querySelector("#overtimeDate").value = "";
    document.querySelectorAll("input[name='overtimeHours']").forEach(radio => radio.checked = false);
}

/* =========================
   참조부서 모달
========================= */
async function openDeptModal() {
    document.querySelector("#deptModal").classList.remove("hidden");

    try {
        const resp = await fetch(`/api/approval/document/deptList`);
        const data = await resp.json();
        renderDeptList(data);
    } catch (error) {
        console.error(error);
        alert("부서 목록 조회 중 오류 발생");
    }
}

function closeDeptModal() {
    document.querySelector("#deptModal").classList.add("hidden");
}

function renderDeptList(deptList) {
    const tbody = document.querySelector("#deptTbody");
    tbody.innerHTML = "";

    let str = "";
    for (const dept of deptList) {
        str += `
            <tr>
                <td>${dept.deptName}</td>
                <td>
                    <button type="button" onclick="selectDept('${dept.deptCode}', '${dept.deptName}')">선택</button>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function selectDept(deptCode, deptName) {
    document.querySelector("#deptCode").value = deptCode;
    document.querySelector("#deptName").value = deptName;
    closeDeptModal();
}

/* =========================
   결재자 모달
========================= */
async function openApproverModal() {
    document.querySelector("#approverModal").classList.remove("hidden");

    try {
        const resp = await fetch(`/api/approval/document/approverList`);
        const data = await resp.json();
        renderApproverList(data);
    } catch (error) {
        console.error(error);
        alert("결재자 목록 조회 중 오류 발생");
    }
}

function closeApproverModal() {
    document.querySelector("#approverModal").classList.add("hidden");
}

function renderApproverList(approverList) {
    const tbody = document.querySelector("#approverTbody");
    tbody.innerHTML = "";

    let str = "";
    for (const approver of approverList) {
        str += `
            <tr>
                <td>${approver.empName}</td>
                <td>${approver.deptName}</td>
                <td>${approver.posName}</td>
                <td>
                    <button type="button"
                        onclick="selectApprover('${approver.empNo}', '${approver.empName}', '${approver.deptName}', '${approver.posName}')">
                        선택
                    </button>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

function selectApprover(empNo, empName, deptName, positionName) {
    document.querySelector("#approverNo").value = empNo;
    document.querySelector("#approverInfo").value = `${empName} / ${deptName} / ${positionName}`;
    closeApproverModal();
}

/* =========================
   상신
========================= */
function validateForm() {
    const title = document.querySelector("#title").value.trim();
    const deptCode = document.querySelector("#deptCode").value;
    const approverNo = document.querySelector("#approverNo").value;
    const content = document.querySelector("#content").value.trim();
    const categoryType = document.querySelector("#categoryType").value;

    if (!title) {
        alert("제목을 입력하세요.");
        return false;
    }

    if (!deptCode) {
        alert("참조부서를 입력하세요.");
        return false;
    }

    if (!approverNo) {
        alert("결재자를 입력하세요.");
        return false;
    }

    if (!content) {
        alert("내용을 입력하세요.");
        return false;
    }

    if (categoryType === "VACATION") {
        const startDate = document.querySelector("#startDate").value;
        const endDate = document.querySelector("#endDate").value;

        if (!startDate || !endDate) {
            alert("휴가 시작일과 종료일을 입력하세요.");
            return false;
        }

        if (startDate > endDate) {
            alert("휴가 종료일은 시작일보다 빠를 수 없습니다.");
            return false;
        }
    }

    if (categoryType === "OVERTIME") {
        const overtimeDate = document.querySelector("#overtimeDate").value;
        const overtimeHours = document.querySelector("input[name='overtimeHours']:checked");

        if (!overtimeDate) {
            alert("연장근무 날짜를 입력하세요.");
            return false;
        }

        if (!overtimeHours) {
            alert("연장근무 시간을 선택하세요.");
            return false;
        }
    }

    return true;
}

function buildPayload() {
    const categoryType = document.querySelector("#categoryType").value;

    const payload = {
        categoryNo: document.querySelector("#categoryNo").value,
        title: document.querySelector("#title").value.trim(),
        deptCode: document.querySelector("#deptCode").value,
        approverNo: document.querySelector("#approverNo").value,
        content: document.querySelector("#content").value.trim()
    };

    if (categoryType === "VACATION") {
        payload.startDate = document.querySelector("#startDate").value;
        payload.endDate = document.querySelector("#endDate").value;
    }

    if (categoryType === "OVERTIME") {
        payload.workDate = document.querySelector("#overtimeDate").value;
        payload.workHour = document.querySelector("input[name='overtimeHours']:checked").value;
    }

    return payload;
}

async function submitApproval() {
    if (!validateForm()) {
        return;
    }

    const payload = buildPayload();

    try {
        const resp = await fetch(`/api/approval/document/write`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await resp.json();

        if (!resp.ok) {
            alert(data.msg || "상신 실패 : 관리자에게 문의하세요.");
            return;
        }

        alert("상신 완료");
        location.href = `/approval/document/myDocList`;
    } catch (error) {
        console.error(error);
        alert("서버 에러 발생 : 관리자에게 문의하세요. ");
    }
}