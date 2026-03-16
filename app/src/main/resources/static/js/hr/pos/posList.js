/* =========================================================
   직급관리 JS
   - 직급 목록 조회
   - 상세조회 모달
   - 담당자 / 주소 / 상태 수정
   - 직급 등록
   - 주소검색 / 지도 표시
   ========================================================= */

/* =========================
   현재 선택한 직급 정보 저장
   ========================= */
let currentposCode = null;
let currentposVo = null;


/* =========================
   페이지 진입 시 목록 조회
   ========================= */
loadPosList();

/* =========================
   공통 함수
   ========================= */



// 날짜를 YYYY-MM-DD 형태로 잘라서 보여줌
function formatDate(value) {
    if (!value) {
        return "";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}

/* =========================
   직급 목록 조회
   ========================= */
async function loadPosList() {
    try {
        const resp = await fetch("/pos");

        if (!resp.ok) {
            throw new Error("직급 목록 조회 실패");
        }

        const data = await resp.json();
        const voList = data.voList;

        renderSummary(voList);
        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("직급 목록 조회 중 오류 발생");
    }
}

/* =========================
   요약 카드 렌더링
   ========================= */
function renderSummary(voList) {
    let enableCount = 0;
    let restCount = 0;
    let disableCount = 0;

    for (const vo of voList) {
        if (vo.statusCode == 1) {
            enableCount++;
        } else if (vo.statusCode == 2) {
            restCount++;
        } else if (vo.statusCode == 3) {
            disableCount++;
        }
    }

    document.querySelector("#total-pos-count").innerText = voList.length;
    document.querySelector("#enable-pos-count").innerText = enableCount;
    document.querySelector("#rest-pos-count").innerText = restCount;
    document.querySelector("#disable-pos-count").innerText = disableCount;
}

/* =========================
   목록 테이블 렌더링
   ========================= */
function renderTable(voList) {
    const tbodyTag = document.querySelector("#pos-list");

    if (!voList || voList.length === 0) {
        tbodyTag.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">조회된 직급이 없습니다.</td>
            </tr>
        `;
        return;
    }

    let str = "";

    for (let i = 0; i < voList.length; i++) {
        const vo = voList[i];
        const statusInfo = getStatusInfo(vo.statusCode);

        str += `
            <tr>
                <td>${i + 1}</td>
                <td class="pos-name-cell">
                    <span class="pos-link" onclick="openposModal('${vo.posCode}')">${vo.posName}</span>
                </td>
                <td>${vo.managerName ?? "-"}</td>
                <td>${vo.posAddress ?? "-"}</td>
                <td>${formatDate(vo.createdAt)}</td>
                <td>
                    <span class="status-badge">
                        <span class="status-dot ${statusInfo.className}"></span>
                        <span>${statusInfo.text}</span>
                    </span>
                </td>
            </tr>
        `;
    }

    tbodyTag.innerHTML = str;
}

/* =========================
   상세조회 모달 열기
   ========================= */
async function openPosModal(posCode) {
    try {
        const resp = await fetch(`/pos/${posCode}`);

        if (!resp.ok) {
            throw new Error("직급 상세조회 실패");
        }

        const data = await resp.json();
        const vo = data.vo;
        const managerList = data.managerList ?? [];

        currentPosCode = posCode;
        currentPosVo = vo;
        currentManagerList = managerList;

        document.querySelector("#modal-pos-name").innerText = vo.posName ?? "-";
        document.querySelector("#modal-pos-manager").innerText = vo.managerName ?? "-";
        document.querySelector("#modal-pos-address").innerText = vo.posAddress ?? "-";
        document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);

        const statusInfo = getStatusInfo(vo.statusCode);
        document.querySelector("#modal-pos-status").innerText = statusInfo.text;
        document.querySelector("#status-select").value = String(vo.statusCode ?? 1);

        cancelEditManager();
        cancelEditAddress();
        cancelEditStatus();

        document.querySelector("#pos-modal-wrap").style.display = "flex";

        // 모달이 열린 뒤 지도를 그려야 해서 약간 늦춤
        setTimeout(() => {
            renderPosMap(vo.posAddress);
        }, 300);

    } catch (error) {
        console.log(error);
        alert("직급 상세조회 실패");
    }
}

/* =========================
   상세조회 모달 닫기
   ========================= */
function closePosModal() {
    document.querySelector("#pos-modal-wrap").style.display = "none";
}

/* =========================
   상태 수정
   ========================= */
function startEditStatus() {
    if (!currentposVo) {
        alert("직급 정보가 없습니다.");
        return;
    }

    document.querySelector("#status-select").value = String(currentPosVo.statusCode ?? 1);
    document.querySelector("#status-view-area").style.display = "none";
    document.querySelector("#status-edit-area").style.display = "flex";
}

function cancelEditStatus() {
    document.querySelector("#status-view-area").style.display = "block";
    document.querySelector("#status-edit-area").style.display = "none";
}

async function saveStatus() {
    try {
        const statusCode = document.querySelector("#status-select").value;

        if (!currentPosCode) {
            alert("직급 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/pos/status?posCode=${currentPosCode}&statusCode=${statusCode}`, {
            method: "POST"
        });

        if (!resp.ok) {
            throw new Error("상태 변경 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("상태 변경 실패");
            return;
        }

        const statusInfo = getStatusInfo(statusCode);
        document.querySelector("#modal-pos-status").innerText = statusInfo.text;

        if (currentPosVo) {
            currentPosVo.statusCode = Number(statusCode);
        }

        cancelEditStatus();
        loadPosList();
        alert("상태 변경 완료");

    } catch (error) {
        console.log(error);
        alert("상태 변경 중 오류 발생");
    }
}

/* =========================
   주소 수정
   ========================= */
function startEditAddress() {
    const currentAddress = document.querySelector("#modal-pos-address").innerText;

    document.querySelector("#address-input").value = currentAddress;
    document.querySelector("#address-view-area").style.display = "none";
    document.querySelector("#address-edit-area").style.display = "flex";
}

function cancelEditAddress() {
    document.querySelector("#address-view-area").style.display = "block";
    document.querySelector("#address-edit-area").style.display = "none";
}

async function saveAddress() {
    try {
        const posAddress = document.querySelector("#address-input").value;

        if (!currentposCode) {
            alert("직급 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/pos/${currentposCode}/address`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ posAddress }),
        });

        if (!resp.ok) {
            throw new Error("주소 수정 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("주소 수정 실패");
            return;
        }

        document.querySelector("#modal-pos-address").innerText = posAddress;

        if (currentposVo) {
            currentposVo.posAddress = posAddress;
        }

        cancelEditAddress();
        loadposList();
        alert("주소 수정 완료");

        // 주소가 바뀌었으니 지도 다시 그림
        setTimeout(() => {
            renderposMap(posAddress);
        }, 300);

    } catch (error) {
        console.log(error);
        alert("주소 수정 중 오류 발생");
    }
}

/* =========================
   담당자 수정
   ========================= */
function startEditManager() {
    const selectTag = document.querySelector("#manager-select");
    selectTag.innerHTML = "";

    for (const manager of currentManagerList) {
        let selected = "";

        if (currentposVo && String(manager.empNo) === String(currentposVo.ownerEmpNo)) {
            selected = "selected";
        }

        selectTag.innerHTML += `
            <option value="${manager.empNo}" ${selected}>${manager.empName}</option>
        `;
    }

    document.querySelector("#manager-view-area").style.display = "none";
    document.querySelector("#manager-edit-area").style.display = "flex";
}

function cancelEditManager() {
    document.querySelector("#manager-view-area").style.display = "block";
    document.querySelector("#manager-edit-area").style.display = "none";
}

async function saveManager() {
    try {
        const ownerEmpNo = document.querySelector("#manager-select").value;

        if (!currentposCode) {
            alert("직급 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/pos/${currentposCode}/manager`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ownerEmpNo }),
        });

        if (!resp.ok) {
            throw new Error("담당자 수정 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("담당자 수정 실패");
            return;
        }

        const selectedText = document.querySelector("#manager-select").selectedOptions[0].text;
        document.querySelector("#modal-pos-manager").innerText = selectedText;

        if (currentposVo) {
            currentposVo.ownerEmpNo = ownerEmpNo;
            currentposVo.managerName = selectedText;
        }

        cancelEditManager();
        loadposList();
        alert("담당자 수정 완료");

    } catch (error) {
        console.log(error);
        alert("담당자 수정 중 오류 발생");
    }
}

/* =========================
   직급 등록
   ========================= */
function openInsertposModal() {
    document.querySelector("#insert-pos-code").value = "";
    document.querySelector("#insert-pos-name").value = "";
    document.querySelector("#insert-pos-address").value = "";

    document.querySelector("#pos-insert-modal-wrap").style.display = "flex";
}

function closeInsertposModal() {
    document.querySelector("#pos-insert-modal-wrap").style.display = "none";
}

async function insertpos() {
    try {
        const posCode = document.querySelector("#insert-pos-code").value.trim();
        const posName = document.querySelector("#insert-pos-name").value.trim();
        const posAddress = document.querySelector("#insert-pos-address").value.trim();

        if (posCode === "") {
            alert("직급코드를 입력하세요.");
            return;
        }

        if (posName === "") {
            alert("직급명을 입력하세요.");
            return;
        }

        if (posAddress === "") {
            alert("직급위치를 입력하세요.");
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
                posAddress,
            }),
        });

        if (!resp.ok) {
            throw new Error("직급 등록 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("직급 등록 실패");
            return;
        }

        alert("직급 등록 완료");
        closeInsertposModal();
        loadposList();

    } catch (error) {
        console.log(error);
        alert("직급 등록 중 오류 발생");
    }
}

/* =========================
   주소검색
   ========================= */
function searchInsertAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            document.querySelector("#insert-pos-address").value = data.roadAddress;
        }
    }).open();
}

function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            document.querySelector("#address-input").value = data.roadAddress;
        }
    }).open();
}

/* =========================
   카카오맵 렌더링
   - 주소를 좌표로 바꿔서 지도 표시
   - 모달 안 지도는 매번 새로 생성
   ========================= */
function renderposMap(address) {
    const mapContainer = document.querySelector("#pos-map");

    if (!mapContainer) {
        return;
    }

    if (!window.kakao || !window.kakao.maps) {
        mapContainer.innerHTML = "<div style='padding:40px; text-align:center;'>카카오맵 SDK 로딩 실패</div>";
        return;
    }

    if (!address || address.trim() === "") {
        mapContainer.innerHTML = "<div style='padding:40px; text-align:center;'>주소 정보가 없습니다.</div>";
        return;
    }

    const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);
    const geocoder = new kakao.maps.services.Geocoder();

    setTimeout(() => {
        map.relayout();

        geocoder.addressSearch(address, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                map.setCenter(coords);

                new kakao.maps.Marker({
                    map: map,
                    position: coords
                });
            } else {
                mapContainer.innerHTML = "<div style='padding:40px; text-align:center;'>지도를 표시할 수 없습니다.</div>";
            }
        });
    }, 300);
}