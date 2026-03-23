document.addEventListener("DOMContentLoaded", async function () {
    await loadDocDetail();
});

async function loadDocDetail() {
    const docNo = document.querySelector("#docNo").value;

    const resp = await fetch(`/api/approval/document/detail/${docNo}`);
    if (!resp.ok) {
        alert("문서 정보를 불러오는 중 에러발생.");
        return;
    }

    const data = await resp.json();
    console.log("detail data:", data);

    renderEditForm(data);
}

function renderEditForm(doc) {
    document.querySelector("#categoryNo").value = doc.categoryNo ?? "";
    document.querySelector("#title").value = doc.title ?? "";
    document.querySelector("#referenceDeptCode").value = doc.deptCode ?? "";
    document.querySelector("#referenceDeptName").value = doc.referenceDept ?? "";
    document.querySelector("#approverNo").value = doc.approverNo ?? "";
    document.querySelector("#approverName").value = doc.approverName ?? "";
    document.querySelector("#content").value = doc.content ?? "";

    const categoryName = doc.categoryName ?? "";

    if (categoryName === "휴가") {
        document.querySelector("#vacation-date-row").classList.remove("hidden");
        document.querySelector("#overtime-hour-row").classList.add("hidden");

        document.querySelector("#startDate").value = formatDate(doc.startDate);
        document.querySelector("#endDate").value = formatDate(doc.endDate);
    } else if (categoryName === "연장근무") {
        document.querySelector("#vacation-date-row").classList.add("hidden");
        document.querySelector("#overtime-hour-row").classList.remove("hidden");

        document.querySelector("#workHour").value = doc.workHour ?? "";
    }
}

function formatDate(value) {
    if (!value) {
        return "-";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}

async function updateDoc() {
    const docNo = document.querySelector("#docNo").value;
    const categoryNo = document.querySelector("#categoryNo").value;
    const title = document.querySelector("#title").value.trim();
    const deptCode = document.querySelector("#referenceDeptCode").value;
    const approverNo = document.querySelector("#approverNo").value;
    const content = document.querySelector("#content").value.trim();
    const startDate = document.querySelector("#startDate")?.value;
    const endDate = document.querySelector("#endDate")?.value;
    const workDate = document.querySelector("#workDate")?.value;
    const workHour = document.querySelector("#workHour")?.value;

    const payload = {
        categoryNo,
        title,
        deptCode,
        approverNo,
        content,
        startDate,
        endDate,
        workHour,
        workDate
    };

    const resp = await fetch(`/api/approval/document/edit/${docNo}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await resp.text();

    if (resp.ok) {
        alert("문서가 수정되었습니다.");
        location.href = `/approval/document/myDocList`;
    } else {
        alert(result || "문서 수정 실패");
    }
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
    document.querySelector("#referenceDeptCode").value = deptCode;
    document.querySelector("#referenceDeptName").value = deptName;
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
    document.querySelector("#approverName").value = `${empName} / ${deptName} / ${positionName}`;
    closeApproverModal();
}


// /* 기존 모달에서 선택 완료 후 이 함수들 호출하도록 맞추면 됨 */
// function setReferenceDept(deptCode, deptName) {
//     document.querySelector("#referenceDeptCode").value = deptCode;
//     document.querySelector("#referenceDeptName").value = deptName;
// }

// function setApprover(empNo, empName) {
//     document.querySelector("#approverNo").value = empNo;
//     document.querySelector("#approverName").value = empName;
// }