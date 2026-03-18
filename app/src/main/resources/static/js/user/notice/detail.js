let currentLoginEmpNo = null;
let currentVo = null;

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const no = params.get("no");

    if (no) {
        fetchDetail(no);
    } else {
        alert("잘못된 접근입니다.");
        location.href = "/notice/list";
    }
});

async function fetchDetail(no) {
    try {
        const resp = await fetch(`/notice/${no}`);

        if (resp.status === 401 || resp.status === 403) {
            alert("로그인이 필요합니다.");
            location.href = "/member/login";
            return;
        }

        if (!resp.ok) {
            throw new Error("데이터를 가져오는 데 실패했습니다.");
        }

        const data = await resp.json();
        const vo = data.vo;
        const loginEmpNo = data.loginEmpNo;
        currentLoginEmpNo = loginEmpNo;

        if (vo) {
            currentVo = vo;
            renderDetail(vo);
            loadComments(vo.noticeNo, loginEmpNo);

            if (loginEmpNo && loginEmpNo === vo.writerNo) {
                document.getElementById("owner-actions").style.display = "flex";
                setupOwnerButtons(vo);
            }
        }
    } catch (err) {
        console.error("상세보기 로드 에러:", err);
        alert("공지사항을 불러올 수 없습니다.");
    }
}

function renderDetail(vo) {
    const set = (id, value) => {
        const el = document.querySelector(id);
        if (el) el.textContent = value;
    };

    set("#notice-no",       vo.noticeNo);
    set("#notice-category", vo.category  || "");
    set("#notice-title",    vo.title);
    set("#notice-writer",   vo.writerName || "관리자");
    set("#notice-hit",      vo.hit        || 0);

    const dateEl = document.querySelector("#notice-date");
    if (dateEl && vo.createdAt) dateEl.textContent = formatDate(vo.createdAt);

    document.querySelector("#notice-content").innerHTML =
        vo.content ? vo.content.replace(/\n/g, "<br>") : "";

    const fileArea = document.querySelector("#file-list");
    fileArea.innerHTML = "";

    if (vo.fileList && vo.fileList.length > 0) {
        vo.fileList.forEach(f => {
            const a = document.createElement("a");
            a.href        = `/upload/notice/${f.changeName}`;
            a.download    = f.originName;
            a.textContent = f.originName;
            a.className   = "file-link";
            fileArea.appendChild(a);
        });
    } else {
        fileArea.textContent = "첨부파일 없음";
    }
}

