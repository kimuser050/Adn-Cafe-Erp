/* =========================================================
   인적자원 HOME
========================================================= */

/* =========================================================
   1. 시작
========================================================= */
window.addEventListener("DOMContentLoaded", async function () {
    try {
        await loadHrHome();
        bindMoveEvents();
    } catch (error) {
        console.error(error);
        alert("인적자원 HOME 로딩 실패");
    }
});

/* =========================================================
   2. 메인 조회
========================================================= */
async function loadHrHome() {
    const resp = await fetch("/api/hr/home");

    if (!resp.ok) {
        throw new Error("hr home 데이터 조회 실패");
    }

    const data = await resp.json();

    renderProfile(data.profileVo);
    renderApprovalSummary(data.approvalSummaryVo);
    renderAttSummary(data.attSummaryVo);
    renderPaySummary(data.paySummaryVo);
    renderIssueList(data.issueVoList);
}

/* =========================================================
   3. 공통 함수
========================================================= */
function nvl(value, defaultValue = "-") {
    if (value === null || value === undefined || value === "") {
        return defaultValue;
    }
    return value;
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("ko-KR");
}

function formatPercent(value) {
    return `${Number(value || 0)}%`;
}

function getProfileImageSrc(fileName) {
    if (!fileName) {
        return "/img/common/default-profile.png";
    }
    return `/upload/profile/${fileName}`;
}

/* =========================================================
   4. 프로필 렌더링
========================================================= */
function renderProfile(vo) {
    if (!vo) return;

    const empNameTag = document.querySelector("#emp-name");
    const deptNameTag = document.querySelector("#dept-name");
    const posNameTag = document.querySelector("#pos-name");
    const empNoTag = document.querySelector("#emp-no");
    const profileImgTag = document.querySelector("#profile-img");

    if (empNameTag) empNameTag.textContent = nvl(vo.empName);
    if (deptNameTag) deptNameTag.textContent = nvl(vo.deptName);
    if (posNameTag) posNameTag.textContent = nvl(vo.posName);
    if (empNoTag) empNoTag.textContent = nvl(vo.empNo);

    if (profileImgTag) {
        profileImgTag.src = getProfileImageSrc(vo.profileImg);
    }
}

/* =========================================================
   5. 전날 승인 결재 요약 렌더링
========================================================= */
function renderApprovalSummary(vo) {
    if (!vo) return;

    const vacationTag = document.querySelector("#approved-vacation-count");
    const overtimeTag = document.querySelector("#approved-overtime-count");

    if (vacationTag) {
        vacationTag.textContent = formatNumber(vo.approvedVacationCount);
    }

    if (overtimeTag) {
        overtimeTag.textContent = formatNumber(vo.approvedOvertimeCount);
    }
}

/* =========================================================
   6. 전날 근태 요약 렌더링
========================================================= */
function renderAttSummary(vo) {
    if (!vo) return;

    const baseDateTag = document.querySelector("#att-base-date");
    const totalEmpCountTag = document.querySelector("#total-emp-count");
    const presentCountTag = document.querySelector("#present-count");
    const lateCountTag = document.querySelector("#late-count");
    const absentCountTag = document.querySelector("#absent-count");
    const vacationCountTag = document.querySelector("#vacation-count");
    const overtimeCountTag = document.querySelector("#overtime-count");
    const normalCountTag = document.querySelector("#normal-count");
    const normalRateTag = document.querySelector("#normal-rate");

    if (baseDateTag) baseDateTag.textContent = nvl(vo.baseDate);
    if (totalEmpCountTag) totalEmpCountTag.textContent = formatNumber(vo.totalEmpCount);
    if (presentCountTag) presentCountTag.textContent = formatNumber(vo.presentCount);
    if (lateCountTag) lateCountTag.textContent = formatNumber(vo.lateCount);
    if (absentCountTag) absentCountTag.textContent = formatNumber(vo.absentCount);
    if (vacationCountTag) vacationCountTag.textContent = formatNumber(vo.vacationCount);
    if (overtimeCountTag) overtimeCountTag.textContent = formatNumber(vo.overtimeCount);
    if (normalCountTag) normalCountTag.textContent = formatNumber(vo.normalCount);
    if (normalRateTag) normalRateTag.textContent = formatPercent(vo.normalRate);
}

/* =========================================================
   7. 급여 현황 렌더링
========================================================= */
function renderPaySummary(vo) {
    if (!vo) return;

    const payMonthTag = document.querySelector("#pay-month");
    const totalNetAmountTag = document.querySelector("#total-net-amount");
    const targetCountTag = document.querySelector("#target-count");
    const confirmedCountTag = document.querySelector("#confirmed-count");
    const unconfirmedCountTag = document.querySelector("#unconfirmed-count");
    const confirmRateTag = document.querySelector("#confirm-rate");

    if (payMonthTag) payMonthTag.textContent = nvl(vo.payMonth);
    if (totalNetAmountTag) totalNetAmountTag.textContent = `${formatNumber(vo.totalNetAmount)}원`;
    if (targetCountTag) targetCountTag.textContent = formatNumber(vo.targetCount);
    if (confirmedCountTag) confirmedCountTag.textContent = formatNumber(vo.confirmedCount);
    if (unconfirmedCountTag) unconfirmedCountTag.textContent = formatNumber(vo.unconfirmedCount);
    if (confirmRateTag) confirmRateTag.textContent = formatPercent(vo.confirmRate);
}

/* =========================================================
   8. 최신 인사소식 렌더링
========================================================= */
function renderIssueList(list) {
    const issueListTag = document.querySelector("#issue-list");
    const issueCountTextTag = document.querySelector("#issue-count-text");

    if (!issueListTag) return;

    if (!list || list.length === 0) {
        issueListTag.innerHTML = `
            <div class="empty-msg">최신 인사소식이 없습니다.</div>
        `;
        if (issueCountTextTag) {
            issueCountTextTag.textContent = "최근 0건";
        }
        return;
    }

    if (issueCountTextTag) {
        issueCountTextTag.textContent = `최근 ${list.length}건`;
    }

    let str = "";

    for (const vo of list) {
        const profileImgSrc = getProfileImageSrc(vo.profileImg);

        str += `
            <div class="issue-item">
                <div class="issue-profile-box">
                    <img src="${profileImgSrc}" alt="프로필 이미지">
                </div>

                <div class="issue-text-box">
                    <div class="issue-top-line">
                        <span class="issue-name">${nvl(vo.empName)}</span>
                        <span class="issue-event">${nvl(vo.hisEvent)}</span>
                    </div>

                    <div class="issue-meta">
                        <span>${nvl(vo.deptName)}</span>
                        <span class="dot">·</span>
                        <span>${nvl(vo.posName)}</span>
                        <span class="dot">·</span>
                        <span>${nvl(vo.hisDate)}</span>
                    </div>

                    <div class="issue-content">${nvl(vo.hisContent)}</div>
                </div>
            </div>
        `;
    }

    issueListTag.innerHTML = str;
}

/* =========================================================
   9. 이동 이벤트
========================================================= */
function bindMoveEvents() {
    const vacationSummaryBtn = document.querySelector("#vacation-summary-btn");
    const overtimeSummaryBtn = document.querySelector("#overtime-summary-btn");

    if (vacationSummaryBtn) {
        vacationSummaryBtn.addEventListener("click", function () {
            location.href = "/approval/received";
        });
    }

    if (overtimeSummaryBtn) {
        overtimeSummaryBtn.addEventListener("click", function () {
            location.href = "/approval/received";
        });
    }
}