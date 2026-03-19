// 전역 변수로 현재 답변 데이터를 보관
let currentAnswerData = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchDetailData();
});

async function fetchDetailData() {
    const urlParams = new URLSearchParams(window.location.search);
    const no = urlParams.get('no');

    if(!no) {
        alert("잘못된 접근입니다.");
        return;
    }

    try {
        const resp = await fetch(`/qna/question/${no}`);
        if(!resp.ok) throw new Error("데이터 조회 실패");

        const data = await resp.json();
        const vo = data.vo;

        // --- 1. 기본 문의 데이터 바인딩 ---
        document.querySelector("#inquiryNo").textContent = vo.inquiryNo || no;
        document.querySelector("#typeName").textContent = getCategoryLabel(vo.typeCode);
        document.querySelector("#title").textContent = vo.title || "제목 없음";
        document.querySelector("#writerName").textContent = vo.writerName || "작성자 미상";

        const contentArea = document.querySelector("#content");
        const questionText = vo.content || "내용이 없습니다.";
        contentArea.innerHTML = questionText.replace(/\n/g, '<br>');

        // --- 2. 문의글(질문) 첨부파일 처리 ---
        const fileArea = document.querySelector("#file-name-display");
        if (vo.fileList && vo.fileList.length > 0) {
            fileArea.innerHTML = "";
            vo.fileList.forEach(file => {
                const filePath = "/upload/question/" + file.changeName;
                fileArea.innerHTML += `
                    <a href="${filePath}" download="${file.originName}" class="file-link"
                       style="display:block; margin-bottom:5px; color:#8c7361; text-decoration:underline; font-size:14px;">
                        📁 ${file.originName}
                    </a>`;
            });
        } else {
            fileArea.textContent = "첨부된 파일이 없습니다.";
        }

        // --- 3. 답변 및 답변 첨부파일 처리 ---
        const btnAnswer = document.querySelector("#btn-answer");
        const answerSection = document.querySelector("#answer-section");
        const answerContentArea = document.querySelector("#answerContent");
        const answerFileDisplay = document.querySelector("#answer-file-display");
        const adminBtns = document.querySelector("#answer-admin-btns");

        if(vo.answerYn === 'Y' && vo.answerVo) {
            currentAnswerData = vo.answerVo;
            answerSection.style.display = "block";

            const responseText = vo.answerVo.response || "답변 내용이 없습니다.";
            answerContentArea.innerHTML = responseText.replace(/\n/g, '<br>');

            // 권한 체크: 로그인한 사람과 답변 작성자가 같을 때만 수정/삭제 버튼 노출
            if(loginMemberNo && String(loginMemberNo) === String(vo.answerVo.writerNo)) {
                if(adminBtns) adminBtns.style.display = "block";
                initAnswerEvents();
            }

            if (vo.answerVo.fileList && vo.answerVo.fileList.length > 0) {
                answerFileDisplay.innerHTML = "";
                vo.answerVo.fileList.forEach(file => {
                    const filePath = "/upload/answer/" + file.changeName;
                    answerFileDisplay.innerHTML += `
                        <a href="${filePath}" download="${file.originName}"
                           style="display:block; margin-top:8px; color:#c8a992; text-decoration:underline; font-size:14px;">
                            📁 [답변파일] ${file.originName}
                        </a>`;
                });
            } else {
                answerFileDisplay.innerHTML = "<span style='color:#999; font-size:13px;'>첨부된 답변 파일이 없습니다.</span>";
            }

            if(btnAnswer) btnAnswer.style.display = "none";
        } else {
            answerSection.style.display = "none";
            if(btnAnswer) {
                btnAnswer.style.display = "inline-block";
                btnAnswer.onclick = () => {
                    location.href = `/qna/answer/insert?no=${no}`;
                };
            }
        }

        // --- 4. 문의글 삭제 권한 체크 (질문 작성자) ---
        if(loginMemberNo && String(loginMemberNo) === String(vo.writerNo)) {
            const btnDelete = document.querySelector("#btn-delete");
            if(btnDelete) btnDelete.style.display = "inline-block";
        }

    } catch (error) {
        console.error("Detail Fetch Error:", error);
    }
}

