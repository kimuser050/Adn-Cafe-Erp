async function insertNotice() {
    // 요소 선택 (querySelector를 더 명확하게 수정)
    const title = document.querySelector("input[name=title]").value;
    const content = document.querySelector("textarea[name=content]").value;
    const category = document.querySelector("select[name=category]").value;

    // id가 notice-file인 요소에서 파일을 가져옴
    const fileInput = document.querySelector("#notice-file");
    const file = fileInput.files[0];

    // 유효성 검사
    if (!title.trim()) {
        alert("제목을 입력하세요.");
        return;
    }
    if (!content.trim()) {
        alert("내용을 입력하세요.");
        return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("category", category);

    if (file) {
        fd.append("file", file);
    }

    try {
        const resp = await fetch(`/notice`, {
            method: "POST",
            body: fd,
        });

        if (!resp.ok) {
            // 서버에서 403(권한없음) 등을 던졌을 때 처리
            if(resp.status === 403) {
                alert("해당 카테고리에 대한 작성 권한이 없습니다.");
                return;
            }
            throw new Error("notice insert fail ...");
        }

        const data = await resp.json();
        if (data.result === "1" || data.result === 1) {
            alert("공지사항 작성 성공 !");
            location.href = `/notice/list`;
        } else {
            alert("작성 실패: " + (data.msg || "알 수 없는 오류"));
        }

    } catch (error) {
        console.error(error);
        alert("서버 통신 중 오류가 발생했습니다.");
    }
}

function updateFileName(input) {
    const display = document.querySelector("#file-name-display");
    if (input.files && input.files[0]) {
        display.textContent = "📎 선택된 파일: " + input.files[0].name;
    } else {
        display.textContent = "";
    }
}