async function login() {
    const empNo = document.querySelector("input[name=id]").value;
    const empPw = document.querySelector("input[name=pw]").value;

    try {
        const resp = await fetch("/member/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ empNo, empPw })
        });

        if (!resp.ok) {
            // 서버에서 throw new IllegalArgumentException을 하면 여기로 옵니다.
            alert("로그인 실패: 아이디/비밀번호를 확인하거나 탈퇴 여부를 확인하세요.");
            return;
        }

        alert("로그인 성공!");
        location.reload(); // 메인 페이지 갱신

    } catch (error) {
        console.error(error);
        alert("로그인 중 서버 오류가 발생했습니다.");
    }
}