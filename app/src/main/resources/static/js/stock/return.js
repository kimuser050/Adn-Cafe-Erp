/**
 * 수량 변경 함수 (+, -)
 */
function changeQty(num) {
    const qtyInput = document.getElementById('quantity');
    let currentVal = parseInt(qtyInput.value) || 1;
    if (currentVal + num >= 1) { // 1개 미만으로 안 내려가게
        qtyInput.value = currentVal + num;
    }
}

/**
 * 반품 정보 서버 전송
 */
function submitReturn() {
    const returnData = {
        storeCode: document.getElementById('storeCode').value,
        productName: document.getElementById('productName').value,
        quantity: document.getElementById('quantity').value,
        reason: document.getElementById('reason').value,
        enrollDate: document.getElementById('enrollDate').value
        // status가 HTML에 없다면 기본값 "대기" 등으로 처리하거나 생략
    };

    if(!returnData.storeCode || !returnData.productName) {
        alert("매장과 상품명은 필수 입력 사항입니다.");
        return;
    }

    fetch('/api/reqreturn/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnData)
    })
    .then(res => res.json())
    .then(data => {
        if(data.result === "1" || data.status === "success") {
            alert("반품 신청이 완료되었습니다!");
            location.href = "/stock/return/list";
        } else {
            alert("저장 실패: " + (data.msg || "알 수 없는 오류"));
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("서버 연결에 실패했습니다.");
    });
}