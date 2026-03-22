/* =========================================================
   인적자원 HOME
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

function nvl(value, defaultValue = "-") {
    if (value === null || value === undefined || value === "") {
        return defaultValue;
    }
    return value;
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString("ko-KR");
}

function getProfileImageSrc(fileName) {
    if (!fileName) {
        return "/img/common/default-profile.png";
    }
    return `/upload/profile/${fileName}`;
}

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
    if (profileImgTag) profileImgTag.src = getProfileImageSrc(vo.profileImg);
}

function renderApprovalSummary(vo) {
    if (!vo) return;

    const vacationTag = document.querySelector("#approved-vacation-count");
    const overtimeTag = document.querySelector("#approved-overtime-count");

    if (vacationTag) vacationTag.textContent = formatNumber(vo.approvedVacationCount);
    if (overtimeTag) overtimeTag.textContent = formatNumber(vo.approvedOvertimeCount);
}

function renderAttSummary(vo) {
    if (!vo) return;

    const baseDateTag = document.querySelector("#att-base-date");
    const attProgressFillTag = document.querySelector("#att-progress-fill");
    const attProgressTextTag = document.querySelector("#att-progress-text");

    if (baseDateTag) baseDateTag.textContent = nvl(vo.baseDate);

    animateNumber("#total-emp-count", vo.totalEmpCount);
    animateNumber("#remote-count", vo.remoteCount || 0);
    animateNumber("#present-count", vo.presentCount);
    animateNumber("#late-count", vo.lateCount);
    animateNumber("#absent-count", vo.absentCount);
    animateNumber("#vacation-count", vo.vacationCount);
    animateNumber("#overtime-count", vo.overtimeCount);
    animateNumber("#other-count", vo.otherCount || 0);

    const normalRate = Number(vo.normalRate || 0);

    if (attProgressTextTag) {
        attProgressTextTag.textContent = `${normalRate}%`;
    }

    if (attProgressFillTag) {
        setTimeout(() => {
            attProgressFillTag.style.height = `${normalRate}%`;
        }, 180);
    }
}

function renderPaySummary(vo) {
    if (!vo) return;

    const payMonthTag = document.querySelector("#pay-month");
    const totalNetAmountTag = document.querySelector("#total-net-amount");
    const payProgressFillTag = document.querySelector("#pay-progress-fill");
    const payProgressTextTag = document.querySelector("#pay-progress-text");
    const confirmRate = Number(vo.confirmRate || 0);

    if (payMonthTag) payMonthTag.textContent = nvl(vo.payMonth);
    if (totalNetAmountTag) totalNetAmountTag.textContent = `${formatNumber(vo.totalNetAmount)}원`;

    animateNumber("#target-count", vo.targetCount, "명");
    animateNumber("#confirmed-count", vo.confirmedCount, "명");
    animateNumber("#unconfirmed-count", vo.unconfirmedCount, "명");

    if (payProgressTextTag) {
        payProgressTextTag.textContent = `${confirmRate}%`;
    }

    if (payProgressFillTag) {
        setTimeout(() => {
            payProgressFillTag.style.width = `${confirmRate}%`;
        }, 250);
    }
}

function renderIssueList(list) {
    const issueListTag = document.querySelector("#issue-list");
    const issueCountTextTag = document.querySelector("#issue-count-text");

    if (!issueListTag) return;

    const displayList = Array.isArray(list) ? list.slice(0, 6) : [];

    if (displayList.length === 0) {
        issueListTag.innerHTML = `<div class="empty-msg">최신 인사소식이 없습니다.</div>`;
        if (issueCountTextTag) issueCountTextTag.textContent = "최근 0건";
        return;
    }

    if (issueCountTextTag) {
        issueCountTextTag.textContent = `최근 ${displayList.length}건`;
    }

    let str = "";

    for (const vo of displayList) {
        const profileImgSrc = getProfileImageSrc(vo.profileImg);
        const eventClass = getIssueEventClass(vo.hisEvent);

        str += `
            <div class="issue-item">
                <div class="issue-profile-box">
                    <img src="${profileImgSrc}" alt="프로필 이미지">
                </div>

                <div class="issue-text-box">
                    <div class="issue-top-line">
                        <span class="issue-name">${nvl(vo.empName)}</span>
                        <span class="issue-event ${eventClass}">${nvl(vo.hisEvent)}</span>
                    </div>

                    <div class="issue-meta">
                        <span>${nvl(vo.deptName)}</span>
                        <span class="dot">/</span>
                        <span>${nvl(vo.posName)}</span>
                    </div>

                    <div class="issue-content">${nvl(vo.hisContent)}</div>
                </div>
            </div>
        `;
    }

    issueListTag.innerHTML = str;
}

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

function animateNumber(selector, endValue, suffix = "") {
    const tag = document.querySelector(selector);
    if (!tag) return;

    const finalValue = Number(endValue || 0);
    let current = 0;
    const duration = 700;
    const stepTime = 16;
    const totalSteps = Math.max(1, Math.floor(duration / stepTime));
    const increment = finalValue / totalSteps;

    const timer = setInterval(() => {
        current += increment;

        if (current >= finalValue) {
            current = finalValue;
            clearInterval(timer);
        }

        tag.textContent = `${formatNumber(Math.round(current))}${suffix}`;
    }, stepTime);
}

function getIssueEventClass(eventName) {
    const value = String(eventName || "").trim();

    if (value.includes("입사")) return "join";
    if (value.includes("퇴사")) return "leave";
    if (value.includes("직급") || value.includes("부서") || value.includes("배치")) return "change";
    return "default";
}