function setupOwnerButtons(vo) {

    document.getElementById("edit-btn").addEventListener("click", () => {
        enterEditMode(vo);
    });

    document.getElementById("delete-btn").addEventListener("click", async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            const resp = await fetch("/notice", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ noticeNo: vo.noticeNo })
            });
            if (!resp.ok) throw new Error("삭제 실패");
            alert("삭제되었습니다.");
            location.href = "/notice/list";
        } catch (err) {
            console.error("삭제 에러:", err);
            alert("삭제 중 오류가 발생했습니다.");
        }
    });

    document.getElementById("save-btn").addEventListener("click", async () => {
        const title   = document.getElementById("edit-title").value.trim();
        const content = document.getElementById("edit-content").value.trim();
        const file    = document.getElementById("edit-file").files[0];

        if (!title)   return alert("제목을 입력하세요.");
        if (!content) return alert("내용을 입력하세요.");

        const formData = new FormData();
        formData.append("noticeNo",  vo.noticeNo);
        formData.append("title",     title);
        formData.append("content",   content);
        formData.append("category",  vo.category || "");

        if (vo.fileList && vo.fileList.length > 0) {
            formData.append("changeName", vo.fileList[0].changeName);
        }
        if (file) {
            formData.append("file", file);
        }

        try {
            const resp = await fetch("/notice", {
                method: "PUT",
                body: formData
            });
            if (!resp.ok) throw new Error("수정 실패");
            alert("수정되었습니다.");
            location.reload();
        } catch (err) {
            console.error("수정 에러:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    });

    document.getElementById("cancel-btn").addEventListener("click", () => {
        exitEditMode(vo);
    });
}

function enterEditMode(vo) {
    document.getElementById("notice-title").style.display = "none";
    document.getElementById("edit-title").style.display   = "block";
    document.getElementById("edit-title").value           = vo.title;

    document.getElementById("notice-content").style.display = "none";
    document.getElementById("edit-content").style.display   = "block";
    document.getElementById("edit-content").value           = vo.content;

    document.getElementById("edit-file").style.display = "inline-block";

    document.getElementById("view-btns").style.display = "none";
    document.getElementById("edit-btns").style.display = "flex";
}

function exitEditMode(vo) {
    document.getElementById("notice-title").style.display = "block";
    document.getElementById("edit-title").style.display   = "none";

    document.getElementById("notice-content").style.display = "block";
    document.getElementById("edit-content").style.display   = "none";

    document.getElementById("edit-file").style.display = "none";

    document.getElementById("view-btns").style.display = "flex";
    document.getElementById("edit-btns").style.display = "none";
}

function formatDate(value) {
    if (Array.isArray(value)) {
        const [y, m, d] = value;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
    return String(value).substring(0, 10);
}

// ===== 댓글 =====

async function loadComments(noticeNo, loginEmpNo) {
    try {
        const resp = await fetch(`/notice/comment?noticeNo=${noticeNo}`);
        if (!resp.ok) throw new Error("댓글 로드 실패");

        const list = await resp.json();
        renderComments(list, noticeNo, loginEmpNo);
    } catch (err) {
        console.error("댓글 로드 에러:", err);
    }
}

function renderComments(list, noticeNo, loginEmpNo) {
    const area = document.getElementById("comment-area");
    area.innerHTML = "";

    if (!list || list.length === 0) {
        area.innerHTML = `<div class="comment-placeholder">댓글이 없습니다.</div>`;
        return;
    }

    list.forEach(c => {
        const isOwner = loginEmpNo && loginEmpNo === c.writerNo;

        const div = document.createElement("div");
        div.className = "comment-item";
        div.dataset.commentNo = c.commentNo;
        div.innerHTML = `
            <div class="comment-meta">
                <span class="comment-writer">${c.writerName}</span>
                <span class="comment-date">${formatDate(c.createdAt)}</span>
                <div class="comment-actions">
                    ${isOwner ? `
                        <button class="comment-edit-btn" data-comment-no="${c.commentNo}">수정</button>
                        <button class="comment-delete-btn" data-comment-no="${c.commentNo}">삭제</button>
                    ` : ""}
                </div>
            </div>
            <div class="comment-content" id="comment-content-${c.commentNo}">${c.commentContent}</div>
            <div class="comment-edit-area" id="comment-edit-area-${c.commentNo}" style="display:none;">
                <textarea class="comment-edit-textarea" id="comment-edit-input-${c.commentNo}">${c.commentContent}</textarea>
                <div class="comment-edit-btns">
                    <button class="comment-save-btn" data-comment-no="${c.commentNo}">저장</button>
                    <button class="comment-cancel-btn" data-comment-no="${c.commentNo}">취소</button>
                </div>
            </div>
        `;
        area.appendChild(div);
    });
}

// 댓글 이벤트 - 딱 한 번만 등록
document.getElementById("comment-area").addEventListener("click", async (e) => {
    const btn = e.target;
    const noticeNo = currentVo?.noticeNo;
    const loginEmpNo = currentLoginEmpNo;

    // 삭제
    if (btn.classList.contains("comment-delete-btn")) {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            const resp = await fetch("/notice/comment", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commentNo: btn.dataset.commentNo,
                    noticeNo: noticeNo
                })
            });
            if (!resp.ok) throw new Error("삭제 실패");
            loadComments(noticeNo, loginEmpNo);
        } catch (err) {
            alert("삭제 중 오류가 발생했습니다.");
        }
    }

    // 수정 모드 전환
    if (btn.classList.contains("comment-edit-btn")) {
        const no = btn.dataset.commentNo;
        document.getElementById(`comment-content-${no}`).style.display = "none";
        document.getElementById(`comment-edit-area-${no}`).style.display = "block";
    }

    // 저장
    if (btn.classList.contains("comment-save-btn")) {
        const no = btn.dataset.commentNo;
        const content = document.getElementById(`comment-edit-input-${no}`).value.trim();
        if (!content) return alert("내용을 입력하세요.");
        try {
            const resp = await fetch("/notice/comment", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    commentNo: no,
                    commentContent: content
                })
            });
            if (!resp.ok) throw new Error("수정 실패");
            loadComments(noticeNo, loginEmpNo);
        } catch (err) {
            alert("수정 중 오류가 발생했습니다.");
        }
    }

    // 취소
    if (btn.classList.contains("comment-cancel-btn")) {
        const no = btn.dataset.commentNo;
        document.getElementById(`comment-content-${no}`).style.display = "block";
        document.getElementById(`comment-edit-area-${no}`).style.display = "none";
    }
});

// 댓글 작성
document.querySelector(".comment-submit").addEventListener("click", async () => {
    const input = document.getElementById("comment-input");
    const content = input.value.trim();

    if (!content) return alert("댓글을 입력하세요.");
    if (!currentVo) return;

    try {
        const resp = await fetch("/notice/comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                noticeNo: currentVo.noticeNo,
                commentContent: content
            })
        });
        if (!resp.ok) throw new Error("등록 실패");

        input.value = "";
        loadComments(currentVo.noticeNo, currentLoginEmpNo);
    } catch (err) {
        alert("댓글 등록 중 오류가 발생했습니다.");
    }
});