window.onload = function () {
    getDailySales();
    getPayment();
    getStoreList();
    setMyStore();
}

//본인의 지점명 가져오기

async function setMyStore() {
    try {
        const resp = await fetch(`/dailySales/getMyStoreData`);
        const storeVo = await resp.json();

        if (storeVo && storeVo.storeName) {
            const storeInput = document.querySelector(".storeInput");
            storeInput.value = storeVo.storeName;
            storeInput.setAttribute("readonly", true);
        }
    } catch (error) {
        console.log("점주 정보가 없거나 에러 발생");
    }
}


//제품명 리스트 가져오기

async function getDailySales() {
    try {
        const resp = await fetch(`/dailySales/getProductList`);
        const voList = await resp.json();

        const productOptions = document.querySelector("#productOptions");

        let str = "";
        for (const vo of voList) {
            str += `<option value="${vo.productsName}" data-no="${vo.productsNo}"></option>`
        }

        productOptions.innerHTML = str;
    } catch (error) {
        console.error("제품 목록 로드 실패:", error);
        alert("제품조회에 실패했습니다.");
    }
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
    try {
        const resp = await fetch(`/dailySales/getStoreList`);
        const voList = await resp.json();
        const storeOptions = document.querySelector("#storeOptions");

        let str = "";
        for (const vo of voList) {
            str += `<option value="${vo.storeName}" data-no="${vo.storeNo}"></option>`
        }

        storeOptions.innerHTML = str;
    } catch (error) {
        console.error("매장 목록 로드 실패:", error);
        alert("매장조회에 실패했습니다.");
    }
}



// 매출 조회

async function salesList() {
    const salesDate = document.querySelector("#salesDate").value;
    const storeInput = document.querySelector(".storeInput").value;
    if (!salesDate) {
        alert("조회할 일자를 선택해주세요.");
        return;
    }
    if (!storeInput) {
        alert("조회할 매장을 입력해주세요.");
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
    if (!storeNo) {
        alert("목록에 없는 매장입니다.");
        return;
    }

    try {
        const resp = await fetch(`/dailySales/listDailyData?salesDate=${salesDate}&storeNo=${storeNo}`);
        const data = await resp.json();
        const voList = data.voList;

        const tbody = document.querySelector(".body tbody")

        let str = "";
        for (const vo of voList) {
            str += `
                <tr>
                    <td>${vo.salesDate}</td>
                    <td>${Number(vo.totalSales).toLocaleString()}</td>
                    <td>${vo.productName}</td>
                    <td>${Number(vo.unitPrice).toLocaleString()}</td>
                    <td>${vo.quantity}</td>
                    <td>${vo.paymentCd}</td>
                    <td><button onclick="openEditModal('${vo.storeNo}','${vo.salesNo}','${vo.salesDate}','${vo.productName}','${vo.unitPrice}','${vo.quantity}','${vo.paymentCd}');">수정하기</button></td>
                    <td><button onclick="delSales('${vo.salesNo}','${storeNo}');">삭제하기</button></td>
                </tr>
        `
        }

        tbody.innerHTML = str;
    } catch (error) {
        console.error(error);
        alert("매출 조회 중 오류가 발생했습니다.");
    }

}


//매출 등록

async function insertDaily() {

    const salesDate = document.querySelector("#salesDate").value;
    if (!salesDate) {
        alert("매출 일자를 선택해주세요.");
        return;
    }

    const storeInput = document.querySelector(".storeInput").value;
    if (!storeInput) {
        alert("매장을 선택해주세요.");
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
    if (!storeNo) {
        alert("유효한 매장을 선택해주세요.");
        return;
    }


    const dataRow = document.querySelectorAll("tbody tr");
    const dataList = [];
    for (let i = 0; i < dataRow.length; i++) {
        const row = dataRow[i];

        const productInput = row.querySelector(".productInput").value.trim();
        if (productInput !== "") {
            const productOption = document.querySelectorAll("#productOptions option");
            let productsNo = "";
            for (let opt of productOption) {
                if (opt.value === productInput) {
                    productsNo = opt.dataset.no;
                    break;
                }
            }

            if (!productsNo) {
                alert(`${i + 1}번째 줄에 입력하신 '${productInput}' 제품을 목록에서 찾을 수 없습니다. 목록에 있는 이름을 정확히 선택해 주세요.`);
                return;
            }

            const paymentInput = row.querySelector(".paymentInput").value;
            const paymentOption = document.querySelectorAll("#paymentOptions option");
            let paymentCd = "";
            for (let opt of paymentOption) {
                if (opt.value === paymentInput) {
                    paymentCd = opt.dataset.name;
                    break;
                }
            }

            if (!paymentCd) {
                alert(`${i + 1}번째 줄: 올바른 결제방법(현금/카드)을 선택해주세요.`);
                return;
            }

            const unitPrice = row.querySelector(".unitPrice").value;
            const quantity = row.querySelector(".quantity").value;
            if (isNaN(unitPrice) || unitPrice < 0) {
                alert(`${i + 1}번째 줄: 단가를 올바르게 입력해주세요.`);
                return;
            }
            if (isNaN(quantity) || quantity <= 0) {
                alert(`${i + 1}번째 줄: 수량은 1 이상이어야 합니다.`);
                return;
            }

            const totalSales = Number(unitPrice) * Number(quantity);

            dataList.push({
                storeNo: storeNo,
                salesDate: salesDate,
                productNo: productsNo,
                unitPrice: unitPrice,
                quantity: quantity,
                paymentCd: paymentCd,
                totalSales: String(totalSales)
            });
        }
    }

    if (dataList.length === 0) {
        alert("등록할 매출 내역을 최소 한 줄 이상 입력해주세요.");
        return;
    }

    console.log("서버로 보내는 데이터 확인:", dataList);
    try {
        const resp = await fetch(`/dailySales/insertDaily`, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataList)
        });

        if (resp.ok) {
            alert("매출 등록 성공");
            location.href = `/dailySales/listDaily`
        } else {
            alert("매출 등록 실패");
        }
    } catch (error) {
        console.error(error);
        alert("서버 통신 중 오류가 발생했습니다.");
    }
}

