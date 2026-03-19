document.addEventListener("DOMContentLoaded", () => {
    loadList(1); // 페이지 진입 시 1페이지 로드
});

/**
 * 리스트 로드 함수
 */
async function loadList(page) {
    const type = document.querySelector("#searchType").value; // 선택된 타입 (all, title, writer)
    const keyword = document.querySelector("#searchKeyword").value;

    // URL에 검색 타입과 키워드를 모두 포함
    const url = `/qna/question?currentPage=${page}&searchType=${type}&searchKeyword=${encodeURIComponent(keyword)}`;

    try {
        const resp = await fetch(url);
        if(!resp.ok) throw new Error("검색 실패");

        const data = await resp.json();
        renderTable(data.voList);
        renderPagination(data.pvo);
    } catch (error) {
        console.error(error);
    }
}

/**
 * 테이블 렌더링
 */
function renderTable(list) {
    const tbody = document.querySelector("#qna-list-body");
    let html = "";

    if(list.length === 0) {
        html = "<tr><td colspan='4'>등록된 문의사항이 없습니다.</td></tr>";
    } else {
        list.forEach(vo => {
            // 권한 체크: 본인이거나 관리자(인사팀 310100)인 경우
            const isSecret = vo.secretYn === 'Y';
            const hasPermission = (loginMemberNo === vo.writerNo) || (loginDeptCode === '310100');

            // 제목 표시 로직
            let displayTitle = vo.title;
            let clickEvent = `location.href='/qna/question/detail?no=${vo.inquiryNo}'`;
            let lockIcon = isSecret ? ' <img src="/img/icon_lock.png" style="width:14px; vertical-align:middle;">' : '';

            if(isSecret && !hasPermission) {
                displayTitle = "🔒 비밀글입니다. 장성자와 담당자만 볼 수 있습니다.";
                clickEvent = "alert('작성자 본인만 열람 가능합니다.');";
            }

            html += `
                <tr onclick="${clickEvent}">
                    <td>${vo.inquiryNo}</td>
                    <td>${getCategoryName(vo.typeCode)}</td>
                    <td class="title-cell">
                        ${displayTitle} ${lockIcon}
                        ${vo.answerYn === 'Y' ? '<div class="answer-tag"><img src="/img/icon_answer.png" style="width:12px;"> 답변 완료</div>' : ''}
                    </td>
                    <td>${isSecret && !hasPermission ? '비공개' : vo.writerName}</td>
                </tr>
            `;
        });
    }
    tbody.innerHTML = html;
}

/**
 * 카테고리 코드 변환 (DB 데이터 기반)
 */
function getCategoryName(code) {
    const categories = { "1": "시스템", "2": "재무", "3": "인사", "4": "품질", "5": "공통" };
    return categories[code] || "기타";
}

/**
 * 페이징 렌더링
 */
function renderPagination(pvo) {
    const area = document.querySelector("#pagination-area");
    let html = "";

    // 이전 버튼
    if(pvo.startPage > 1) {
        html += `<span class="page-num" onclick="loadList(${pvo.startPage - 1})">&lt;</span>`;
    }

    // 숫자 버튼
    for(let i = pvo.startPage; i <= pvo.endPage; i++) {
        html += `<span class="page-num ${i === pvo.currentPage ? 'active' : ''}" onclick="loadList(${i})">${i}</span>`;
    }

    // 다음 버튼
    if(pvo.endPage < pvo.maxPage) {
        html += `<span class="page-num" onclick="loadList(${pvo.endPage + 1})">&gt;</span>`;
    }

    area.innerHTML = html;
}

/**
 * 작성하기 버튼 클릭 시 실행
 */
function checkLogin() {

    // 로그인 상태라면 작성 페이지로 이동
    location.href = "/qna/question/insert";
}