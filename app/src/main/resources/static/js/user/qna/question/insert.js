/**
 * 문의글 등록 (fetch API 방식)
 */
async function submitQuestion() {

    // 1. DOM 요소에서 값 추출
    const title = document.querySelector("#title").value;
    const typeCode = document.querySelector("#typeCode").value;
    const content = document.querySelector("#content").value;
    const fileInput = document.querySelector("#file-input");
    const files = fileInput.files;
    const secretYn = document.querySelector("#secretYn").checked ? "Y" : "N";


    // 2. 유효성 검사
    if (!title.trim()) {
        alert("제목을 입력하세요");
        document.querySelector("#title").focus();
        return;
    }

    if (!content.trim()) {
        alert("내용을 입력하세요");
        document.querySelector("#content").focus();
        return;
    }

    // 3. FormData 객체 생성 및 데이터 담기
    const fd = new FormData();
    fd.append("title", title);
    fd.append("typeCode", typeCode);
    fd.append("content", content);
    fd.append("secretYn", secretYn);

    // 다중 파일 처리 (fileList가 List<MultipartFile>이므로 반복문 사용)
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            fd.append("file", files[i]); // 서버 파라미터명 'file'에 맞춰 추가
        }
    }

    // 4. 비동기 통신 시작
    try {
        const resp = await fetch("/qna/question", {
            method: "POST",
            body: fd,
            // fetch 사용 시 FormData를 전송할 때는 Content-Type을 직접 설정하지 않습니다.
            // 브라우저가 자동으로 boundary를 포함한 multipart/form-data로 설정합니다.
        });

        if (!resp.ok) {
            throw new Error("QNA 작성 실패...");
        }

        const data = await resp.json();
        console.log("서버 응답:", data);

        if (data.result === "1") {
            alert("문의글이 성공적으로 등록되었습니다.");
            location.href = "/qna/question/list"; // 목록 페이지 경로
        } else {
            alert("등록에 실패했습니다.");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("작성 중 오류가 발생했습니다.");
    }
}

// 파일 선택 시 이름 표시 로직 (참고용)
document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.querySelector("#file-input");
    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const display = document.querySelector("#file-name-display");
            const fileNames = Array.from(e.target.files).map(f => f.name);
            display.textContent = fileNames.length > 0 ? fileNames.join(", ") : "";
        });
    }
});