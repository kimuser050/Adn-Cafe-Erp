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

function renderSummary(voList) {
    document.querySelector("#dept-count").innerText = voList.length;

    // 아직 직원 총합 API가 없으니 임시값
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
                    <a href="/dept/detail/${vo.deptCode}">${vo.deptName}</a>
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