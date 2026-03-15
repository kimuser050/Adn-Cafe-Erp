//품목 조회
async function itemVoList(){
    const resp = await fetch(`/api/stock/itemList`);
    if(!resp.ok){
        throw new Error("select stock list fail ...");
    }
    const data = await resp.json();
    const voList = data.voList;
        console.log(voList);

    const tbodyTag = document.querySelector("#itemList");
    let str = "";
    for(const vo of voList){
        str += `
            <tr>
                <td>${vo.itemNo}</td>
                <td>${vo.itemName}</td>
                <td>${vo.unitPrice}</td>
                <td>${vo.stock}</td>
                <td>${vo.location}</td>
                <td>${vo.activeYn}</td>
            </tr>
        `;
    }
    tbodyTag.innerHTML = str;
}

try {
    itemVoList();
} catch (error) {
    console.log(error);
    alert("품목 불러오기 실패 ...");
}
//품목 상세조회
// async function itemVoList(){
//     const resp = await fetch(`/api/stock/{itemNo}`);
//     if(!resp.ok){
//         throw new Error("select stock detail list fail ...");
//     }
//     const data = await resp.json();
//     const voList = data.voList;
//         console.log(voList);

//     const tbodyTag = document.querySelector("#itemList");
//     let str = "";
//     for(const vo of voList){
//         str += `
//             <tr>
//                 <td>${vo.itemNo}</td>
//                 <td>${vo.itemName}</td>
//                 <td>${vo.unitPrice}</td>
//                 <td>${vo.stock}</td>
//                 <td>${vo.location}</td>
//                 <td>${vo.activeYn}</td>
//             </tr>
//         `;
//     }
//     tbodyTag.innerHTML = str;
// }

// try {
//     itemVoList();
// } catch (error) {
//     console.log(error);
//     alert("품목 불러오기 실패 ...");
// }