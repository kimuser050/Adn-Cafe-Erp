document.addEventListener("DOMContentLoaded", () => {
    // 첫 페이지 로드
    loadList(1);
});

// 1. 목록 로드 (페이징 데이터 포함)
function loadList(page) {
    fetch(`/api/itemcheck/list?currentPage=${page}`)
        .then(res => res.json())
        .then(data => {
            const listBody = document.querySelector("#list-body");
            if (!listBody) return;
            
            listBody.innerHTML = "";

            // 서버에서 넘어온 voList 반복 처리
            data.voList.forEach(vo => {
                const tr = document.createElement("tr");
                // 상태값 한글 변환 매핑
                const statusMap = { 'W': '대기', 'A': '승인', 'R': '반려' };
                
                tr.innerHTML = `
                    <td>${vo.returnNo}</td>
                    <td>${vo.itemName || '이름 없음'}</td>
                    <td>${vo.storeName}</td>
                    <td><span class="status-badge ${vo.status}">${statusMap[vo.status] || vo.status}</span></td>
                    <td>${vo.processResult || '-'}</td>
                    <td>${vo.createdAt || '-'}</td>
                `;
                // 행 클릭 시 상세 보기 호출
                tr.onclick = () => loadDetail(vo.returnNo);
                listBody.appendChild(tr);
            });

            // 페이징 버튼 생성 함수 호출
            renderPagination(data.pvo);
        })
        .catch(err => console.error("목록 로드 실패:", err));
}

// 2. 상세 조회
function loadDetail(no) {
    fetch(`/api/itemcheck/${no}`)
        .then(res => res.json())
        .then(data => {
            const vo = data.vo;
            
            // JSP의 각 input id에 데이터 매칭
            document.querySelector("#returnNo").value = vo.returnNo;
            document.querySelector("#storeName").value = vo.storeName;
            document.querySelector("#productName").value = vo.itemName; // 상품번호 대신 이름 출력
            document.querySelector("#quantity").value = vo.quantity;
            document.querySelector("#createdAt").value = vo.createdAt;
            document.querySelector("#reason").value = vo.reason;
            document.querySelector("#status").value = vo.status;

            // 섹션 전환
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

    if(!confirm("검수 상태를 저장하시겠습니까?")) return;

    fetch("/api/itemcheck", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        if(result.result == 1) { 
            alert("검수 상태가 변경되었습니다.");
            closeDetail();
            loadList(1); // 1페이지로 새로고침
        } else {
            alert("저장에 실패했습니다.");
        }
    });
}

// 4. 상세 닫기
function closeDetail() {
    document.querySelector("#list-section").style.display = "block";
    document.querySelector("#detail-section").style.display = "none";
}

// 5. 페이징 버튼 생성 (중요: pvo 객체 사용)
function renderPagination(pvo) {
    const container = document.querySelector("#pagination");
    if (!container) return;
    
    container.innerHTML = "";

    // 이전 페이지 버튼 (필요 시)
    if (pvo.startPage > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.innerText = "이전";
        prevBtn.onclick = () => loadList(pvo.startPage - 1);
        container.appendChild(prevBtn);
    }

    // 숫자 버튼 생성 루프
    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = (i === pvo.currentPage) ? "page-btn active" : "page-btn";
        btn.onclick = () => loadList(i);
        container.appendChild(btn);
    }

    // 다음 페이지 버튼 (필요 시)
    if (pvo.endPage < pvo.maxPage) {
        const nextBtn = document.createElement("button");
        nextBtn.innerText = "다음";
        nextBtn.onclick = () => loadList(pvo.endPage + 1);
        container.appendChild(nextBtn);
    }
}