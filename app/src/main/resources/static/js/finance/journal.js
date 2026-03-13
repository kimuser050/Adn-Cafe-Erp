window.onload = getAccountList();

async function getAccountList() {

    const resp = await fetch(`/journal/getAccountList`)

    const data = await resp.json();

    const accountList = document.querySelector("#accountOptions");

    let str = "";
    for (const vo of data) {
        str += `<option value="${vo.accountName}">${vo.accountNo}</option>`;
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