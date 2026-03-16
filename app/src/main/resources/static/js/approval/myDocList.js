function getStatusInfo(statusCode){
        if(statusCode == 1){return "status-wait";}
        else if(statusCode == 2){return "status-ok";}
        else if(statusCode == 3){return "status-reject";}
        return "-";
}

async function loadDocList(){
    const resp = await fetch(`/api/approval/document/selectMyDocumentList`);

    const data = await resp.json();
    const voList = data.voList;

    const tbodyTag = document.querySelector("#document-list");

    if (!voList || voList.length === 0) {
        tbodyTag.innerHTML = `
            <tr class="empty-row">
                <td colspan="9">조회된 문서가 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (const vo of voList) {
        const statusClass = getStatusInfo(vo.statusCode);
        str += `
            <tr>
                <td>${vo.docNo}</td>
                <td>${vo.categoryName}</td>
                <td>${vo.title}</td>
                <td>${vo.writerName}</td>
                <td>${vo.writerDept}</td>
                <td>
                    <span class="status-badge">
                        <span class="status-dot ${statusClass}"></span>
                        <span>${vo.statusName}</span>
                    </span>
                </td>
                <td>${vo.approverName}</td>
                <td>${formatDate(vo.submittedAt)}</td>
                <td>${formatDate(vo.actedAt)}</td>
            </tr>
        `;
    }

    tbodyTag.innerHTML = str;
}

loadDocList();


function formatDate(value) {
    if (!value) {
        return "-";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}