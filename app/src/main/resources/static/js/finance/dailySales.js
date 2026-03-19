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
    if (!salesDate || !storeInput) {
        return;
    }

    const storeOptions = document.querySelectorAll("#storeOptions option");
    let storeNo = "";
    for (let opt of storeOptions) {
        if (opt.value === storeInput) {
            storeNo = opt.dataset.no;
            break;
        }
    }

    const resp = await fetch(`/dailySales/listDailyData?salesDate=${salesDate}&storeNo=${storeNo}`);
    const data = await resp.json();
    const voList = data.voList;

    const tbody = document.querySelector(".body tbody")

    let str = "";
    for (const vo of voList) {
        str += `
                <tr>
                    <td>${vo.salesDate}</td>
                    <td>${vo.totalSales}</td>
                    <td>${vo.productName}</td>
                    <td>${vo.unitPrice}</td>
                    <td>${vo.quantity}</td>
                    <td>${vo.paymentCd}</td>
                    <td><button onclick="openEditModal(
                    '${vo.storeNo}',
                    '${vo.salesNo}', '${vo.salesDate}','${vo.productName}',
                    '${vo.unitPrice}', '${vo.quantity}', '${vo.paymentCd}'
                    );">수정하기</button></td>
                    <td><button onclick="delSales('${vo.salesNo}','${storeNo}');">삭제하기</button></td>
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

    const resp = await fetch(`/dailySales/insertDailyData`, {
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
        clear();
        salesList();
    }
}

// 매출등록 새로고침

function clear() {
    document.querySelector(".productInput").value = "";
    document.querySelector("#unitPrice").value = "";
    document.querySelector("#quantity").value = "";
    document.querySelector(".paymentInput").value = "";
}

// 수정 모달창

function openEditModal(storeNo, no, date, name, price, quantity, paymentCd) {

    document.querySelector("#modalStoreNo").value = storeNo;
    document.querySelector("#modalSalesNo").value = no;
    document.querySelector("#modalSalesDate").value = date.substring(0, 10);
    document.querySelector("#modalProductName").value = name;
    document.querySelector("#modalUnitPrice").value = price;
    document.querySelector("#modalQuantity").value = quantity;
    document.querySelector("#modalPayment").value = paymentCd;

    document.querySelector("#updateModal").classList.add("active");
}

// 수정 모달창 닫기

function closeModal() {
    document.querySelector("#updateModal").classList.remove("active");
}


// 매출 수정

async function editSales() {

    const storeInputValue = document.querySelector(".storeInput").value;
    const storeOption = document.querySelectorAll("#storeOptions option");
    let storeNo = "";
    for (let opt of storeOption) {
        if (opt.value === storeInputValue) {
            storeNo = opt.dataset.no; // 실제 DB용 숫자 코드
            break;
        }
    }

    const salesNo = document.querySelector("#modalSalesNo").value;
    const salesDate = document.querySelector("#modalSalesDate").value;
    const productName = document.querySelector("#modalProductName").value;
    const option = document.querySelectorAll("#productOptions option");
    let productNo = "";
    for (let opt of option) {
        if (opt.value === productName) {
            productNo = opt.dataset.no;
            break;
        }
    }
    const unitPrice = document.querySelector("#modalUnitPrice").value;
    const quantity = document.querySelector("#modalQuantity").value;
    const paymentInput = document.querySelector("#modalPayment").value;
    let paymentCd = "";
    if (paymentInput === "C" || paymentInput === "D") {
        paymentCd = paymentInput;
    } else {
        const paymentOptions = document.querySelectorAll("#paymentOptions option");
        for (let opt of paymentOptions) {
            if (opt.value === paymentInput) {
                paymentCd = opt.dataset.name;
                break;
            }
        }
    }

    const resp = await fetch(`/dailySales/editDaily`, {
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            storeNo, salesNo, salesDate, productNo, unitPrice, quantity, paymentCd
        })
    })

    if (resp.ok) {
        alert("매출 수정 성공");
        closeModal();
        salesList();
    } else {
        alert("매출 수정 실패");
    }
}

//매출 삭제

async function delSales(no, storeNo) {
    console.log(no, storeNo);
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const resp = await fetch(`/dailySales/delDaily?salesNo=${no}&storeNo=${storeNo}`, {
        method: "delete"
    });

    if (resp.ok) {
        alert("매출 삭제 성공");
        salesList();
    } else {
        alert("매출 삭제 실패");
    }

}