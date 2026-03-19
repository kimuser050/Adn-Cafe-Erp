

async function journalState() {

    const journalDate = document.querySelector("#journalDate").value;

    const resp = await fetch(`/journal/journalStateData?journalDate=${journalDate}`);

    const voList = await resp.json();

    const tbody = document.querySelector("#journalListBody");

    //A:자산, B:자본, C:부채

    let totalA = 0;
    let totalB = 0;
    let totalC = 0;
    let Sub = "";
    let str = "";

    for (const vo of voList) {
        const totalAll = Number(vo.thisMonth || 0);
        const subName = vo.subAccountName || "기타 자산/부채";

        if (Number(vo.accountNo) < 2000) totalA += totalAll;
        else if (Number(vo.accountNo) < 3000) totalB += totalAll;
        else if (Number(vo.accountNo) < 4000) totalC += totalAll;

        if (accNo >= 4000) continue;

        if (Sub !== subName) {
            Sub = subName;
            str += `<tr>
                    <td> ▶ ${Sub}</td>
                    </tr>`;
        }

        str += `
                <tr>
                    <td>${vo.accountName}</td>
                    <td>${totalAll.toLocaleString()}</td>
                </tr>
        `
    }

    str += `
        <tr>
            <td>총계</td>
            <td>${totalA.toLocaleString()} 원</td>
        </tr>
    `;

    tbody.innerHTML = str;

}


// 초기 로드 및 날짜 변경 이벤트 연결
document.addEventListener("DOMContentLoaded", () => {
    journalState();
    const dateInput = document.querySelector("#journalDate");
    if (dateInput) {
        dateInput.addEventListener("change", journalState);
    }
});