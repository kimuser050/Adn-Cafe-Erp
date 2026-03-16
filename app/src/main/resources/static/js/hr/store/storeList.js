/* =========================================================
   매장관리 JS
   - 요약 카드
   - 전체 목록 조회
   - 검색
   - 상세조회 모달
   - 담당자 / 주소 / 상태 수정
   - 매장 등록
   - 주소검색 / 지도 표시
   ========================================================= */

/* =========================================================
   0. 전역 변수
   ========================================================= */
let currentStoreCode = null;     // 현재 보고 있는 매장코드
let currentStoreVo = null;       // 현재 보고 있는 매장 상세정보
let currentManagerList = [];     // 점주/담당자 목록

/* =========================================================
   1. 페이지 진입 시 실행
   ========================================================= */
try {
    loadStoreSummary();
    loadStoreList();
} catch (error) {
    console.log(error);
    alert("매장 페이지 로딩 실패 ...");
}

/* =========================================================
   2. 공통 함수
   ========================================================= */

// 상태코드를 화면용 텍스트와 css 클래스로 바꾸는 함수
function getStatusInfo(statusCode) {
    if (statusCode == 1) {
        return { text: "운영", statusClass: "on" };
    }
    if (statusCode == 2) {
        return { text: "휴업", statusClass: "rest" };
    }
    if (statusCode == 3) {
        return { text: "폐업", statusClass: "off" };
    }

    return { text: "-", statusClass: "" };
}

// 날짜를 YYYY-MM-DD 형태로 잘라서 보여주는 함수
function formatDate(value) {
    if (!value) {
        return "";
    }

    if (value.length >= 10) {
        return value.substring(0, 10);
    }

    return value;
}

/* =========================================================
   3. 요약 카드
   - 검색결과와 상관없이 항상 전체 기준
   ========================================================= */

