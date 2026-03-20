document.addEventListener("DOMContentLoaded", () => {
    loadList(1);
});

// 1. 목록 로드 (페이징 포함)
function loadList(page) {
    fetch(`/api/itemcheck/list?currentPage=${page}`)
        .then(res => res.json())
        .then(data => {
            const listBody = document.querySelector("#list-body");
            listBody.innerHTML = "";

            data.voList.forEach(vo => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${vo.returnNo}</td>
                    <td>${vo.productName}</td>
                    <td>${vo.storeName}</td>
                    <td><span class="status-badge ${vo.status}">${vo.status}</span></td>
                    <td>${vo.processResult || '-'}</td>
                    <td>${vo.createdAt}</td>
                `;
                tr.onclick = () => loadDetail(vo.returnNo);
                listBody.appendChild(tr);
            });
            renderPagination(data.pvo);
        });
}

// 2. 상세 조회
function loadDetail(no) {
    fetch(`/api/itemcheck/${no}`)
        .then(res => res.json())
        .then(data => {
            const vo = data.vo;
            document.querySelector("#returnNo").value = vo.returnNo;
            document.querySelector("#storeName").value = vo.storeName;
            document.querySelector("#productName").value = vo.productName;
            document.querySelector("#quantity").value = vo.quantity;
            document.querySelector("#createdAt").value = vo.createdAt;
            document.querySelector("#reason").value = vo.reason;
            document.querySelector("#status").value = vo.status;

            document.querySelector("#list-section").style.display = "none";
            document.querySelector("#detail-section").style.display = "block";
        });
}

// 3. 수정 저장 (PUT)
function saveCheck() {
    const data = {
        returnNo: document.querySelector("#returnNo").value,
        status: document.querySelector("#status").value
    };

    fetch("/api/itemcheck", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if(result.result === 1) {
            alert("검수 상태가 변경되었습니다.");
            closeDetail();
            loadList(1);
        }
    });
}

function closeDetail() {
    document.querySelector("#list-section").style.display = "block";
    document.querySelector("#detail-section").style.display = "none";
}

// 페이징 버튼 생성
function renderPagination(pvo) {
    const container = document.querySelector("#pagination");
    container.innerHTML = "";
    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === pvo.currentPage) ? "active" : "";
        btn.onclick = () => loadList(i);
        container.appendChild(btn);
    }
}