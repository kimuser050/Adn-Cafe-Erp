// 0. 전역변수
let currentStoreCode = null;
let currentStoreVo = null;
let currentManagerList = [];

// 1. 매장 목록 가져오기
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

// 2. 상태코드 -> 상태정보
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

// 3. 요약 카드
function renderSummary(voList) {
    let enableCount = 0;
    let restCount = 0;
    let disableCount = 0;

    for (const vo of voList) {
        if (vo.statusCode == 1) enableCount++;
        else if (vo.statusCode == 2) restCount++;
        else if (vo.statusCode == 3) disableCount++;
    }

    document.querySelector("#total-store-count").innerText = voList.length;
    document.querySelector("#enable-store-count").innerText = enableCount;
    document.querySelector("#rest-store-count").innerText = restCount;
    document.querySelector("#disable-store-count").innerText = disableCount;
}

// 4. 목록 테이블
function renderTable(voList) {
    const tbody = document.querySelector("#store-list");

    if (!voList || voList.length === 0) {
        tbody.innerHTML = `
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

    tbody.innerHTML = str;
}

// 5. 날짜 포맷
function formatDate(value) {
    if (!value) {
        return "";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}

// 6. 상세조회 모달 열기
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

        // 수정영역 초기화
        cancelEditManager();
        cancelEditAddress();
        cancelEditStatus();

        // 모달 열기
        document.querySelector("#store-modal-wrap").style.display = "flex";

        // 지도 렌더링
        setTimeout(() => {
            renderStoreMap(vo.storeAddress);
        }, 200);

    } catch (error) {
        console.log(error);
        alert("매장 상세조회 실패");
    }
}

// 7. 상세조회 모달 닫기
function closeStoreModal() {
    document.querySelector("#store-modal-wrap").style.display = "none";
}

// 8. 상태 수정 시작
function startEditStatus() {
    if (!currentStoreVo) {
        alert("매장 정보가 없습니다.");
        return;
    }

    document.querySelector("#status-select").value = String(currentStoreVo.statusCode ?? 1);
    document.querySelector("#status-view-area").style.display = "none";
    document.querySelector("#status-edit-area").style.display = "flex";
}

// 9. 상태 수정 취소
function cancelEditStatus() {
    document.querySelector("#status-view-area").style.display = "block";
    document.querySelector("#status-edit-area").style.display = "none";
}

// 10. 상태 저장
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

// 11. 주소 수정 시작
function startEditAddress() {
    const currentAddress = document.querySelector("#modal-store-address").innerText;

    document.querySelector("#address-input").value = currentAddress;
    document.querySelector("#address-view-area").style.display = "none";
    document.querySelector("#address-edit-area").style.display = "flex";
}

// 12. 주소 수정 취소
function cancelEditAddress() {
    document.querySelector("#address-view-area").style.display = "block";
    document.querySelector("#address-edit-area").style.display = "none";
}

// 13. 주소 저장
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

        setTimeout(() => {
            renderStoreMap(storeAddress);
        }, 200);

    } catch (error) {
        console.log(error);
        alert("주소 수정 중 오류 발생");
    }
}

// 14. 담당자 수정 시작
function startEditManager() {
    const selectTag = document.querySelector("#manager-select");
    selectTag.innerHTML = "";

    for (let i = 0; i < currentManagerList.length; i++) {
        const manager = currentManagerList[i];

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

// 15. 담당자 수정 취소
function cancelEditManager() {
    document.querySelector("#manager-view-area").style.display = "block";
    document.querySelector("#manager-edit-area").style.display = "none";
}

// 16. 담당자 저장
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

// 17. 매장등록 모달 열기
function openInsertStoreModal() {
    document.querySelector("#insert-store-code").value = "";
    document.querySelector("#insert-store-name").value = "";
    document.querySelector("#insert-store-address").value = "";

    document.querySelector("#store-insert-modal-wrap").style.display = "flex";
}

// 18. 매장등록 모달 닫기
function closeInsertStoreModal() {
    document.querySelector("#store-insert-modal-wrap").style.display = "none";
}

// 19. 매장 등록
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

// 20. 등록 모달 주소검색
function searchInsertAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            document.querySelector("#insert-store-address").value = data.roadAddress;
        }
    }).open();
}

// 21. 상세조회 주소검색
function searchAddress() {
    new daum.Postcode({
        oncomplete: function(data) {
            document.querySelector("#address-input").value = data.roadAddress;
        }
    }).open();
}

// 22. 지도 렌더링
function renderStoreMap(address) {
    const mapContainer = document.getElementById("store-map");

    if (!mapContainer) {
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

    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            const marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });

            map.setCenter(coords);
        } else {
            mapContainer.innerHTML = "<div style='padding:40px; text-align:center;'>지도를 표시할 수 없습니다.</div>";
        }
    });
}

// 23. 초기 실행
loadStoreList();