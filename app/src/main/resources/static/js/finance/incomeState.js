
async function incomeState() {

    const journalDate = document.querySelector("#journalDate").value;
    if (!journalDate) {
        alert("조회할 일자를 선택해주세요.");
        return;
    }

    const resp = await fetch(`/journal/incomeStateData?journalDate=${journalDate}`);
    const voList = await resp.json();

    const tbody = document.querySelector("#journalListBody");
    tbody.innerHTML = "";

    if (voList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">조회된 데이터가 없습니다.</td></tr>';
        return;
    }

    let str = "";
    let totalThisMonth = 0;
    let totalPreMonth = 0;
    for (const vo of voList) {

        totalThisMonth += Number(vo.thisMonth || 0);
        totalPreMonth += Number(vo.preMonth || 0);

        str += `
                <tr>
                    <td>${vo.accountName}</td>
                    <td>${Number(vo.thisMonth || 0).toLocaleString()}</td>
                    <td>${Number(vo.preMonth || 0).toLocaleString()}</td>
                </tr>
                `;
    }
    str += `
                <tr class="total">
                    <td>순 이익</td>
                    <td>${totalThisMonth.toLocaleString()} 원</td>
                    <td>${totalPreMonth.toLocaleString()} 원</td>
                </tr>   
                `;


    tbody.innerHTML = str;
}

// 초기 로드 및 날짜 변경 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
    incomeState();
    const dateInput = document.querySelector("#journalDate");
    if (dateInput) {
        dateInput.addEventListener("change", incomeState);
    }
});
