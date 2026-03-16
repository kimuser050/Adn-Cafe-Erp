async function insertDocument(){
    try {
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