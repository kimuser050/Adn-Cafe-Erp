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