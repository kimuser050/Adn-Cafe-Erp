/**
 * 수량 변경 함수
 */
function changeQty(num) {
    const qtyInput = document.getElementById('quantity');
    let currentVal = parseInt(qtyInput.value) || 0;
    if (currentVal + num >= 0) {
        qtyInput.value = currentVal + num;
    }
}

/**
 * 반품 정보 저장 전송
 */
function submitReturn() {
    // Vo 필드명과 일치하게 객체 생성
    const returnData = {
        storeCode: document.getElementById('storeCode').value,
        productName: document.getElementById('productName').value,
        quantity: document.getElementById('quantity').value,
        reason: document.getElementById('reason').value,
        status: document.getElementById('status').value
    };

    // 간단한 유효성 검사
    if(!returnData.storeCode || !returnData.productName) {
        alert("매장과 상품명은 필수 입력 사항입니다.");
        return;
    }

    // 서버 API 호출
    fetch('/api/reqreturn/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
    })
    .then(res => res.json())
    .then(data => {
        if(data.result === "1") {
            alert("반품 신청이 완료되었습니다!");
            location.href = "/stock/return/list"; // 성공 시 목록 이동
        } else {
            alert("저장 실패: " + data.msg);
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("서버 연결에 실패했습니다.");
    });
}
/**
 * 수량 변경 로직 (+, -)
 */
function changeQty(num) {
    const qtyInput = document.getElementById('quantity');
    let val = parseInt(qtyInput.value) || 1;
    if (val + num >= 1) {
        qtyInput.value = val + num;
    }
}

function submitReturn() {
    alert("반품 신청 데이터가 서버로 전송되었습니다!");
}