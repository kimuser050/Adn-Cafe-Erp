// 체크하면 삭제버튼 활성화
// 하위 계정 영역(subAccountArea)에서 발생하는 모든 변경(change)을 감시
document.querySelector("#subAccountArea").addEventListener("change", function () {
    const deleteBtn = document.querySelector(".delete-btn");
    if (!deleteBtn) return;

    const checkedCount = document.querySelectorAll(".sub-row input:checked").length;

    if (checkedCount > 0) {
        deleteBtn.classList.add("active");
    } else {
        deleteBtn.classList.remove("active");
    }
});

//대분류 계정 클릭했을 때 하위계정 활성화

async function loadSub(element, mainAccountNo) {

    if (!mainAccountNo) {
        alert("잘못된 접근입니다. (대분류 계정 정보 없음)");
        return;
    }

    try {
        const resp = await fetch(`/account/list?mainAccountNo=${mainAccountNo}`, {
            method: "post"
        })

        if (!resp.ok) {
            throw new Error("계정 조회 실패");
        }

        const data = await resp.json();
        const voList = data.voList;

        const subArea = document.querySelector("#subAccountArea");
        if (!voList || voList.length === 0) {
            subArea.innerHTML = `<div style="padding: 20px; text-align: center; color: #888;">등록된 하위 계정이 없습니다.</div>`;
            return;
        }

        let subList = "";
        for (const vo of voList) {
            // 상태값 꺼내기 (대소문자 모두 대응)
            const currentStatus = vo.useYn || vo.USE_YN;

            // 상태가 'N'이면 'disabled-row'라는 클래스명을 변수에 담기 (css로 효과 변경)
            const disabledClass = (currentStatus === 'N') ? "disabled-row" : "";
            subList += `
            <div class="sub-row ${disabledClass}" >
                <input type="checkbox" value="${vo.accountNo}" data-useyn="${vo.useYn}">
                <span>${vo.accountName} (${vo.accountNo})</span>
            </div>
        `
        }
        subArea.innerHTML = subList;
    } catch (error) {
        console.log(error);
        alert("계정 목록을 불러오는 중 오류가 발생했습니다.");
    }
}

// 체크한 박스 상태변경
async function statusAccount() {

    const checkbox = document.querySelector(".sub-row input:checked");

    if (!checkbox) {
        alert("상태를 변경할 계정을 선택해주세요.");
        return;
    }

    const accountNo = checkbox.value;
    const targetRow = checkbox.closest(".sub-row");

    try {
        const resp = await fetch(`/account/delete?accountNo=${accountNo}`, {
            method: "delete"
        })

        if (!resp.ok) throw new Error("상태 변경 실패");

        const data = await resp.json();
        const status = data.useYn ? data.useYn.trim().toUpperCase() : "";

        // 서버 응답이 빈값이어도 무조건 작동
        // DB에 넘어간 현재 상태값에 따라 Y,N 바꾸기
        if (resp.ok) {
            const currentStatus = checkbox.dataset.useyn;
            const nextStatus = (currentStatus === 'Y') ? 'N' : 'Y';

            if (nextStatus === 'N') {
                alert("비활성화 되었습니다");
                targetRow.classList.add("disabled-row");
                checkbox.dataset.useyn = 'N';
            } else {
                alert("활성화 되었습니다");
                targetRow.classList.remove("disabled-row");
                checkbox.dataset.useyn = 'Y';
            }
        }

        checkbox.checked = false;
        document.querySelector(".delete-btn").classList.remove("active");
    } catch (error) {
        console.error(error);
        alert("계정 상태 변경 중 오류가 발생했습니다.");
    }

}


async function insertAccount() {

    const accountName = document.querySelector("input[name=accountName]").value.trim();
    const mainAccountNo = document.querySelector("input[name=mainAccountNo]").value.trim();
    const subAccountNo = document.querySelector("input[name=subAccountNo]").value.trim();
    const accountNo = document.querySelector("input[name=accountNo]").value.trim();

    if (!accountName) {
        alert("계정명을 입력해주세요.");
        return;
    }
    if (!mainAccountNo) {
        alert("대분류 계정 코드를 입력해주세요.");
        return;
    }
    if (!accountNo) {
        alert("계정 코드를 입력해주세요.");
        return;
    }
    if (isNaN(accountNo)) {
        alert("계정 코드는 숫자만 입력 가능합니다.");
        return;
    }

    const fd = new FormData();
    fd.append("accountName", accountName);
    fd.append("mainAccountNo", mainAccountNo);
    fd.append("accountNo", accountNo);
    // subAccountNo가 빈 문자열이면 아예 append를 하지 않거나,
    // 서버에서 null로 받을 수 있도록 처리
    if (subAccountNo.trim() !== "") {
        fd.append("subAccountNo", subAccountNo);
    }

    try {
        const resp = await fetch(`/account/insertAccount`, {
            method: "post",
            body: fd
        })

        if (!resp.ok) {
            throw new Error("계정등록 실패");
        }

        alert("계정등록 성공");
        location.href = "/account/insertAccount";
    } catch (error) {
        console.log(error);
        alert("계정 등록 중 서버 오류가 발생했습니다.");
    }
}