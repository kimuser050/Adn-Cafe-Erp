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
        console.error(error);
        alert("부서 목록 조회 중 오류 발생");
    }
}
// 위에 부서 요약!
function renderSummary(voList) {
    document.querySelector("#dept-count").innerText = voList.length;

    // [임시] 직원수
    document.querySelector("#member-count").innerText = 0;
}

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

        const statusText = vo.useYn === "Y" ? "운영" : "비활성화";
        const statusClass = vo.useYn === "Y" ? "status-on" : "status-off";

        str += `
            <tr>
                <td>${i + 1}</td>
                <td class="dept-name-cell">
                    <span class="dept-link" onclick="openDeptModal('${vo.deptCode}')">${vo.deptName}</span>
                </td>
                <td>-</td>
                <td>0</td>
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
    if (!value) return "";

    // TIMESTAMP 그대로 오면 앞 10글자만
    if (value.length >= 10) {
        return value.substring(0, 10).replaceAll("/", "-");
    }

    return value;
}

loadDeptList();

//-------------------------------------------------------------------------------------------------
// 모달 (상세조회)
async function openDeptModal(deptCode) {
    try {
        const resp = await fetch(`/dept/${deptCode}`);
        if(!resp.ok){
            throw new Error("dept detail fail...");
        }

        const data = await resp.json();
        const vo = data.vo;

        document.querySelector("#modal-dept-name").innerText = vo.deptName ?? "";
        document.querySelector("#modal-dept-address").innerText = vo.deptAddress ?? "";
        document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);

        const statusText = vo.useYn === "Y" ? "운영" : "비활성화";
        document.querySelector("#modal-use-yn").innerText = statusText;

        document.querySelector("#dept-modal-wrap").style.display = "flex";
    } catch (error) {
        console.log(error);
        alert("부서 상세조회 실패 ...");
    }
}

function closeDeptModal() {
    document.querySelector("#dept-modal-wrap").style.display = "none";
}