// [1] 품목 조회
async function itemVoList(){
    try {
        const resp = await fetch(`/api/stock/itemList`);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        const voList = data.voList;

        const tbodyTag = document.querySelector("#itemList");
        let str = "";

        for(const vo of voList){
            str += `
                <tr onclick="showDetail(${vo.itemNo})">
                    <td>${vo.itemNo}</td>
                    <td>${vo.itemName}</td>
                    <td>${Number(vo.unitPrice).toLocaleString()}</td>
                    <td>2026/03/03</td> <td>${vo.stock}</td>
                    <td>${vo.location}</td>
                    <td>${vo.activeYn ?? 'Y'}</td>
                </tr>
            `;
        }
        tbodyTag.innerHTML = str;
    } catch (err) {
        console.error(err);
        alert("목록을 가져오는 중 오류 발생");
    }
}

// [2] 상세조회 모달
function showDetail(itemNo) {
    fetch(`/api/stock/${itemNo}`)
    .then(resp => resp.json())
    .then(data => {
        const vo = data.vo;
        document.querySelector("#modalItemNo").value = vo.itemNo;
        document.querySelector("#modalItemName").value = vo.itemName;
        document.querySelector("#modalUnitPrice").value = vo.unitPrice;
        document.querySelector("#modalStock").value = vo.stock;
        document.querySelector("#modalLocation").value = vo.location;
        document.querySelector("#modalActiveYn").value = vo.activeYn ?? 'Y';
        document.querySelector("#itemDetailModal").style.display = "block";
    });
}

// [3] 수정 (작성하신 기능 유지)
async function updateItem() {
    const vo = {
        itemNo: document.querySelector("#modalItemNo").value,
        itemName: document.querySelector("#modalItemName").value,
        unitPrice: document.querySelector("#modalUnitPrice").value,
        stock: document.querySelector("#modalStock").value,
        location: document.querySelector("#modalLocation").value,
        activeYn: document.querySelector("#modalActiveYn").value
    };
    const resp = await fetch("/api/stock", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vo)
    });
    if(resp.ok) {
        alert("수정 되었습니다.");
        document.querySelector("#itemDetailModal").style.display = "none";
        itemVoList();
    }
}

// [4] 이벤트 초기화
document.addEventListener("DOMContentLoaded", () => {
    itemVoList();
    document.querySelectorAll(".close-modal").forEach(btn => {
        btn.onclick = () => document.querySelector("#itemDetailModal").style.display = "none";
    });
    window.onclick = (e) => {
        if(e.target.classList.contains('modal')) e.target.style.display = "none";
    }
});