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