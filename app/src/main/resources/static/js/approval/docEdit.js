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

    if (!title) {
        alert("제목을 입력하세요.");
        return;
    }

    if (!deptCode) {
        alert("참조부서를 선택하세요.");
        return;
    }

    if (!approverNo) {
        alert("결재자를 선택하세요.");
        return;
    }

    if (!content) {
        alert("내용을 입력하세요.");
        return;
    }

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

    const resp = await fetch(`/api/approval/document/update/${docNo}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await resp.text();

    if (resp.ok) {
        alert("문서가 수정되었습니다.");
        location.href = `/approval/document/detail/${docNo}`;
    } else {
        alert(result || "문서 수정 실패");
    }
}

/* 기존 찾기 모달 재사용 */
function openDeptModal() {
    // 기존 참조부서 찾기 모달 함수 연결
    // 예: document.querySelector("#dept-modal").classList.remove("hidden");
    openReferenceDeptModal();
}

function openApproverModal() {
    // 기존 결재자 찾기 모달 함수 연결
    openApproverSearchModal();
}

/* 기존 모달에서 선택 완료 후 이 함수들 호출하도록 맞추면 됨 */
function setReferenceDept(deptCode, deptName) {
    document.querySelector("#referenceDeptCode").value = deptCode;
    document.querySelector("#referenceDeptName").value = deptName;
}

function setApprover(empNo, empName) {
    document.querySelector("#approverNo").value = empNo;
    document.querySelector("#approverName").value = empName;
}