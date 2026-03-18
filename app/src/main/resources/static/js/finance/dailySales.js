window.onload = function () {
    getDailySales();
    getPayment();
    getStoreList();
}



//제품명 리스트 가져오기

async function getDailySales() {
    const resp = await fetch(`/dailySales/getProductList`);
    const voList = await resp.json();

    const productOptions = document.querySelector("#productOptions");

    let str = "";
    for (const vo of voList) {
        str += `<option value="${vo.productsName}" data-no="${vo.productsNo}"></option>`
    }

    productOptions.innerHTML = str;
}


//결제방법 리스트 가져오기

function getPayment() {
    const paymentOptions = document.querySelector("#paymentOptions");

    let str = `
            <option value="현금" data-name="C"></option>
            <option value="카드" data-name="D"></option>
        `;

    paymentOptions.innerHTML = str;
}


//매장명 리스트 가져오기
async function getStoreList() {
    const resp = await fetch(`/dailySales/getStoreList`);
    const voList = await resp.json();
    const storeOptions = document.querySelector("#storeOptions");

    let str = "";
    for (const vo of voList) {
        str += `<option value="${vo.storeName}" data-no="${vo.storeNo}"></option>`
    }

    storeOptions.innerHTML = str;
}



// 매출 조회

async function salesList() {
    const salesDate = document.querySelector("#salesDate").value;
    const storeInput = document.querySelector(".storeInput").value;
    const storeOptions = document.querySelectorAll("#storeOptions option");
    let storeNo = "";
    for (let opt of storeOptions) {
        if (opt.value === storeInput) {
            storeNo = opt.dataset.no;
            break;
        }
    }

    const resp = await fetch(`/dailySales/listDaily?salesDate=${salesDate}`);
    const data = await resp.json();
    const voList = data.voList;

    const tbody = document.querySelector(".body tbody")

    let str = "";
    for (const vo of voList) {
        str += `
                <tr>
                    <td>${vo.salesDate}</td>
                    <td>${vo.totalSales}</td>
                    <td><button onclick="editSales();">수정하기</button></td>
                    <td><button onclick="delSales();">삭제하기</button></td>
                </tr>
        `
    }

    tbody.innerHTML = str;

}


//매출 등록

async function insertDaily() {

    const storeInput = document.querySelector(".storeInput").value;
    const storeOptions = document.querySelectorAll("#storeOptions option");
    let storeNo = "";
    for (let opt of storeOptions) {
        if (opt.value === storeInput) {
            storeNo = opt.dataset.no;
            break;
        }
    }

    const salesDate = document.querySelector("#salesDate").value;

    const productInput = document.querySelector(".productInput").value;
    const productOption = document.querySelectorAll("#productOptions option");
    let productsNo = "";
    for (let opt of productOption) {
        if (opt.value === productInput) {
            productsNo = opt.dataset.no;
            break;
        }
    }



    const unitPrice = document.querySelector("#unitPrice").value;
    const quantity = document.querySelector("#quantity").value;

    const paymentInput = document.querySelector(".paymentInput").value;
    const paymentOption = document.querySelectorAll("#paymentOptions option");
    let paymentCd = "";
    for (let opt of paymentOption) {
        if (opt.value === paymentInput) {
            paymentCd = opt.dataset.name;
            break;
        }
    }
    console.log("전송 데이터 확인:", { storeNo, productsNo, unitPrice });

    const resp = await fetch(`/dailySales/insertDaily`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            storeNo,
            productNo: productsNo, unitPrice, quantity, paymentCd, salesDate
        })
    });

    if (resp.ok) {
        alert("매출 등록 성공");
        salesList();
    }
}


function editSales() {


}