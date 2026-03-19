async function insertNotice(){

    const title = document.querySelector("input[name=title]").value;
    const content = document.querySelector("textarea[name=content]").value;
    const category = document.querySelector("select[name=category]").value;
    const file = document.querySelector("input[name=file]").files[0];

    // 유효성 검사
    if (!title.trim()) {
        alert("제목 입력하세요");
        return;
    }

    if (!content.trim()) {
        alert("내용 입력하세요");
        return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("category",category)


    if (file) {
        fd.append("file", file);
    }

    try {
        const resp = await fetch(`/notice`, {
            method: "POST",
            body: fd,
        });

        if (!resp.ok) {
            throw new Error("notice insert fail ...");
        }

        const data = await resp.json();
        console.log(data);

        alert("공지사항 작성 성공 !");
        location.href = `/notice/list`;

    } catch (error) {
        console.log(error);
        alert("작성 실패...");
    }
}