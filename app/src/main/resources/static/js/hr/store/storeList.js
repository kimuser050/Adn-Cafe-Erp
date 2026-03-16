/* =========================================================
   매장관리 JS
   - 매장 목록 조회
   - 상세조회 모달
   - 담당자 / 주소 / 상태 수정
   - 매장 등록
   - 주소검색 / 지도 표시
   ========================================================= */

/* =========================
   현재 선택한 매장 정보 저장
   ========================= */
let currentStoreCode = null;
let currentStoreVo = null;
let currentManagerList = [];

/* =========================
   페이지 진입 시 목록 조회
   ========================= */
loadStoreList();

/* =========================
   공통 함수
   ========================= */

// 상태코드를 화면용 텍스트로 변환
function getStatusInfo(statusCode) {
    if (statusCode == 1) {
        return { text: "운영", className: "status-on" };
    }
    if (statusCode == 2) {
        return { text: "휴업", className: "status-rest" };
    }
    if (statusCode == 3) {
        return { text: "폐업", className: "status-off" };
    }
    return { text: "-", className: "" };
}

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
   매장 목록 조회
   ========================= */
async function loadStoreList() {
    try {
        const resp = await fetch("/store");

        if (!resp.ok) {
            throw new Error("매장 목록 조회 실패");
        }

        const data = await resp.json();
        const voList = data.voList;

        renderSummary(voList);
        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("매장 목록 조회 중 오류 발생");
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

    document.querySelector("#total-store-count").innerText = voList.length;
    document.querySelector("#enable-store-count").innerText = enableCount;
    document.querySelector("#rest-store-count").innerText = restCount;
    document.querySelector("#disable-store-count").innerText = disableCount;
}

/* =========================
   목록 테이블 렌더링
   ========================= */
function renderTable(voList) {
    const tbodyTag = document.querySelector("#store-list");

    if (!voList || voList.length === 0) {
        tbodyTag.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">조회된 매장이 없습니다.</td>
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
                <td class="store-name-cell">
                    <span class="store-link" onclick="openStoreModal('${vo.storeCode}')">${vo.storeName}</span>
                </td>
                <td>${vo.managerName ?? "-"}</td>
                <td>${vo.storeAddress ?? "-"}</td>
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
async function openStoreModal(storeCode) {
    try {
        const resp = await fetch(`/store/${storeCode}`);

        if (!resp.ok) {
            throw new Error("매장 상세조회 실패");
        }

        const data = await resp.json();
        const vo = data.vo;
        const managerList = data.managerList ?? [];

        currentStoreCode = storeCode;
        currentStoreVo = vo;
        currentManagerList = managerList;

        document.querySelector("#modal-store-name").innerText = vo.storeName ?? "-";
        document.querySelector("#modal-store-manager").innerText = vo.managerName ?? "-";
        document.querySelector("#modal-store-address").innerText = vo.storeAddress ?? "-";
        document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);

        const statusInfo = getStatusInfo(vo.statusCode);
        document.querySelector("#modal-store-status").innerText = statusInfo.text;
        document.querySelector("#status-select").value = String(vo.statusCode ?? 1);

        cancelEditManager();
        cancelEditAddress();
        cancelEditStatus();

        document.querySelector("#store-modal-wrap").style.display = "flex";

        // 모달이 열린 뒤 지도를 그려야 해서 약간 늦춤
        setTimeout(() => {
            renderStoreMap(vo.storeAddress);
        }, 300);

    } catch (error) {
        console.log(error);
        alert("매장 상세조회 실패");
    }
}

/* =========================
   상세조회 모달 닫기
   ========================= */
function closeStoreModal() {
    document.querySelector("#store-modal-wrap").style.display = "none";
}

/* =========================
   상태 수정
   ========================= */
function startEditStatus() {
    if (!currentStoreVo) {
        alert("매장 정보가 없습니다.");
        return;
    }

    document.querySelector("#status-select").value = String(currentStoreVo.statusCode ?? 1);
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

        if (!currentStoreCode) {
            alert("매장 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/store/status?storeCode=${currentStoreCode}&statusCode=${statusCode}`, {
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
        document.querySelector("#modal-store-status").innerText = statusInfo.text;

        if (currentStoreVo) {
            currentStoreVo.statusCode = Number(statusCode);
        }

        cancelEditStatus();
        loadStoreList();
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
    const currentAddress = document.querySelector("#modal-store-address").innerText;

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
        const storeAddress = document.querySelector("#address-input").value;

        if (!currentStoreCode) {
            alert("매장 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/store/${currentStoreCode}/address`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ storeAddress }),
        });

        if (!resp.ok) {
            throw new Error("주소 수정 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("주소 수정 실패");
            return;
        }

        document.querySelector("#modal-store-address").innerText = storeAddress;

        if (currentStoreVo) {
            currentStoreVo.storeAddress = storeAddress;
        }

        cancelEditAddress();
        loadStoreList();
        alert("주소 수정 완료");

        // 주소가 바뀌었으니 지도 다시 그림
        setTimeout(() => {
            renderStoreMap(storeAddress);
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

        if (currentStoreVo && String(manager.empNo) === String(currentStoreVo.ownerEmpNo)) {
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

        if (!currentStoreCode) {
            alert("매장 정보가 없습니다.");
            return;
        }

        const resp = await fetch(`/store/${currentStoreCode}/manager`, {
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
        document.querySelector("#modal-store-manager").innerText = selectedText;

        if (currentStoreVo) {
            currentStoreVo.ownerEmpNo = ownerEmpNo;
            currentStoreVo.managerName = selectedText;
        }

        cancelEditManager();
        loadStoreList();
        alert("담당자 수정 완료");

    } catch (error) {
        console.log(error);
        alert("담당자 수정 중 오류 발생");
    }
}

/* =========================
   매장 등록
   ========================= */
function openInsertStoreModal() {
    document.querySelector("#insert-store-code").value = "";
    document.querySelector("#insert-store-name").value = "";
    document.querySelector("#insert-store-address").value = "";

    document.querySelector("#store-insert-modal-wrap").style.display = "flex";
}

function closeInsertStoreModal() {
    document.querySelector("#store-insert-modal-wrap").style.display = "none";
}

async function insertStore() {
    try {
        const storeCode = document.querySelector("#insert-store-code").value.trim();
        const storeName = document.querySelector("#insert-store-name").value.trim();
        const storeAddress = document.querySelector("#insert-store-address").value.trim();

        if (storeCode === "") {
            alert("매장코드를 입력하세요.");
            return;
        }

        if (storeName === "") {
            alert("매장명을 입력하세요.");
            return;
        }

        if (storeAddress === "") {
            alert("매장위치를 입력하세요.");
            return;
        }

        const resp = await fetch("/store", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                storeCode,
                storeName,
                storeAddress,
            }),
        });

        if (!resp.ok) {
            throw new Error("매장 등록 실패");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("매장 등록 실패");
            return;
        }

        alert("매장 등록 완료");
        closeInsertStoreModal();
        loadStoreList();

    } catch (error) {
        console.log(error);
        alert("매장 등록 중 오류 발생");
    }
}

/* =========================
   주소검색
   ========================= */
function searchInsertAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            document.querySelector("#insert-store-address").value = data.roadAddress;
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
function renderStoreMap(address) {
    const mapContainer = document.querySelector("#store-map");

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