/**
 * 1. 이미지 미리보기 (동기 방식 처리)
 */
function previewImage(input) {
    const previewImg = document.getElementById('profile-preview');
    const fileNameDisplay = document.getElementById('file-name');

    if (input.files && input.files[0]) {
        fileNameDisplay.textContent = input.files[0].name;

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        fileNameDisplay.textContent = "선택된 파일 없음";
    }
}

/**
 * 2. 회원 정보 수정 (PUT)
 */
async function edit() {
    // 1. 값 가져오기 (selector는 본인의 JSP 구조에 맞춰 확인 필요)
    const empName = document.querySelector("input[name=empName]").value;
    const empPw = document.querySelector("input[name=empPw]").value;
    const empPw2 = document.querySelector("input[name=empPw2]").value;
    const empPhone = document.querySelector("input[name=empPhone]").value;
    const empEmail = document.querySelector("input[name=empEmail]").value;
    const empAddress = document.querySelector("input[name=empAddress]").value;
    const profile = document.querySelector("input[name=profile]").files[0];

    // 2. 간단한 유효성 검사 (비밀번호 확인)
    if (empPw !== empPw2) {
        alert("비밀번호 확인이 일치하지 않습니다.");
        return;
    }

    // 3. FormData 구성 (파일 업로드 포함)
    const fd = new FormData();
    fd.append("empName", empName);
    fd.append("empPw", empPw);
    fd.append("empPhone", empPhone);
    fd.append("empEmail", empEmail);
    fd.append("empAddress", empAddress);

    if (profile) {
        fd.append("profile", profile);
    }

    // 4. 서버 통신
    try {
        const resp = await fetch("/member/edit", {
            method: "PUT",
            body: fd
        });

        if (!resp.ok) {
                    throw new Error("수정 실패...");
                }

                const data = await resp.json();

                // 수정 완료 메시지를 띄우고
                alert("정보가 수정되었습니다. 보안을 위해 다시 로그인해주세요.");


                // ViewController에 만든 /member/logout GET 매핑으로 보냅니다.
                location.href = "/member/logout";

            } catch (error) {
                console.error(error);
                alert("수정 중 오류가 발생했습니다.");
            }
        }

/**
 * 3. 회원 탈퇴 (DELETE)
 */
async function quit() {
    const result = confirm("정말로 탈퇴하시겠습니까? 데이터는 복구되지 않습니다.");
    if (!result) return;

    try {
        const resp = await fetch("/member/quit", {
            method: "DELETE"
        });

        if (!resp.ok) {
            throw new Error("탈퇴 처리 실패...");
        }

        alert("회원 탈퇴 완료. 이용해 주셔서 감사합니다.");
        location.href = "/"; // 메인 페이지로 이동

    } catch (error) {
        console.error(error);
        alert("탈퇴 처리 중 문제가 발생했습니다.");
    }
}

// 페이지 로드 시 이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", () => {
    const pwInput = document.querySelector("input[name=empPw]");
    const pw2Input = document.querySelector("input[name=empPw2]");
    const msgArea = document.querySelector("#pw-match-msg");

    const checkPasswordMatch = () => {
        const pw = pwInput.value;
        const pw2 = pw2Input.value;

        // 둘 중 하나라도 비어있으면 메시지 지움
        if (pw === "" && pw2 === "") {
            msgArea.textContent = "";
            return;
        }

        if (pw === pw2) {
            msgArea.textContent = "비밀번호가 일치합니다.";
            msgArea.style.color = "green";
        } else {
            msgArea.textContent = "비밀번호가 일치하지 않습니다.";
            msgArea.style.color = "red";
        }
    };

    // input 이벤트는 타이핑할 때마다 발생합니다.
    pwInput.addEventListener("input", checkPasswordMatch);
    pw2Input.addEventListener("input", checkPasswordMatch);
});