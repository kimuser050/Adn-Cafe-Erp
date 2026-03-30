/**
 * [Coffee Prince ERP - 반품 신청 JS]
 */

window.onload = function() {
    loadStoreName();
    loadItemList();
    setCurrentDate(); // 화면에 오늘 날짜 표시용
};

/**
 * 0. 오늘 날짜 화면 표시용 (YYYY-MM-DD)
 */
function setCurrentDate() {
    const enrollDateInput = document.getElementById('enrollDate');
    if (enrollDateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        enrollDateInput.value = `${year}-${month}-${day}`;
    }
}

/**
 * 1. 매장명 가져오기 (기존 유지)
 */
function loadStoreName() {
    fetch('/api/reqreturn/store-name')
        .then(res => res.json())
        .then(data => {
            const storeInput = document.getElementById('userDeptNameInput');
            if(storeInput && data.storeName) storeInput.value = data.storeName;
        })
        .catch(err => console.error("매장명 로딩 실패:", err));
}

/**
 * 2. 상품 목록 가져오기 (기존 유지)
 */
function loadItemList() {
    fetch('/api/reqreturn/item-list')
        .then(res => res.json())
        .then(list => {
            const selectEl = document.getElementById('itemNo');
            if(!selectEl) return;
            list.forEach(item => {
                const option = document.createElement('option');
                option.value = item.itemNo;
                option.textContent = item.itemName;
                selectEl.appendChild(option);
            });
        })
        .catch(err => console.error("상품목록 로딩 실패:", err));
}

/**
 * 3. 수량 조절 (기존 유지)
 */
function changeQty(num) {
    const qtyInput = document.getElementById('quantity');
    let nextVal = (parseInt(qtyInput.value) || 1) + num;
    if (nextVal >= 1) qtyInput.value = nextVal;
}

/**
 * 4. 반품 신청 전송 (Mapper와 필드 맞춤)
 */
function submitReturn() {
    const itemNo = document.getElementById('itemNo').value;
    const quantity = document.getElementById('quantity').value;
    const reason = document.getElementById('reason').value;

    if (!itemNo) return alert("상품을 선택해주세요.");
    if (!reason.trim()) return alert("사유를 입력해주세요.");

    // 💥 중요: 서버(Mapper)에서 SYSDATE를 쓰기로 했으므로 날짜 데이터는 제외해도 됩니다.
    const returnData = {
        itemNo: itemNo,   // Mapper의 #{itemNo}
        quantity: quantity, // Mapper의 #{quantity}
        reason: reason      // Mapper의 #{reason}
    };

    if(!confirm("반품 신청을 진행하시겠습니까?")) return;

    fetch('/api/reqreturn/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.result == 1) {
            alert("반품 신청이 완료되었습니다!");
            location.href = "/stock/checksList";
        } else {
            alert("신청 실패: " + (data.msg || "오류가 발생했습니다."));
        }
    })
    .catch(err => alert("서버 연결 실패"));
}