/**
 * 문의글 등록 (fetch API 방식)
 */
async function submitQuestion() {
    // 1. DOM 요소에서 값 추출 (id 기반)
    const titleObj = document.querySelector("#title");
    const typeCodeObj = document.querySelector("#typeCode");
    const contentObj = document.querySelector("#content");
    const fileInput = document.querySelector("#file-input");
    const secretYnObj = document.querySelector("#secretYn");

    // 2. 유효성 검사
    if (!titleObj.value.trim()) {
        alert("제목을 입력하세요");
        titleObj.focus();
        return;
    }

    if (!contentObj.value.trim()) {
        alert("내용을 입력하세요");
        contentObj.focus();
        return;
    }

    // 3. FormData 객체 생성 및 데이터 담기
    const fd = new FormData();
    fd.append("title", titleObj.value);
    fd.append("typeCode", typeCodeObj.value);
    fd.append("content", contentObj.value);
    fd.append("secretYn", secretYnObj.checked ? "Y" : "N");

    // 다중 파일 처리
    const files = fileInput.files;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            fd.append("file", files[i]);
        }
    }

    // 4. 비동기 통신 시작
    try {
        const resp = await fetch("/qna/question", {
            method: "POST",
            body: fd
        });

        if (!resp.ok) throw new Error("네트워크 응답 에러");

        const data = await resp.json();
        if (data.result === "1") {
            alert("문의글이 등록되었습니다.");
            location.href = "/qna/question/list";
        } else {
            alert("등록 실패");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("작성 중 오류가 발생했습니다.");
    }
}

// 파일 선택 시 이름 표시 로직
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.querySelector("#file-input");
    const display = document.querySelector("#file-name-display");

    if (fileInput && display) {
        fileInput.addEventListener("change", (e) => {
            const fileNames = Array.from(e.target.files).map(f => f.name);
            display.textContent = fileNames.length > 0 ? "📎 첨부파일: " + fileNames.join(", ") : "";
        });
    }
});