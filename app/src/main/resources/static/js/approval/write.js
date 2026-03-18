async function insertDocument(){
    try {
        const categoryNo = document.querySelector("#categoryNo").value;
        const writerNo = document.querySelector("#writerNo").value;
        const deptCode = document.querySelector("#deptCode").value;
        const title = document.querySelector("#title").value;
        const reason = document.querySelector("#reason").value;
        const content = document.querySelector("#content").value;
        const approverNo = document.querySelector("#approverNo").value;
        const startDate = document.querySelector("#startDate").value;
        const endDate = document.querySelector("#endDate").value;

        const resp = await fetch(`/api/approval/document/write` , {
            method : "POST",
            headers : {
                "Content-Type":"application/json" , 
            },
            body : JSON.stringify({ 
                categoryNo
                , writerNo
                , deptCode
                , title
                , reason
                , content
                , approverNo
                , startDate
                , endDate})
        })
    
        if(!resp.ok){
            throw new Error("insert fail");
        }
    
        alert("상신 완료");
        location.href="/approval/document/myDocList"
    } catch (error) {
        location.href="/home"
        console.log(error)
    }
}