/**
 * 페이지 로드 시 실행 (매장명 & 상품목록 불러오기)
 */
window.onload = function() {
    loadStoreName();
    loadItemList();
};

/**
 * 1. 매장명 가져오기
 */
function loadStoreName() {
    fetch('/api/reqreturn/store-name')
        .then(res => {
            if (res.status === 401) throw new Error("UNAUTHORIZED");
            return res.json();
        })
        .then(data => {
            const storeInput = document.getElementById('userDeptNameInput');
            // 서버에서 보낸 'storeName' 키값으로 화면에 셋팅
            if(storeInput && data.storeName) {
                storeInput.value = data.storeName;
            }
        })
        .catch(err => {
            console.error("매장명 로딩 실패:", err);
        });
}

/**
 * 2. 상품 목록 가져와서 드롭다운 채우기
 */
function loadItemList() {
    fetch('/api/reqreturn/item-list')
        .then(res => res.json())
        .then(list => {
            const selectEl = document.getElementById('itemNo');
            if(!selectEl) return;

            list.forEach(item => {
                const option = document.createElement('option');
                option.value = item.itemNo;    // DB PK
                option.textContent = item.itemName; // 화면 표시 이름
                selectEl.appendChild(option);
            });
        })
        .catch(err => console.error("상품목록 로딩 실패:", err));
}

/**
 * 3. 수량 변경 함수 (+, -)
 */
function changeQty(num) {
    const qtyInput = document.getElementById('quantity');
    if (!qtyInput) return;

    let currentVal = parseInt(qtyInput.value) || 1;
    let nextVal = currentVal + num;

    if (nextVal >= 1) {
        qtyInput.value = nextVal;
    }
}

function submitReturn() {
    const itemNo = document.getElementById('itemNo').value; 
    const quantity = document.getElementById('quantity').value;
    const reason = document.getElementById('reason').value;

    // 필수값 검증 (선택사항이지만 권장)
    if (!itemNo) return alert("상품을 선택해주세요.");
    if (!reason.trim()) return alert("사유를 입력해주세요.");

    const returnData = {
        itemNo: itemNo,  // Java ReqVo의 필드명과 일치
        quantity: quantity,
        reason: reason
    };

    fetch('/api/reqreturn/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
    })
    .then(res => res.json())
    .then(data => {
        // 서버에서 result가 "1" 혹은 1로 오는지 확인
        if (data.result == 1 || data.result == "1") { 
            alert("반품 신청이 완료되었습니다!");
            location.href = "/stock/check"; // 목록 페이지로 이동
        } else {
            alert("신청 실패: " + (data.msg || "관리자에게 문의하세요."));
        }
    })
    .catch(err => {
        console.error("에러 발생:", err);
        alert("서버 연결에 실패했습니다.");
    });
}