// 전체 매장 목록을 다시 조회해서 요약 카드 계산
async function loadStoreSummary() {
    try {
        const resp = await fetch("/store");

        if (!resp.ok) {
            throw new Error("매장 요약 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderSummary(voList);

    } catch (error) {
        console.log(error);
        alert("매장 요약 조회 중 오류 발생 ...");
    }
}

// 요약 카드 렌더링
function renderSummary(voList) {
    let enableCount = 0;
    let restCount = 0;
    let disableCount = 0;

    for (let i = 0; i < voList.length; i++) {
        const vo = voList[i];

        if (vo.statusCode == 1) {
            enableCount++;
        } else if (vo.statusCode == 2) {
            restCount++;
        } else if (vo.statusCode == 3) {
            disableCount++;
        }
    }

    const totalTag = document.querySelector("#total-store-count");
    const enableTag = document.querySelector("#enable-store-count");
    const restTag = document.querySelector("#rest-store-count");
    const disableTag = document.querySelector("#disable-store-count");

    if (totalTag) totalTag.innerText = voList.length;
    if (enableTag) enableTag.innerText = enableCount;
    if (restTag) restTag.innerText = restCount;
    if (disableTag) disableTag.innerText = disableCount;
}

/* =========================================================
   4. 목록 조회
   ========================================================= */

// 전체 매장 목록 가져오기
async function loadStoreList() {
    try {
        const resp = await fetch("/store");

        if (!resp.ok) {
            throw new Error("매장 목록 조회 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("매장 목록 조회 중 오류 발생 ...");
    }
}

// 목록 테이블 렌더링
function renderTable(voList) {
    const tbodyTag = document.querySelector("#store-list");

    if (!tbodyTag) {
        return;
    }

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
                    <span class="link-text" onclick="openStoreModal('${vo.storeCode}')">${vo.storeName ?? "-"}</span>
                </td>
                <td>${vo.managerName ?? "-"}</td>
                <td>${vo.storeAddress ?? "-"}</td>
                <td>${formatDate(vo.createdAt)}</td>
                <td>
                    <span class="status ${statusInfo.statusClass}">${statusInfo.text}</span>
                </td>
            </tr>
        `;
    }

    tbodyTag.innerHTML = str;
}

/* =========================================================
   5. 검색
   - store는 상태명이 statusName 기준
   - mapper에 selectListByStatusName 이 있으므로 그 방식 사용
   ========================================================= */

// 검색 버튼 클릭 시 분기
function searchStore() {
    const searchType = document.querySelector("#search-type").value;

    if (searchType === "all") {
        loadStoreList();
    } else if (searchType === "storeName") {
        loadStoreListByName();
    } else if (searchType === "statusName") {
        loadStoreListByStatusName();
    }
}

// 매장명 검색
async function loadStoreListByName() {
    try {
        const keyword = document.querySelector("#keyword").value.trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        const resp = await fetch(`/store/search/name?keyword=${keyword}`);

        if (!resp.ok) {
            throw new Error("매장명 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("매장명 검색 중 오류 발생 ...");
    }
}

// 상태명 검색
async function loadStoreListByStatusName() {
    try {
        const keyword = document.querySelector("#keyword").value.trim();

        if (keyword === "") {
            alert("검색어를 입력하세요.");
            return;
        }

        let statusName = "";

        if (keyword === "운영") {
            statusName = "운영";
        } else if (keyword === "휴업") {
            statusName = "휴업";
        } else if (keyword === "폐업" || keyword === "비활성화") {
            statusName = "폐업";
        } else {
            alert("상태는 운영 / 휴업 / 폐업 으로 입력하세요.");
            return;
        }

        const resp = await fetch(`/store/search/statusName?statusName=${statusName}`);

        if (!resp.ok) {
            throw new Error("상태 검색 실패 ...");
        }

        const data = await resp.json();
        const voList = data.voList ?? [];

        renderTable(voList);

    } catch (error) {
        console.log(error);
        alert("상태 검색 중 오류 발생 ...");
    }
}

// 검색창 엔터 처리
const storeKeywordTag = document.querySelector("#keyword");
if (storeKeywordTag) {
    storeKeywordTag.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            searchStore();
        }
    });
}

/* =========================================================
   6. 상세조회 모달
   ========================================================= */

// 상세조회 모달 열기
async function openStoreModal(storeCode) {
    try {
        const resp = await fetch(`/store/${storeCode}`);

        if (!resp.ok) {
            throw new Error("매장 상세조회 실패 ...");
        }

        const data = await resp.json();
        const vo = data.vo;
        const managerList = data.managerList ?? [];

        currentStoreCode = storeCode;
        currentStoreVo = vo;
        currentManagerList = managerList;

        // 상세정보 채우기
        document.querySelector("#modal-store-name").innerText = vo.storeName ?? "-";
        document.querySelector("#modal-store-manager").innerText = vo.managerName ?? "-";
        document.querySelector("#modal-store-address").innerText = vo.storeAddress ?? "-";
        document.querySelector("#modal-created-at").innerText = formatDate(vo.createdAt);

        const statusInfo = getStatusInfo(vo.statusCode);
        document.querySelector("#modal-store-status").innerText = statusInfo.text;
        document.querySelector("#status-select").value = String(vo.statusCode ?? 1);

        // 수정 화면 초기화
        cancelEditManager();
        cancelEditAddress();
        cancelEditStatus();

        document.querySelector("#store-modal-wrap").style.display = "flex";

        // 모달이 열린 뒤 지도를 다시 그림
        setTimeout(function () {
            renderStoreMap(vo.storeAddress);
        }, 300);

    } catch (error) {
        console.log(error);
        alert("매장 상세조회 실패 ...");
    }
}

// 상세조회 모달 닫기
function closeStoreModal() {
    document.querySelector("#store-modal-wrap").style.display = "none";
}

/* =========================================================
   7. 상태 수정
   ========================================================= */

// 상태 수정 시작
function startEditStatus() {
    if (!currentStoreVo) {
        alert("매장 정보가 없습니다.");
        return;
    }

    document.querySelector("#status-select").value = String(currentStoreVo.statusCode ?? 1);
    document.querySelector("#status-view-area").style.display = "none";
    document.querySelector("#status-edit-area").style.display = "flex";
}

// 상태 수정 취소
function cancelEditStatus() {
    const viewTag = document.querySelector("#status-view-area");
    const editTag = document.querySelector("#status-edit-area");

    if (viewTag) viewTag.style.display = "block";
    if (editTag) editTag.style.display = "none";
}

// 상태 수정 저장
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
            throw new Error("상태 변경 실패 ...");
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
        alert("상태 변경 완료");

        loadStoreSummary();
        loadStoreList();

    } catch (error) {
        console.log(error);
        alert("상태 변경 중 오류 발생 ...");
    }
}

/* =========================================================
   8. 주소 수정
   ========================================================= */

// 주소 수정 시작
function startEditAddress() {
    const currentAddress = document.querySelector("#modal-store-address").innerText;

    document.querySelector("#address-input").value = currentAddress;
    document.querySelector("#address-view-area").style.display = "none";
    document.querySelector("#address-edit-area").style.display = "flex";
}

// 주소 수정 취소
function cancelEditAddress() {
    const viewTag = document.querySelector("#address-view-area");
    const editTag = document.querySelector("#address-edit-area");

    if (viewTag) viewTag.style.display = "block";
    if (editTag) editTag.style.display = "none";
}

// 주소 수정 저장
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
            throw new Error("주소 수정 실패 ...");
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
        alert("주소 수정 완료");

        loadStoreList();

        // 주소가 바뀌었으니 지도 다시 그림
        setTimeout(function () {
            renderStoreMap(storeAddress);
        }, 300);

    } catch (error) {
        console.log(error);
        alert("주소 수정 중 오류 발생 ...");
    }
}

/* =========================================================
   9. 담당자 수정
   ========================================================= */

// 담당자 수정 시작
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

// 담당자 수정 취소
function cancelEditManager() {
    const viewTag = document.querySelector("#manager-view-area");
    const editTag = document.querySelector("#manager-edit-area");

    if (viewTag) viewTag.style.display = "block";
    if (editTag) editTag.style.display = "none";
}

// 담당자 수정 저장
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
            throw new Error("담당자 수정 실패 ...");
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
        alert("담당자 수정 완료");

        loadStoreList();

    } catch (error) {
        console.log(error);
        alert("담당자 수정 중 오류 발생 ...");
    }
}

/* =========================================================
   10. 매장 등록
   ========================================================= */

// 등록 모달 열기
function openInsertStoreModal() {
    document.querySelector("#insert-store-code").value = "";
    document.querySelector("#insert-store-name").value = "";
    document.querySelector("#insert-store-address").value = "";

    document.querySelector("#store-insert-modal-wrap").style.display = "flex";
}

// 등록 모달 닫기
function closeInsertStoreModal() {
    document.querySelector("#store-insert-modal-wrap").style.display = "none";
}

// 매장 등록
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
            throw new Error("매장 등록 실패 ...");
        }

        const data = await resp.json();

        if (data.result != 1) {
            alert("매장 등록 실패");
            return;
        }

        alert("매장 등록 완료 !");
        closeInsertStoreModal();

        loadStoreSummary();
        loadStoreList();

    } catch (error) {
        console.log(error);
        alert("매장 등록 중 오류 발생 ...");
    }
}

/* =========================================================
   11. 주소검색
   ========================================================= */

// 등록 모달에서 주소검색
function searchInsertAddress() {
    new daum.Postcode({
        oncomplete: function (data) {
            document.querySelector("#insert-store-address").value = data.roadAddress;
        }
    }).open();
}

// 상세조회 수정에서 주소검색
function searchAddress() {
    new daum.Postcode({
        oncomplete: function (data) {
            document.querySelector("#address-input").value = data.roadAddress;
        }
    }).open();
}

/* =========================================================
   12. 카카오맵 렌더링
   ========================================================= */

// 주소를 좌표로 바꿔서 지도 표시
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

    setTimeout(function () {
        map.relayout();

        geocoder.addressSearch(address, function (result, status) {
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