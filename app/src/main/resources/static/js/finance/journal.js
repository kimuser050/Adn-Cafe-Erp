window.onload = getAccountList();

async function getAccountList() {

    const resp = await fetch(`/journal/getAccountList`)

    const data = await resp.json();

    const accountList = document.querySelector("#accountOptions");

    let str = "";
    for (const vo of data) {
        str += `<option value="${vo.accountName}" data-no="${vo.accountNo}"></option>`;
    }

    accountList.innerHTML = str;
}

function addRow() {

    const container = document.querySelector("#entryRowContainer");

    const newRow = document.createElement("div");
    newRow.className = "entry-row";

    newRow.innerHTML = `
                    <input type="text" class="account-select" list="accountOptions"
                        placeholder="계정선택">
                    <input type="number" class="amount-input debit" oninput="calc()" value="0"
                        step="10000">

                    <input type="text" class="account-select" list="accountOptions"
                        placeholder="계정선택">
                    <input type="number" class="amount-input credit" oninput="calc()" value="0"
                        step="10000">
                     `
        ;
    container.appendChild(newRow);

}












// 총계정원장
async function findAccount() {
    const selectAccount = document.querySelector("#accountInput").value;
    const option = document.querySelectorAll("#accountOptions option");
    let accountNo = "";
    for (let opt of option) {
        if (opt.value === selectAccount) {
            accountNo = opt.dataset.no;
            break;
        }
    }

    const resp = await fetch(`/journal/${accountNo}`)
    const voList = await resp.json();

    const tbody = document.querySelector("#journalListBody");

    let str = "";
    for (const vo of voList) {
        str += `
            <tr>
                <td>${vo.journalDate}</td>
                <td>${vo.credit}</td>
                <td>${vo.debit}</td>
                <td>${vo.accountName}</td>
            </tr>
        `
        tbody.innerHTML = str;
    }
}


//월계표

async function findMonthAccount() {

    const journalDate = document.querySelector("#journalDate").value;

    const resp = await fetch(`/journal/monthListData?journalDate=${journalDate}`);
    const voList = await resp.json();

    const tbody = document.querySelector("#journalListBody");

    let str = "";
    for (const vo of voList) {
        str += `
            <tr>
                <td>${vo.credit}</td>
                <td>${vo.accountName}</td>
                <td>${vo.debit}</td>
            </tr>
        `
    }
    tbody.innerHTML = str;
}

async function findDailyAccount() {
    const journalDate = document.querySelector("#journalDate").value;

    const resp = await fetch(`/journal/dailyListData?journalDate=${journalDate}`);
    const voList = await resp.json();

    const tbody = document.querySelector("#journalListBody");

    let str = "";
    for (const vo of voList) {
        str += `
            <tr>
                <td>${vo.credit}</td>
                <td>${vo.accountName}</td>
                <td>${vo.debit}</td>
            </tr>
        `
    }
    tbody.innerHTML = str;
}