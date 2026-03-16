/* =========================================================
   직급관리 JS
/* =========================================================
   0. 전역 변수
   - 현재 보고 있는 직급 상세정보에서 사용할 값들
   - 상태변경 버튼 누를 때 필요함
   ========================================================= */
let currentPosCode = null;      // 현재 보고 있는 직급코드
let currentUseYn = null;        // 현재 보고 있는 직급의 사용여부
let currentMemberList = [];     // 현재 직급의 소속 인원 목록

/* =========================================================
   1. 페이지 진입 시 실행
   - 상단 요약카드 (총 직급 수)
   - 하단 전체 목록
   ========================================================= */
try {
    loadPosSummary();     // 요약 실행
    loadPosList();                  // 리스트 가져오기
} catch (error) {
    console.log(error);
    alert("직급 페이지 로딩 실패 ...");
}

/* =========================================================
   2. 공통 함수
   ========================================================= */

// 2.1 날짜를 YYYY-MM-DD 형태로 잘라서 보여주는 함수
function formatDate(value) {
    if (!value) {
        return "";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}

// 2.2 useYn 값을 화면용 텍스트와 css 클래스로 바꿔주는 함수
function getUseYnInfo(useYn) {
    if (useYn === "Y") {
        return { text: "사용", className: "on" };
    }
    return { text: "미사용", className: "off" };
}

/* =========================================================
   3. 상단 요약 카드
   - 검색결과와 상관없이 항상 전체 기준
   ========================================================= */

// 전체 직급 목록을 다시 가져와서 요약 카드 숫자 계산
async function loadPosSummary() {
    try {
        const resp = await fetch("/pos");

        if (!resp.ok) {
            throw new Error("직급 요약 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderSummary(voList);

    } catch (error) {
        console.log(error);
        alert("직급 요약 조회 중 오류 발생 ...");
    }
}

// 요약 카드에 숫자 넣기
function renderSummary(voList) {
    const totalEl = document.querySelector("#total-pos-count");
    const enableEl = document.querySelector("#enable-pos-count");

    let enableCount = 0;

    for (let i = 0; i < voList.length; i++) {
        if (voList[i].useYn === "Y") {
            enableCount++;
        }
    }

    if (totalEl) totalEl.innerText = voList.length;
    if (enableEl) enableEl.innerText = enableCount;
}

/* =========================================================
   4. 목록 조회
   ========================================================= */

// 전체 목록 가져오기
async function loadPosList() {
    try {
        const resp = await fetch("/pos");

        if (!resp.ok) {
            throw new Error("직급 목록 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("직급 목록 조회 중 오류 발생 ...");
    }
}

// 목록 테이블 그리기
function renderTable(voList) {
    const tbodyTag = document.querySelector("#pos-list");

    if (!tbodyTag) {
        return;
    }

    if (voList.length === 0) {
        tbodyTag.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">조회된 직급이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < voList.length; i++) {
        const vo = voList[i];
        const statusInfo = getUseYnInfo(vo.useYn);

        str += `
            <tr>
                <td>${i + 1}</td>
                <td class="pos-name-cell">
                    <span class="link-text" onclick="openPosModal('${vo.posCode}')">${vo.posName ?? "-"}</span>
                </td>
                <td>${vo.baseSalary ?? "-"}</td>
                <td>${vo.bonusRate ?? "-"}</td>
                <td>${vo.expectedSalary ?? "-"}</td>
                <td>${formatDate(vo.createdAt)}</td>
                <td>
                    <span class="status ${statusInfo.className}">${statusInfo.text}</span>
                </td>
            </tr>
        `;
    }

    tbodyTag.innerHTML = str;
}

/* =========================================================
   5. 검색
   - 검색 종류에 따라 함수 분기
   ========================================================= */

// 5.0 검색 뭘로 할지 (분기)
function searchPos() {
    const searchType = document.querySelector("#search-type").value;

    if (searchType === "all") {
        loadPosList();
    } else if (searchType === "posName") {
        loadPosListByName();
    } else if (searchType === "useYn") {
        loadPosListByUseYn();
    }
}

// 5.1직급명으로 검색
async function loadPosListByName() {
    try {
        const keyword = document.querySelector("#keyword").value.trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        const resp = await fetch(`/pos/search/name?keyword=${keyword}`);

        if (!resp.ok) {
            throw new Error("직급명 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("직급명 검색 중 오류 발생 ...");
    }
}

// 5.2 사용여부로 검색 (사용/미사용으로 검색)
async function loadPosListByUseYn() {
    try {
        const keyword = document.querySelector("#keyword").value.trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        let useYn = "";

        if (keyword === "사용" || keyword === "운영" || keyword.toUpperCase() === "Y") {
            useYn = "Y";
        } else if (keyword === "미사용" || keyword === "비활성화" || keyword.toUpperCase() === "N") {
            useYn = "N";
        } else {
            alert("사용여부는 사용 / 미사용 으로 입력하세요.");
            return;
        }

        const resp = await fetch(`/pos/search/useYn?useYn=${useYn}`);

        if (!resp.ok) {
            throw new Error("사용여부 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("사용여부 검색 중 오류 발생 ...");
    }
}

// 검색창에서 엔터치면 검색 실행
const keywordTag = document.querySelector("#keyword");
if (keywordTag) {
    keywordTag.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchPos();
        }
    });
}

/* =========================================================
   6. 상세조회 모달
   ========================================================= */

// 직급 상세조회 모달 열기
async function openPosModal(posCode) {
    try {
        const resp = await fetch(`/pos/${posCode}`);

        if (!resp.ok) {
            throw new Error("직급 상세조회 실패 ...");
        }

        const data = await resp.json();
        const vo = data.vo;
        const memberList = data.memberList ?? [];

        // 나중에 상태변경 버튼에서 사용할 값 저장
        currentPosCode = posCode;
        currentUseYn = vo.useYn;
        currentMemberList = memberList;

         // 직급 상세정보 채우기
        document.querySelector("#modal-pos-name").innerText = vo.posName ?? "-";
        document.querySelector("#modal-pos-baseSalary").innerText = vo.baseSalary ?? "-";
        document.querySelector("#modal-pos-bonusRate").innerText = vo.bonusRate ?? "-";
        document.querySelector("#modal-pos-expectedSalary").innerText = vo.expectedSalary ?? "-";
        document.querySelector("#modal-pos-status").innerText = vo.useYn === "Y" ? "운영" : "비활성화";
        document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);

        // 활성화/비활성화 버튼 문구 변경
        const toggleBtn = document.querySelector("#toggle-use-btn");
        if (toggleBtn) {
            if (vo.useYn === "Y") {
                toggleBtn.innerText = "비활성화";
            } else {
                toggleBtn.innerText = "활성화";
            }
        }

        // 소속 인원 목록 채우기
        renderPosMemberList(memberList);

        // 모달 열기
        document.querySelector("#pos-modal-wrap").style.display = "flex";

    } catch (error) {
        console.log(error);
        alert("직급 상세조회 실패 ...");
    }
}

// 상세조회 모달 닫기
function closePosModal() {
    document.querySelector("#pos-modal-wrap").style.display = "none";
}

// 소속 인원 목록 테이블 그리기
function renderPosMemberList(memberList) {
    const tbody = document.querySelector("#modal-member-list");

    if (!tbody) {
        return;
    }

    if (!memberList || memberList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">소속 인원이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < memberList.length; i++) {
        const member = memberList[i];

        str += `
            <tr>
                <td>${i + 1}</td>
                <td>${member.empName ?? "-"}</td>
                <td>${member.deptName ?? "-"}</td>
                <td>${member.empPhone ?? "-"}</td>
                <td>${formatDate(member.hireDate)}</td>
            </tr>
        `;
    }

    tbody.innerHTML = str;
}

/* =========================================================
   7. 활성화 / 비활성화
   ========================================================= */

// 현재 직급의 사용여부를 토글하는 함수
async function togglePosUseYn() {
    try {
        if (currentPosCode == null || currentUseYn == null) {
            alert("직급 정보가 없습니다.");
            return;
        }

        let url = "";
        let msg = "";

        if (currentUseYn === "Y") {
            url = `/pos/${currentPosCode}/disable`;
            msg = "정말 비활성화 하시겠습니까?";
        } else {
            url = `/pos/${currentPosCode}/enable`;
            msg = "정말 활성화 하시겠습니까?";
        }

        const ok = confirm(msg);
        if (!ok) {
            return;
        }

        const resp = await fetch(url, {
            method: "PUT",
        });

        if (!resp.ok) {
            throw new Error("상태 변경 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("처리 실패");
            return;
        }

        alert("처리 완료");
        closePosModal();

        // 상태 바뀌었으므로 요약카드와 목록 다시 조회
        loadPosSummary();
        loadPosList();

    } catch (error) {
        console.log(error);
        alert("상태 변경 중 오류 발생 ...");
    }
}

/* =========================================================
   8. 기본급 수정
   ========================================================= */

// 수정 시작
function startEditBaseSalary() {
    const currentBaseSalary = document.querySelector("#modal-pos-baseSalary").innerText;

    document.querySelector("#baseSalary-input").value = currentBaseSalary;
    document.querySelector("#baseSalary-view-area").style.display = "none";
    document.querySelector("#baseSalary-edit-area").style.display = "flex";
}

// 수정 취소
function cancelEditBaseSalary() {
    const viewTag = document.querySelector("#baseSalary-view-area");
    const editTag = document.querySelector("#baseSalary-edit-area");

    if (viewTag) viewTag.style.display = "block";
    if (editTag) editTag.style.display = "none";
}

// 수정 저장
async function saveBaseSalary() {
    try {
        const baseSalary = document.querySelector("#baseSalary-input").value.trim();

        if (!currentPosCode) {
            alert("직급 정보가 없습니다.");
            return;
        }

        if (baseSalary === "") {
            alert("기본급을 입력하세요.");
            return;
        }

        const resp = await fetch(`/pos/${currentPosCode}/baseSalary`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ baseSalary }),
        });

        if (!resp.ok) {
            throw new Error("기본급 수정 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("기본급 수정 실패");
            return;
        }

        // 상세 모달 값 갱신
        document.querySelector("#modal-pos-baseSalary").innerText = baseSalary;

        // 예상월급도 백엔드에서 다시 계산 안 해주면 일단 목록 재조회로 맞추기
        cancelEditBaseSalary();

        alert("기본급 수정 완료");
        loadPosList();

    } catch (error) {
        console.log(error);
        alert("기본급 수정 중 오류 발생 ...");
    }
}


/* =========================================================
   9. 보너스율 수정
   ========================================================= */

// 수정 시작
function startEditBonusRate() {
    const currentBonusRate = document.querySelector("#modal-pos-bonusRate").innerText;

    document.querySelector("#bonusRate-input").value = currentBonusRate;
    document.querySelector("#bonusRate-view-area").style.display = "none";
    document.querySelector("#bonusRate-edit-area").style.display = "flex";
}

// 수정 취소
function cancelEditBonusRate() {
    const viewTag = document.querySelector("#bonusRate-view-area");
    const editTag = document.querySelector("#bonusRate-edit-area");

    if (viewTag) viewTag.style.display = "block";
    if (editTag) editTag.style.display = "none";
}

// 수정 저장
async function saveBonusRate() {
    try {
        const bonusRate = document.querySelector("#bonusRate-input").value.trim();

        if (!currentPosCode) {
            alert("직급 정보가 없습니다.");
            return;
        }

        if (bonusRate === "") {
            alert("보너스율을 입력하세요.");
            return;
        }

        const resp = await fetch(`/pos/${currentPosCode}/bonusRate`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bonusRate }),
        });

        if (!resp.ok) {
            throw new Error("보너스율 수정 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("보너스율 수정 실패");
            return;
        }

        // 상세 모달 값 갱신
        document.querySelector("#modal-pos-bonusRate").innerText = bonusRate;

        cancelEditBonusRate();

        alert("보너스율 수정 완료");
        loadPosList();

    } catch (error) {
        console.log(error);
        alert("보너스율 수정 중 오류 발생 ...");
    }
}


/* =========================================================
   10. 직급 등록
   ========================================================= */

// 등록 모달 열기
function openInsertPosModal() {
    document.querySelector("#insert-pos-code").value = "";
    document.querySelector("#insert-pos-name").value = "";
    document.querySelector("#insert-pos-baseSalary").value = "";
    document.querySelector("#insert-pos-bonusRate").value = "";
    document.querySelector("#insert-pos-desc").value = "";

    document.querySelector("#pos-insert-modal-wrap").style.display = "flex";
}

// 등록 모달 닫기
function closeInsertPosModal() {
    document.querySelector("#pos-insert-modal-wrap").style.display = "none";
}

// 직급 등록
async function insertPos() {
    try {
        const posCode = document.querySelector("#insert-pos-code").value.trim();
        const posName = document.querySelector("#insert-pos-name").value.trim();
        const baseSalary = document.querySelector("#insert-pos-baseSalary").value.trim();
        const bonusRate = document.querySelector("#insert-pos-bonusRate").value.trim();
        const posDesc = document.querySelector("#insert-pos-desc").value.trim();

        if (posCode === "") {
            alert("직급코드를 입력하세요.");
            return;
        }

        if (posName === "") {
            alert("직급명을 입력하세요.");
            return;
        }

        const resp = await fetch("/pos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                posCode,
                posName,
                baseSalary,
                bonusRate,
                posDesc,
            }),
        });

        if (!resp.ok) {
            throw new Error("직급 등록 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("직급 등록 실패");
            return;
        }

        alert("직급 등록 완료 !");
        closeInsertPosModal();

        // 등록 후 다시 조회
        loadPosSummary();
        loadPosList();

    } catch (error) {
        console.log(error);
        alert("직급 등록 중 오류 발생 ...");
    }
}


