async function loadApprovalDocVo(){
    const boardNo = location.pathname.split("/").pop();
    const resp = await fetch(`/api/approval/document/${docNo}`);

    if(!resp.ok){
        throw new Error("loadApprovalDocVo fail ...");
    }

    const data = await resp.json();
    const vo = data.vo;

    document.querySelector("#categoryName").value = vo.categoryName
    document.querySelector("#writerName").value = vo.categoryName
    document.querySelector("#referenceDept").value = vo.referenceDept
    document.querySelector("#writerDept").value = vo.writerDept
    document.querySelector("#title").value = vo.title
    document.querySelector("#reason").value = vo.reason
    document.querySelector("#content").value = vo.content
    document.querySelector("#approverName").value = vo.approverName
    document.querySelector("#startDate").value = vo.startDate
    document.querySelector("#endDate").value = vo.endDate
}
try {
    loadBoardVo();
} catch (error) {
    console.log(error);
    alert("결재문서 상세조회 실패");
}

async function processApproval(){
    try {
        const title = document.querySelector("main input[name=title]").value;

        const resp = await fetch(`/api/approval/document` , {
            method : "PUT" ,
            headers : {
                "Content-Type" : "application/json" , 
            } ,
            body : JSON.stringify( {title, content, no} ) , 
        });

        if(!resp.ok){
            throw new Error("processApproval fail ...");
        }

        const data = await resp.json();
        

        if(data.result != "1"){
            throw new Error("processApproval fail ...");
        }

        alert("게시글 수정 완료");
        location.href = "/board/list";

    } catch (error) {
        location.href="/home"
        console.log(error);
    }
}