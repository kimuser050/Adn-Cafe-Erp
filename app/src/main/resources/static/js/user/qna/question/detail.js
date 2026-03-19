// 전역 변수로 현재 답변 데이터를 보관 (댓글 등록/조회 시 replyNo 활용)
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

        // --- 2. [변경] 질문 첨부파일 처리 (내용 바로 밑 영역) ---
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

        // --- 3. 답변 및 댓글 처리 ---
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

            // 답변 작성자 본인 확인 (수정/삭제 버튼)
            if(loginMemberNo && String(loginMemberNo) === String(vo.answerVo.writerNo)) {
                if(adminBtns) adminBtns.style.display = "block";
                initAnswerEvents();
            }

            // 답변 파일 바인딩
            if (vo.answerVo.fileList && vo.answerVo.fileList.length > 0) {
                answerFileDisplay.innerHTML = "";
                vo.answerVo.fileList.forEach(file => {
                    const filePath = "/upload/answer/" + file.changeName;
                    answerFileDisplay.innerHTML += `<a href="${filePath}" download="${file.originName}" style="display:block; margin-top:8px; color:#c8a992; text-decoration:underline; font-size:14px;">📁 ${file.originName}</a>`;
                });
            }

            // [신규] 댓글 목록 불러오기 및 이벤트 연결
            fetchComments(currentAnswerData.replyNo);
            document.querySelector("#btn-comment-submit").onclick = () => submitComment(currentAnswerData.replyNo);

            if(btnAnswer) btnAnswer.style.display = "none";
        } else {
            answerSection.style.display = "none";
            if(btnAnswer) {
                btnAnswer.style.display = "inline-block";
                btnAnswer.onclick = () => { location.href = `/qna/answer/insert?no=${no}`; };
            }
        }

        // 문의글 삭제 권한 (질문 작성자)
        if(loginMemberNo && String(loginMemberNo) === String(vo.writerNo)) {
            const btnDelete = document.querySelector("#btn-delete");
            if(btnDelete) btnDelete.style.display = "inline-block";
        }

    } catch (error) {
        console.error("Detail Fetch Error:", error);
    }
}

// --- 댓글(AnswerComment) 관련 함수 ---

// 1. 댓글 목록 조회
// 1. 댓글 목록 조회 함수 내부 수정
async function fetchComments(replyNo) {
    try {
        const resp = await fetch(`/answer/comment?replyNo=${replyNo}`);
        const list = await resp.json();
        const area = document.querySelector("#comment-list-area");
        area.innerHTML = "";

        if(list.length === 0) {
            area.innerHTML = '<p style="color:#999; text-align:center; padding:20px; font-size:13px;">등록된 댓글이 없습니다.</p>';
            return;
        }

        list.forEach(c => {
            const isMyComment = loginMemberNo && String(loginMemberNo) === String(c.writerNo);
            const commentHtml = `
                <div class="comment-item" style="padding:15px; border-bottom:1px solid #f5f5f5;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <strong style="font-size:14px; color:#5a4a3c;">${c.writerName}</strong>
                        <span style="font-size:12px; color:#bbb;">${c.createdAt}</span>
                    </div>
                    <div id="comment-text-${c.commentNo}" style="font-size:14px; color:#444; line-height:1.5;">
                        ${c.commentContent}
                    </div>
                    ${isMyComment ? `
                        <div style="text-align:right; margin-top:5px;">
                            <span onclick="openEditComment('${c.commentNo}', '${c.commentContent}')" style="cursor:pointer; font-size:12px; color:#8c7361; margin-right:10px;">수정</span>
                            <span onclick="deleteComment('${c.commentNo}')" style="cursor:pointer; font-size:12px; color:#a55d5d;">삭제</span>
                        </div>
                    ` : ""}
                </div>`;
            area.insertAdjacentHTML('beforeend', commentHtml);
        });
    } catch (e) { console.error("댓글 로드 실패", e); }
}

// 2. 댓글 등록
async function submitComment(replyNo) {
    const input = document.querySelector("#comment-input");
    const content = input.value.trim();
    if(!content) return alert("댓글 내용을 입력해주세요.");

    try {
        const resp = await fetch(`/answer/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                replyNo: replyNo,
                commentContent: content
            })
        });
        const data = await resp.json();
        if(data.result === 1) {
            input.value = "";
            fetchComments(replyNo);
        }
    } catch (e) { alert("댓글 등록 실패"); }
}

// 3. 댓글 삭제
async function deleteComment(commentNo) {
    if(!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
        const resp = await fetch(`/answer/comment`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commentNo: commentNo })
        });
        const result = await resp.json();
        if(result === 1) fetchComments(currentAnswerData.replyNo);
    } catch (e) { alert("삭제 실패"); }
}

// 4. 댓글 수정창 열기 (간단한 prompt 방식 또는 인라인 전환)
async function openEditComment(commentNo, oldContent) {
    const newContent = prompt("댓글을 수정하세요:", oldContent);
    if(!newContent || newContent === oldContent) return;

    try {
        const resp = await fetch(`/answer/comment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                commentNo: commentNo,
                commentContent: newContent
            })
        });
        const data = await resp.json();
        if(data.result === 1) fetchComments(currentAnswerData.replyNo);
    } catch (e) { alert("수정 실패"); }
}

// --- 기존 답변 수정/삭제 이벤트 ---
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

    updateBtn.onclick = async () => {
        const formData = new FormData();
        formData.append("replyNo", currentAnswerData.replyNo);
        formData.append("response", editInput.value);
        const fileInput = document.querySelector("#edit-file-input");
        if(fileInput && fileInput.files[0]) formData.append("file", fileInput.files[0]);
        if(currentAnswerData.fileList && currentAnswerData.fileList.length > 0) {
            formData.append("oldChangeName", currentAnswerData.fileList[0].changeName);
        }

        const resp = await fetch(`/qna/answer/update`, { method: 'POST', body: formData });
        const result = await resp.json();
        if(result.result === 1) location.reload();
    };

    deleteBtn.onclick = async () => {
        if(!confirm("정말 삭제하시겠습니까?")) return;
        const resp = await fetch(`/qna/answer/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ replyNo: currentAnswerData.replyNo })
        });
        const result = await resp.json();
        if(result.result === 1) location.reload();
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
    const resp = await fetch(`/qna/question`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryNo: no })
    });
    const result = await resp.json();
    if(result.result === 1) location.href = "/qna/question/list";
}