// 매출등록 새로고침

function clear() {
    document.querySelector(".productInput").value = "";
    document.querySelector(".unitPrice").value = "";
    document.querySelector(".quantity").value = "";
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

    const storeInput = document.querySelector(".storeInput").value; // "강남점" (X)
    const storeOptions = document.querySelectorAll("#storeOptions option");
    let storeNo = "";

    for (let opt of storeOptions) {
        if (opt.value === storeInput) {
            storeNo = opt.dataset.no; // "1" 또는 "101" 같은 숫자 (O)
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
    if (!productNo) {
        alert("유효한 제품을 선택해주세요.");
        return;
    }

    const unitPrice = document.querySelector("#modalUnitPrice").value.toString().replace(/,/g, "");
    const quantity = document.querySelector("#modalQuantity").value;
    if (isNaN(unitPrice) || unitPrice < 0) {
        alert("단가를 올바르게 입력해주세요.");
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        alert("수량은 1 이상이어야 합니다.");
        return;
    }

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
    if (!paymentCd) {
        alert("올바른 결제방법을 선택해주세요.");
        return;
    }

    try {
        const resp = await fetch(`/dailySales/editDaily`, {
            method: "put",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                storeNo, salesNo, salesDate, productNo, 
                unitPrice : Number(unitPrice), 
                quantity : Number(quantity), paymentCd
            })
        })

        if (resp.ok) {
            alert("매출 수정 성공");
            closeModal();
            salesList();
        } else {
            alert("매출 수정 실패");
        }
    } catch (error) {
        console.error(error);
        alert("수정 중 오류가 발생했습니다.");
    }
}

//매출 삭제

async function delSales(no, storeNo) {
    console.log(no, storeNo);
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
        const resp = await fetch(`/dailySales/delDaily?salesNo=${no}&storeNo=${storeNo}`, {
            method: "delete"
        });

        if (resp.ok) {
            alert("매출 삭제 성공");
            salesList();
        } else {
            alert("매출 삭제 실패");
        }
    } catch (error) {
        console.error(error);
        alert("삭제 중 오류가 발생했습니다.");
    }

}