function initAnswerEvents() {
    const editBtn = document.querySelector("#btn-answer-edit");
    const deleteBtn = document.querySelector("#btn-answer-delete");
    const updateBtn = document.querySelector("#btn-answer-update");
    const cancelBtn = document.querySelector("#btn-answer-cancel");

    const displayArea = document.querySelector("#answerContent");
    const editArea = document.querySelector("#answer-edit-area");
    const editInput = document.querySelector("#answer-edit-input");

    editBtn.onclick = () => {
        displayArea.style.display = "none";
        editArea.style.display = "block";
        editInput.value = currentAnswerData.response;
        // 수정 모드 시 기존 파일 영역 아래에 파일 선택 input 동적 추가 (필요시)
        if(!document.querySelector("#edit-file-input")){
            const fileInputHtml = `<input type="file" id="edit-file-input" style="margin-top:10px; font-size:12px;">`;
            document.querySelector("#answer-file-display").insertAdjacentHTML('afterend', fileInputHtml);
        }
    };

    cancelBtn.onclick = () => {
        displayArea.style.display = "block";
        editArea.style.display = "none";
        const fi = document.querySelector("#edit-file-input");
        if(fi) fi.remove();
    };

    // 답변 수정 저장 (FormData 사용 - 파일 포함)
    updateBtn.onclick = async () => {
        const newResponse = editInput.value.trim();
        if(!newResponse) { alert("내용을 입력하세요."); return; }
        if(!confirm("수정하시겠습니까?")) return;

        const formData = new FormData();
        formData.append("replyNo", currentAnswerData.replyNo);
        formData.append("response", newResponse);

        // 파일 처리
        const fileInput = document.querySelector("#edit-file-input");
        if(fileInput && fileInput.files[0]) {
            formData.append("file", fileInput.files[0]); // 컨트롤러 @RequestParam("file")과 일치
        }

        // 기존 파일명 (서버에서 삭제 처리를 위해)
        if(currentAnswerData.fileList && currentAnswerData.fileList.length > 0) {
            formData.append("oldChangeName", currentAnswerData.fileList[0].changeName);
        }

        try {
            // 주소와 방식을 컨트롤러의 @PostMapping("/update")와 일치시킴
            const resp = await fetch(`/qna/answer/update`, {
                method: 'POST',
                body: formData  // FormData 사용 시 headers 설정 불필요
            });
            const result = await resp.json();
            if(result.result === 1) {
                alert("수정되었습니다.");
                location.reload();
            } else {
                alert("수정 실패");
            }
        } catch (e) { console.error(e); }
    };

    // 답변 삭제
    deleteBtn.onclick = async () => {
        if(!confirm("정말 삭제하시겠습니까?")) return;

        try {
            // 주소와 방식을 컨트롤러의 @PostMapping("/delete")와 일치시킴
            const resp = await fetch(`/qna/answer/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    replyNo: currentAnswerData.replyNo
                })
            });
            const result = await resp.json();
            if(result.result === 1) {
                alert("삭제되었습니다.");
                location.reload();
            }
        } catch (e) { console.error(e); }
    };
}

function getCategoryLabel(code) {
    const map = { "1": "시스템", "2": "재무", "3": "인사", "4": "품질", "5": "공통" };
    return map[String(code)] || "기타";
}

async function deleteQuestion() {
    if(!confirm("문의글을 삭제하시겠습니까?")) return;
    const urlParams = new URLSearchParams(window.location.search);
    const no = urlParams.get('no');

    try {
        const resp = await fetch(`/qna/question`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inquiryNo: no })
        });
        const result = await resp.json();
        if(result.result === 1) {
            alert("삭제되었습니다.");
            location.href = "/qna/question/list";
        }
    } catch (e) { alert("오류 발생"); }
}