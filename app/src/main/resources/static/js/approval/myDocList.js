function getStatusInfo(statusCode){
        if(statusCode == 1){return "status-wait";}
        else if(statusCode == 2){return "status-ok";}
        else if(statusCode == 3){return "status-reject";}
        return "-";
}

async function loadDocList(){
    const pno = location.pathname.split("/").pop();
    const resp = await fetch(`/api/approval/document/selectMyDocumentList?currentPage=${pno}`);

    const data = await resp.json();
    const pvo = data.pvo;
    const voList = data.voList;

    setPageArea(pvo);
    renderDocList(voList);
    renderSummary(voList);
}

loadDocList();

// 테이블 렌더링 
function renderDocList(voList) {
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
                <td><a href="#" onclick="openDocModal(event, ${vo.docNo})">${vo.docNo}</a></td>
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

// 요약 카드 렌더링
function renderSummary(voList) {
    let waitCount = 0;
    let okCount = 0;
    let rejectCount = 0;

    for (let i = 0; i < voList.length; i++) {
        const vo = voList[i];

        if (vo.statusCode == 1) {
            waitCount++;
        } else if (vo.statusCode == 2) {
            okCount++;
        } else if (vo.statusCode == 3) {
            rejectCount++;
        }
    }

    const totalTag = document.querySelector("#total-count");
    const waitTag = document.querySelector("#wait-count");
    const okTag = document.querySelector("#ok-count");
    const rejectTag = document.querySelector("#reject-count");

    if (totalTag) totalTag.innerText = voList.length;
    if (waitTag) waitTag.innerText = waitCount;
    if (okTag) okTag.innerText = okCount;
    if (rejectTag) rejectTag.innerText = rejectCount;
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

async function searchDoc(){
    const statusCode = document.querySelector("#statusCode").value;
    const categoryNo = document.querySelector("#categoryNo").value;
    const docNo = document.querySelector("#docNo").value;
    const startDate = document.querySelector("#startDate").value;
    const endDate = document.querySelector("#endDate").value;

    const params = new URLSearchParams({
        statusCode,
        categoryNo,
        docNo,
        startDate,
        endDate,

    });

    const resp = await fetch(`/api/approval/document/search?${params.toString()}`);
    const data = await resp.json();
    const pvo = data.pvo;
    const voList = data.voList;

    setPageArea(pvo)
    renderDocList(voList);
    renderSummary(voList);
}

function setPageArea(pvo){
    const pageArea = document.querySelector(".pagination");
    let str = '';
    if(pvo.startPage != 1){
        str += `<button class="page-btn" onclick="location.href='/approval/document/myDocList/${pvo.startPage-1}'">이전</button>`;
    }
    for(let i = pvo.startPage; i <= pvo.endPage; ++i){
        str += `<button class="page-btn" onclick="location.href='/approval/document/myDocList/${i}'">${i}</button>`;
    }
    if(pvo.endPage < pvo.maxPage){
        str += `<button class="page-btn" onclick="location.href='/approval/document/myDocList/${pvo.endPage+1}'">다음</button>`;
    }
    pageArea.innerHTML = str;
}

async function openDocModal(event, docNo){
    event.preventDefault();

    const resp = await fetch(`/api/approval/document/detail/${docNo}`);
    const doc = await resp.json();
     console.log(doc);
     

    renderDocDetail(doc);
    document.querySelector("#doc-detail-modal").classList.remove("hidden");
}

function closeDocModal(){
    document.querySelector("#doc-detail-modal").classList.add("hidden");
    document.querySelector("#approval-comment").value = "";
}

function renderDocDetail(doc){
    document.querySelector("#detail-form-title").innerText = `${doc.categoryName ?? "문서"} 신청`;

    document.querySelector("#detail-writerDept").innerText = doc.writerDept ?? "-";
    document.querySelector("#detail-writerPosition").innerText = doc.writerPosition ?? "-";
    document.querySelector("#detail-writerName").innerText = doc.writerName ?? "-";

    document.querySelector("#detail-approverPosition").innerText = doc.approverPosition ?? "-";
    document.querySelector("#detail-approverName").innerText = doc.approverName ?? "-";
    document.querySelector("#detail-approverName2").innerText = doc.approverName ?? "-";

    // document.querySelector("#detail-docNo").innerText = doc.docNo ?? "-";
    document.querySelector("#detail-title").innerText = doc.title ?? "-";
    document.querySelector("#detail-referenceDept").innerText = doc.referenceDept ?? "-";
    document.querySelector("#detail-startDate").innerText = formatDate(doc.startDate);
    document.querySelector("#detail-endDate").innerText = formatDate(doc.endDate);
    document.querySelector("#detail-reason").innerText = doc.reason ?? "-";
    document.querySelector("#detail-content").innerText = doc.content ?? "-";

    const attachmentTag = document.querySelector("#detail-attachment");
    if(doc.attachmentName){
        attachmentTag.innerHTML = `<a href="/api/approval/document/file/${doc.docNo}" target="_blank">${doc.attachmentName}</a>`;
    }else{
        attachmentTag.innerText = "-";
    }

    const statusTag = document.querySelector("#detail-statusName");
    statusTag.innerText = doc.statusName ?? "-";
    statusTag.className = "sign-badge";

    if(doc.statusCode == 1){
        statusTag.classList.add("wait");
    }else if(doc.statusCode == 2){
        statusTag.classList.add("ok");
    }else if(doc.statusCode == 3){
        statusTag.classList.add("reject");
    }

    renderModalButtons(doc);
}

function renderModalButtons(doc){
    const footer = document.querySelector("#doc-modal-footer");
    let str = '';

    if(doc.canEdit){
        str += `<button class="modal-btn btn-edit" onclick="editDoc(${doc.docNo})">수정</button>`;
        str += `<button class="modal-btn btn-delete" onclick="deleteDoc(${doc.docNo})">삭제</button>`;
    }

    if(doc.canApprove){
        str += `<button class="modal-btn btn-approve" onclick="approveDoc(${doc.docNo})">승인</button>`;
        str += `<button class="modal-btn btn-reject" onclick="rejectDoc(${doc.docNo})">반려</button>`;
    }

    str += `<button class="modal-btn btn-close" onclick="closeDocModal()">닫기</button>`;

    footer.innerHTML = str;
}

function editDoc(docNo){
    location.href = `/approval/document/edit/${docNo}`;
}

async function deleteDoc(docNo){
    const result = confirm("현재 문서를 삭제하시겠습니까?");
    if(!result) return;

    const resp = await fetch(`/api/approval/document/${docNo}`, {
        method: "DELETE"
    });

    const data = await resp.json();
    alert(data.msg ?? "삭제 완료");
    closeDocModal();
    loadDocList();
}

async function approveDoc(docNo){
    const comment = document.querySelector("#approval-comment").value;

    const resp = await fetch(`/api/approval/document/${docNo}/approve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ approvalComment: comment })
    });

    const data = await resp.json();
    alert(data.msg ?? "승인 완료");
    closeDocModal();
    loadDocList();
}

async function rejectDoc(docNo){
    const comment = document.querySelector("#approval-comment").value;

    const resp = await fetch(`/api/approval/document/${docNo}/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ approvalComment: comment })
    });

    const data = await resp.json();
    alert(data.msg ?? "반려 완료");
    closeDocModal();
    loadDocList();
}