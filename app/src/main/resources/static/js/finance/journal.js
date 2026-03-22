// 검색 자동완성

window.onload = function () {
    getAccountList();
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


    const journalDate = document.querySelector("#journalDate").value;
    if (!journalDate) {
        alert("전표 일자를 선택해주세요");
        return;
    }

    const debitInput = document.querySelector(".debitInput").value;
    if (!debitInput) {
        alert("목록에 없는 차변 계정입니다. 자동완성 목록에서 선택해주세요.");
        return;
    }

    const option = document.querySelectorAll("#accountOptions option");
    let accountNo = "";
    for (let opt of option) {
        if (opt.value === debitInput) {
            accountNo = opt.dataset.no;
            break;
        }
    }

    const creditInput = document.querySelector(".creditInput").value;
    if (!creditInput) {
        alert("목록에 없는 대변 계정입니다. 자동완성 목록에서 선택해주세요.");
        return;
    }
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
    if (debit <= 0 || credit <= 0) {
        alert("금액은 0원보다 커야 합니다.");
        return;
    }
    if (debit !== credit) {
        alert("차변 금액과 대변 금액이 일치해야 합니다.");
        return;
    }

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

// 전표등록 새로고침

function clear() {
    document.querySelector(".debitInput").value = "";
    document.querySelector("#debit").value = "0";
    document.querySelector(".creditInput").value = "";
    document.querySelector("#credit").value = "0";
}


// 전표리스트

async function selectJournal() {
    const journalDate = document.querySelector("#journalDate").value;
    if (!journalDate) {
        alert("조회할 일자를 선택해주세요.");
        return;
    }

    const resp = await fetch(`/journal/selectJournal?journalDate=${journalDate}`);

    const voList = await resp.json();

    if (resp.ok) {
        const tbody = document.querySelector("#journalListBody");
        let str = "";
        if (voList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">조회된 전표가 없습니다.</td></tr>`;
            total([]); // 총계 0원 처리
            return;
        }

        for (let i = 0; i < voList.length; i += 2) {
            const debitVo = voList[i];
            const creditVo = voList[i + 1];

            str += `
                <tr class="new-group">
                    <td rowspan="2">${debitVo.journalDate.substring(0, 10)}</td>
                    <td rowspan="2">${debitVo.journalNo}</td>
                    <td>${debitVo.accountName}</td>
                    <td>${Number(debitVo.debit).toLocaleString()}</td>
                    <td rowspan="2">${debitVo.writerName}</td>
                    <td rowspan="2">
                    <div class="action-cell">
                        <button type="button" class="btn-action edit" 
                        onclick="openUpdateModal(
                        '${debitVo.journalNo}'
                        , '${debitVo.accountName}', '${Number(debitVo.debit).toLocaleString()}'
                        , '${creditVo.accountName}', '${Number(creditVo.credit).toLocaleString()}'
                        , '${debitVo.journalDate}'
                        )">수정</button>
                
                        <button type="button" class="btn-action del" 
                        onclick="deleteJournal('${debitVo.journalNo}')">삭제</button>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>${creditVo.accountName}</td>
                    <td>${Number(creditVo.credit).toLocaleString()}</td>
                </tr>
                `;
        }

        tbody.innerHTML = str;
        total(voList);
    } else {
        alert("전표조회 실패");
    }
}

// 총금액 보여주기

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

// 수정 모달창

function openUpdateModal(no, debitname, debit, creditname, credit, date) {
    document.querySelector("#modalJournalNo").value = no;
    document.querySelector("#modalDebitAccountName").value = debitname;
    document.querySelector("#modalDebit").value = debit;
    document.querySelector("#modalCreditAccountName").value = creditname;
    document.querySelector("#modalCredit").value = credit;
    document.querySelector("#modalDate").value = date.substring(0, 10);

    document.querySelector("#updateModal").classList.add("active");
}

// 수정 모달창 닫기

function closeModal() {
    document.querySelector("#updateModal").classList.remove("active");
}

//전표 수정

async function updateJournal() {
    const journalNo = document.querySelector("#modalJournalNo").value;
    const journalDate = document.querySelector("#modalDate").value;
    if (!journalDate) { alert("일자를 선택해주세요."); return; }

    const modalDebitAccountName = document.querySelector("#modalDebitAccountName").value;
    if (!modalDebitAccountName) { alert("차변 계정을 입력해주세요. 자동완성 목록에서 선택해주세요."); return; }

    const option = document.querySelectorAll("#accountOptions option");
    let accountNo = "";
    for (let opt of option) {
        if (opt.value === modalDebitAccountName) {
            accountNo = opt.dataset.no;
            break;
        }
    }

    const debit = document.querySelector("#modalDebit").value;

    const modalCreditAccountName = document.querySelector("#modalCreditAccountName").value;
    if (!modalCreditAccountName) { alert("대변 계정을 입력해주세요. 자동완성 목록에서 선택해주세요."); return; }

    const option2 = document.querySelectorAll("#accountOptions option");
    let accountNo2 = "";
    for (let opt of option2) {
        if (opt.value === modalCreditAccountName) {
            accountNo2 = opt.dataset.no;
            break;
        }
    }
    const credit = document.querySelector("#modalCredit").value;

    if (debit <= 0 || credit <= 0) {
        alert("금액은 0원보다 커야 합니다."); return;
    }
    if (debit !== credit) {
        alert("차변 금액과 대변 금액이 일치해야 합니다."); return;
    }

    const data = [
        {
            journalNo: journalNo,
            accountNo: accountNo,
            journalDate: journalDate,
            debit: debit,
            credit: 0,
            writerNo: "200001"
        },
        {
            journalNo: journalNo,
            accountNo: accountNo2,
            journalDate: journalDate,
            debit: 0,
            credit: credit,
            writerNo: "200001"
        }
    ]

    console.log("전송 데이터:", data);

    const resp = await fetch(`/journal/updateJournal`, {
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    if (resp.ok) {
        alert("전표 수정 성공");
        closeModal();
        selectJournal();
        clear();
    } else {
        alert("전표 수정 실패");
    }
}

// 전표삭제

async function deleteJournal(no) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const resp = await fetch(`/journal/delJournal?journalNo=${no}`, {
        method: "put"
    });

    if (resp.ok) {
        alert("전표 삭제 성공");
        selectJournal();
    } else {
        alert("전표 삭제 실패");
    }
}



// 총계정원장
async function findAccount(page = 1) {
    const selectAccount = document.querySelector("#accountInput").value;
    if (!selectAccount) {
        alert("조회할 계정을 입력해주세요. 자동완성 목록에서 선택해주세요.");
        return;
    }
    const option = document.querySelectorAll("#accountOptions option");
    let accountNo = "";
    for (let opt of option) {
        if (opt.value === selectAccount) {
            accountNo = opt.dataset.no;
            break;
        }
    }

    const resp = await fetch(`/journal/${accountNo}?page=${page}`)
    const data = await resp.json();
    const voList = data.journalList;
    const pvo = data.pvo;

   console.log(pvo);

   const pagingArea = document.querySelector("#pagingArea");
    const tbody = document.querySelector("#journalListBody");

    if (voList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">해당 계정의 거래 내역이 없습니다.</td></tr>`;
        renderPagination(pvo);
        return;
    }

    let str = "";
    for (const vo of voList) {
        str += `
            <tr>
                <td>${vo.journalDate}</td>
                <td>${Number(vo.debit).toLocaleString()}</td>
                <td>${Number(vo.credit).toLocaleString()}</td>
                <td>${vo.accountName}</td>
            </tr>
        `
    }
        tbody.innerHTML = str;

        renderPagination(pvo);
    
}

// 페이징 버튼을 그리는 함수
function renderPagination(pvo) {
    const pagingArea = document.querySelector("#pagination-area"); 
    
    if(!pagingArea) return;

    let pagingStr = "";

    // 숫자 버튼 생성 루프
    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        const isActive = (i === pvo.currentPage) ? 'active' : '';
        
        pagingStr += `
            <div class="page-num ${isActive}" onclick="findAccount(${i})">
                ${i}
            </div>`;
    }

    pagingArea.innerHTML = pagingStr;
}

//월계표

async function findMonthAccount() {

    const journalDate = document.querySelector("#journalDate").value;
    if (!journalDate) { alert("조회할 월을 선택해주세요."); return; }

    const resp = await fetch(`/journal/monthListData?journalDate=${journalDate}`);
    const voList = await resp.json();

    const tbody = document.querySelector("#journalListBody");

    if (voList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">조회된 내역이 없습니다.</td></tr>`;
        return;
    }

    let str = "";
    for (const vo of voList) {
        str += `
            <tr>
                <td>${Number(vo.debit).toLocaleString()}</td>
                <td>${vo.accountName}</td>
                <td>${Number(vo.credit).toLocaleString()}</td>
            </tr>
        `
    }
    tbody.innerHTML = str;
}

// 일계표

async function findDailyAccount() {
    const journalDate = document.querySelector("#journalDate").value;
    if (!journalDate) { alert("조회할 일자를 선택해주세요."); return; }

    const resp = await fetch(`/journal/dailyListData?journalDate=${journalDate}`);
    const voList = await resp.json();

    const tbody = document.querySelector("#journalListBody");

    if (voList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">조회된 내역이 없습니다.</td></tr>`;
        return;
    }

    let str = "";
    for (const vo of voList) {
        str += `
            <tr>
                <td>${Number(vo.debit).toLocaleString()}</td>
                <td>${vo.accountName}</td>
                <td>${Number(vo.credit).toLocaleString()}</td>
            </tr>
        `
    }
    tbody.innerHTML = str;
}