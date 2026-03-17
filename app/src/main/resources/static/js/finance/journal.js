// 검색 자동완성

window.onload = function () {
    getAccountList();
    selectJournal();
}

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


// 전표등록
async function insertJournal() {

    const debitInput = document.querySelector(".debitInput").value;
    const option = document.querySelectorAll("#accountOptions option");
    let accountNo = "";
    for (let opt of option) {
        if (opt.value === debitInput) {
            accountNo = opt.dataset.no;
            break;
        }
    }

    const creditInput = document.querySelector(".creditInput").value;
    const option2 = document.querySelectorAll("#accountOptions option");
    let accountNo2 = "";
    for (let opt of option2) {
        if (opt.value === creditInput) {
            accountNo2 = opt.dataset.no;
            break;
        }
    }


    const debit = document.querySelector("#debit").value;
    const credit = document.querySelector("#credit").value;
    const journalDate = document.querySelector("#journalDate").value;

    const data = [
        {
            accountNo: accountNo,
            journalDate: journalDate,
            debit: debit,
            credit: 0,
            writerNo: "200001"
        },
        {
            accountNo: accountNo2,
            journalDate: journalDate,
            debit: 0,
            credit: credit,
            writerNo: "200001"
        }
    ]

    const resp = await fetch(`/journal/insertJournal`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (resp.ok) {
        alert("전표등록 성공");
    } else {
        alert("전표등록 실패");
    }

    selectJournal();
    clear();
}

// 전표새로고침

function clear() {
    document.querySelector(".debitInput").value = "";
    document.querySelector("#debit").value = "0";
    document.querySelector(".creditInput").value = "";
    document.querySelector("#credit").value = "0";
}


// 전표리스트

async function selectJournal() {
    const journalDate = document.querySelector("#journalDate").value;
    const resp = await fetch(`/journal/selectJournal?journalDate=${journalDate}`);

    const voList = await resp.json();
    if (resp.ok) {
        const tbody = document.querySelector("#journalListBody");
        let str = "";
        for (const vo of voList) {
            str += `
                <tr>
                    <td><input type="checkbox"></td>
                    <td>${vo.journalDate}</td>
                    <td>${vo.journalNo}</td>
                    <td>${vo.accountName}</td>
                    <td>${vo.credit || vo.debit}</td>
                    <td>${vo.writerName}</td>
                </tr>
        `
        }

        tbody.innerHTML = str;
        total(voList);
    } else {
        alert("전표조회 실패");
    }
}


function total(voList) {

    const totalDebit = document.querySelector("#totalDebit");
    let debitsum = 0;
    for (const vo of voList) {
        debitsum += Number(vo.debit || 0);
    }
    totalDebit.value = debitsum;

    const totalCredit = document.querySelector("#totalCredit");
    let creditsum = 0;
    for (const vo of voList) {
        creditsum += Number(vo.credit || 0);
    }
    totalCredit.value = creditsum;

    const diffAmount = document.querySelector("#diffAmount");
    const diff = debitsum - creditsum;
    diffAmount.value = diff;

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
                <td>${vo.debit}</td>
                <td>${vo.credit}</td>
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
                <td>${vo.debit}</td>
                <td>${vo.accountName}</td>
                <td>${vo.credit}</td>
            </tr>
        `
    }
    tbody.innerHTML = str;
}

// 일계표

async function findDailyAccount() {
    const journalDate = document.querySelector("#journalDate").value;

    const resp = await fetch(`/journal/dailyListData?journalDate=${journalDate}`);
    const voList = await resp.json();

    const tbody = document.querySelector("#journalListBody");

    let str = "";
    for (const vo of voList) {
        str += `
            <tr>
                <td>${vo.debit}</td>
                <td>${vo.accountName}</td>
                <td>${vo.credit}</td>
            </tr>
        `
    }
    tbody.innerHTML = str;
}