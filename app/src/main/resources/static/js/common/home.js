async function login(){

    const empNo = document.querySelector(".login-section input[name=id]").value;
    const empPw = document.querySelector(".login-section input[name=pw]").value;

    try {
        const resp = await fetch(`/member/login`, {
            method : "post",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({empNo, empPw}),
        });

        if (!resp.ok) {
            alert("아이디 또는 비밀번호 틀림");
            return;
        }

        alert("로그인 성공");
        location.href = "/";  // 홈 이동
    } catch (e) {
        alert("서버 오류 발생");
    }
}