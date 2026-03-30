document.addEventListener("DOMContentLoaded", () => {
    loadProducts(1);

    const searchInput = document.querySelector("#searchKeyword");
    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") loadProducts(1);
        });
    }
});

// 상품 목록 조회
function loadProducts(page = 1) {
    const keyword = document.querySelector("#searchKeyword").value.trim();
    const url = `/api/product/list?currentPage=${page}&keyword=${encodeURIComponent(keyword)}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#product-list-body");
            tbody.innerHTML = "";

            if (!data.voList || data.voList.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" style="padding:100px; text-align:center; color:#999;">검색 결과가 없습니다.</td></tr>`;
                renderPagination(null);
                return;
            }

            data.voList.forEach(vo => {
                const useStatus = vo.useYn || 'Y';
                const price = Number(vo.salePrice || 0).toLocaleString();

                tbody.innerHTML += `
                    <tr onclick="getDetail('${vo.productsNo}')">
                        <td>${vo.productsNo}</td>
                        <td style="text-align:left; padding-left:30px;">${vo.productsName}</td>
                        <td>${price}원</td>
                        <td><span class="badge ${useStatus === 'Y' ? 'active' : 'inactive'}">${useStatus}</span></td>
                        <td>${vo.createdAt || '-'}</td>
                    </tr>
                `;
            });
            renderPagination(data.pvo);
        })
        .catch(err => console.error("로딩 중 오류 발생:", err));
}

// 페이징 처리
function renderPagination(pvo) {
    const container = document.querySelector("#pagination");
    container.innerHTML = "";
    if (!pvo) return;

    let html = "";
    if (pvo.startPage > 1) html += `<button onclick="loadProducts(${pvo.startPage - 1})">이전</button>`;
    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        const active = (i === pvo.currentPage) ? "active" : "";
        html += `<button class="${active}" onclick="loadProducts(${i})">${i}</button>`;
    }
    if (pvo.endPage < pvo.maxPage) html += `<button onclick="loadProducts(${pvo.endPage + 1})">다음</button>`;
    container.innerHTML = html;
}

// 상세 조회 (삭제 버튼 제어 로직 제거)
function getDetail(no) {
    if(!no || no === 'undefined') return;

    fetch(`/api/product/${no}`)
        .then(res => res.json())
        .then(data => {
            const vo = data.vo;
            document.querySelector("#m-productsNo").value = vo.productsNo;
            document.querySelector("#m-productsName").value = vo.productsName;
            document.querySelector("#m-salePrice").value = vo.salePrice;

            selectStatus(vo.useYn);

            document.querySelector("#modalTitle").innerText = "제품 정보 수정";
            document.querySelector("#btn-insert").style.display = "none";
            document.querySelector("#btn-update").style.display = "inline-block";

            // 삭제 버튼(btn-delete) 관련 코드가 삭제되었습니다.
            document.querySelector("#productModal").style.display = "flex";
        })
        .catch(err => alert("상세 정보를 불러오지 못했습니다."));
}

// 등록 모달 열기 (삭제 버튼 제어 로직 제거)
function openInsertModal() {
    document.querySelector("#m-productsNo").value = "";
    document.querySelector("#m-productsName").value = "";
    document.querySelector("#m-salePrice").value = "";

    selectStatus('Y');

    document.querySelector("#modalTitle").innerText = "신규 제품 등록";
    document.querySelector("#btn-insert").style.display = "inline-block";
    document.querySelector("#btn-update").style.display = "none";

    // 삭제 버튼(btn-delete) 관련 코드가 삭제되었습니다.
    document.querySelector("#productModal").style.display = "flex";
}

// 상태 버튼 선택 (Y/N)
function selectStatus(val) {
    document.querySelectorAll('.btn-status').forEach(btn => btn.classList.remove('selected'));
    const targetBtn = document.querySelector(`.btn-status[data-value="${val}"]`);
    if (targetBtn) targetBtn.classList.add('selected');

    const hiddenInput = document.querySelector("#m-useYn");
    if (hiddenInput) hiddenInput.value = val;
}

// 저장 및 수정 실행
function submitProduct(method) {
    const vo = {
        productsNo: document.querySelector("#m-productsNo").value,
        productsName: document.querySelector("#m-productsName").value,
        salePrice: document.querySelector("#m-salePrice").value,
        useYn: document.querySelector("#m-useYn").value
    };

    const url = (method === 'POST') ? '/api/product/insert' : '/api/product';

    fetch(url, {
        method: method === 'POST' ? 'POST' : 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vo)
    })
    .then(res => {
        if (!res.ok) throw new Error("처리 실패");
        alert("처리가 완료되었습니다.");
        closeModal();
        loadProducts(1);
    })
    .catch(err => alert("오류가 발생했습니다."));
}

// 모달 닫기
function closeModal() {
    document.querySelector("#productModal").style.display = "none";
}