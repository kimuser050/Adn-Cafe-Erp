async function join() {
            // 1. 값 추출 (클래스 내부의 요소를 정확히 지칭)
            const empNo = document.querySelector("input[name=empNo]").value;
            const empPhone = document.querySelector("input[name=empPhone]").value;
            const empPw = document.querySelector("input[name=empPw]").value;
            const deptCode = document.querySelector("input[name=deptCode]").value;
            const empName = document.querySelector("input[name=empName]").value;
            const resdNo1 = document.querySelector("input[name=resdNo1]").value;
            const resdNo2 = document.querySelector("input[name=resdNo2]").value;
            const posCode = document.querySelector("input[name=posCode]").value;
            const empEmail = document.querySelector("input[name=empEmail]").value;
            const empAddress = document.querySelector("input[name=empAddress]").value;
            const profile = document.querySelector("input[name=profile]").files[0];

            // 필수값 간단 체크 (예시)
            if(!empNo || !empPw || !resdNo1 || !resdNo2) {
                alert("필수 항목을 모두 입력해주세요.");
                return;
            }

            // 2. 주민번호 합치기 (13자리 숫자만)
            const fullResdNo = resdNo1 + resdNo2;

            // 3. FormData 객체 생성
            const fd = new FormData();
            fd.append("empNo", empNo);
            fd.append("empPhone", empPhone);
            fd.append("empPw", empPw);
            fd.append("deptCode", deptCode);
            fd.append("resdNo", fullResdNo); // 서버 VO 필드와 매핑
            fd.append("empName", empName);
            fd.append("posCode", posCode);
            fd.append("empEmail", empEmail);
            fd.append("empAddress", empAddress);
            if (profile) {
                fd.append("profile", profile);
            }

            // 4. 서버 전송
            try {
                const resp = await fetch("/member/join", {
                    method: "post",
                    body: fd
                });

                if (!resp.ok) {
                    throw new Error("네트워크 응답 에러");
                }

                const data = await resp.json();

                if (data.x === "1") {
                    alert("회원가입 성공!");
                    location.href = "/"; // 메인 화면으로 이동
                } else {
                    alert("회원가입 실패: 관리자에게 문의하세요.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("회원가입 중 오류가 발생했습니다.");
            }
        }

        function previewImage(input) {
            const preview = document.getElementById('profile-preview');

            if (input.files && input.files[0]) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block'; // 사진이 선택되면 이미지 태그를 보이게 함
                };

                reader.readAsDataURL(input.files[0]);
            } else {
                preview.src = "";
                preview.style.display = 'none'; // 선택 취소 시 숨김
            }
        }