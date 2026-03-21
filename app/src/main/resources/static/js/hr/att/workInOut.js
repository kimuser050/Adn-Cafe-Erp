window.addEventListener("DOMContentLoaded", function () {
    const workInBtn = document.querySelector("#btn-work-in");
    const workOutBtn = document.querySelector("#btn-work-out");

    if (workInBtn) {
        workInBtn.addEventListener("click", handleCheckIn);
    }

    if (workOutBtn) {
        workOutBtn.addEventListener("click", handleCheckOut);
    }
});

async function handleCheckIn() {
    const btn = document.querySelector("#btn-work-in");

    try {
        btn.disabled = true;

        const empNo = btn.dataset.empNo;
        if (!empNo) {
            alert("사번 정보를 찾을 수 없습니다.");
            btn.disabled = false;
            return;
        }

        const resp = await fetch(`/att/check-in?empNo=${encodeURIComponent(empNo)}`, {
            method: "POST"
        });

        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data.msg || "출근 처리 실패");
        }

        alert(data.msg || "출근 처리 완료");
        location.reload();

    } catch (error) {
        console.log(error);
        alert(error.message || "출근 처리 중 오류 발생");
        btn.disabled = false;
    }
}

async function handleCheckOut() {
    const btn = document.querySelector("#btn-work-out");

    try {
        btn.disabled = true;

        const empNo = btn.dataset.empNo;
        if (!empNo) {
            alert("사번 정보를 찾을 수 없습니다.");
            btn.disabled = false;
            return;
        }

        const resp = await fetch(`/att/check-out?empNo=${encodeURIComponent(empNo)}`, {
            method: "POST"
        });

        const data = await resp.json();

        if (!resp.ok) {
            throw new Error(data.msg || "퇴근 처리 실패");
        }

        alert(data.msg || "퇴근 처리 완료");
        location.reload();

    } catch (error) {
        console.log(error);
        alert(error.message || "퇴근 처리 중 오류 발생");
        btn.disabled = false;
    }
}