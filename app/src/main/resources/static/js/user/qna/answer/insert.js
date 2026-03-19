document.addEventListener("DOMContentLoaded", () => {
    fetchQuestionDetail();

    // 파일 이름 표시 이벤트
    const fileInput = document.querySelector("#file-input");
    fileInput.addEventListener("change", (e) => {
        const display = document.querySelector("#file-name-display");
        const fileNames = Array.from(e.target.files).map(f => f.name);
        display.textContent = fileNames.length > 0 ? fileNames.join(", ") : "";
    });
});

/**
 * 상단 문의글 정보 조회
 */
async function fetchQuestionDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const no = urlParams.get('no'); // 쿼리스트링에서 no 추출

    if(!no) {
        alert("잘못된 접근입니다.");
        location.href = "/qna/question/list";
        return;
    }

    try {
        const resp = await fetch(`/qna/question/${no}`);
        const data = await resp.json();
        const vo = data.vo;

        // 화면 바인딩
        document.querySelector("#inquiryNo").value = vo.inquiryNo;
        document.querySelector("#info-no").textContent = vo.inquiryNo;
        document.querySelector("#info-category").textContent = getCategoryName(vo.typeCode);
        document.querySelector("#info-title").textContent = vo.title;
        document.querySelector("#info-writer").textContent = vo.writerName;

    } catch (e) {
        console.error(e);
    }
}

function getCategoryName(code) {
    const map = { "1": "시스템", "2": "재무", "3": "인사", "4": "품질", "5": "공통" };
    return map[code] || "기타";
}

/**
 * 답변 등록 제출
 */
async function submitAnswer() {
    const inquiryNo = document.querySelector("#inquiryNo").value;
    const response = document.querySelector("#response").value;
    const fileInput = document.querySelector("#file-input");

    if (!response.trim()) {
        alert("답변 내용을 입력해주세요.");
        return;
    }

    const fd = new FormData();
    fd.append("inquiryNo", inquiryNo);
    fd.append("response", response);

    if (fileInput.files.length > 0) {
        for (let i = 0; i < fileInput.files.length; i++) {
            fd.append("file", fileInput.files[i]);
        }
    }

    try {
        const resp = await fetch("/qna/answer", {
            method: "POST",
            body: fd
        });

        const data = await resp.json();
        if (data.result === "1") {
            alert("답변이 등록되었습니다.");
            location.href = "/qna/question/list"; // 혹은 관리자 리스트로 이동
        } else {
            alert("등록 실패");
        }
    } catch (error) {
        console.error(error);
        alert("오류 발생");
    }
}