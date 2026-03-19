document.addEventListener("DOMContentLoaded", () => {
    fetchDetailData();
});

async function fetchDetailData() {
    const urlParams = new URLSearchParams(window.location.search);
    const no = urlParams.get('no');

    try {
        const resp = await fetch(`/qna/question/${no}`);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        const vo = data.vo;

        // 데이터 바인딩
        document.querySelector("#inquiryNo").textContent = vo.inquiryNo;
        document.querySelector("#typeName").textContent = getCategoryLabel(vo.typeCode);
        document.querySelector("#title").textContent = vo.title;
        document.querySelector("#writerName").textContent = vo.writerName;
        document.querySelector("#content").innerHTML = vo.content.replace(/\n/g, '<br>');

        // 파일 처리
        // detail.js 내부의 파일 처리 로직
        if (vo.fileList && vo.fileList.length > 0) {
            // JSP에 있는 실제 ID인 #file-name-display를 선택해야 합니다.
            const fileArea = document.querySelector("#file-name-display");
            fileArea.innerHTML = ""; // 기존 "첨부파일 없음" 문구 삭제

            vo.fileList.forEach(file => {
                // 경로 확인: /upload/question/ 인지 /upload/qna/ 인지 서버 설정과 맞출 것
                const filePath = "/upload/question/" + file.changeName;

                fileArea.innerHTML += `
                    <a href="${filePath}" download="${file.originName}" class="file-link"
                       style="display:block; margin-bottom:5px; color:#8c7361; text-decoration:underline; font-size:14px;">
                        📁 ${file.originName}
                    </a>`;
            });
        } else {
            document.querySelector("#file-name-display").textContent = "첨부된 파일이 없습니다.";
        }

        // 답변 처리
        if(vo.answerYn === 'Y' && vo.answerContent) {
            document.querySelector("#answer-section").style.display = "block";
            document.querySelector("#answerContent").innerHTML = vo.answerContent.replace(/\n/g, '<br>');
        }

        // 삭제 권한 (로그인한 사람 == 작성자)
        if(loginMemberNo && String(loginMemberNo) === String(vo.writerNo)) {
            document.querySelector("#btn-delete").style.display = "inline-block";
        }

    } catch (error) {
        console.error(error);
        alert("정보를 불러오지 못했습니다.");
    }
}

function getCategoryLabel(code) {
    const map = { "1": "시스템", "2": "재무", "3": "인사", "4": "품질", "5": "공통" };
    return map[code] || "기타";
}

async function deleteQuestion() {
    if(!confirm("정말 삭제하시겠습니까?")) return;
    const no = new URLSearchParams(window.location.search).get('no');

    try {
        const resp = await fetch(`/qna/question`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inquiryNo: no })
        });
        const resultData = await resp.json();
        if(resultData.result === 1) {
            alert("삭제되었습니다.");
            location.href = "/qna/question/list";
        }
    } catch (e) { alert("삭제 중 오류 발생"); }
}