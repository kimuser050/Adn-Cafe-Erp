window.onload = () => {
    loadNoticeList(1);
};

async function loadNoticeList(pno) {
    const searchType = document.querySelector("#search-type").value;
    const searchValue = document.querySelector("#search-input").value;

    try {
        const resp = await fetch(`/notice?currentPage=${pno}&searchType=${searchType}&searchValue=${searchValue}`);
        const data = await resp.json();

        renderTable(data.voList);
        renderPagination(data.pvo);
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

function renderTable(voList) {
    const tbody = document.querySelector("#notice-tbody");
    let str = "";

    if (!voList || voList.length === 0) {
        str = `<tr><td colspan="6" style="padding:50px;">공지사항이 없습니다.</td></tr>`;
    } else {
        voList.forEach(vo => {
            str += `
            <tr onclick="location.href='/notice/detail/${vo.noticeNo}'">
                <td>${vo.noticeNo}</td>
                <td>${vo.category}</td>
                <td class="text-left">${vo.title}</td> <td>${vo.writerName || '관리자'}</td>
                <td>${vo.createdAt}</td>
                <td>${vo.hit}</td>
            </tr>`;
        });
    }
    tbody.innerHTML = str;
}

function renderPagination(pvo) {
    const pageArea = document.querySelector("#page-area");
    let str = '';

    if (pvo.startPage > 1) {
        str += `<button onclick="loadNoticeList(${pvo.startPage - 1})">&lt;</button>`;
    }

    for (let i = pvo.startPage; i <= pvo.endPage; i++) {
        const activeClass = (pvo.currentPage == i) ? 'class="active"' : '';
        str += `<button ${activeClass} onclick="loadNoticeList(${i})">${i}</button>`;
    }

    if (pvo.endPage < pvo.maxPage) {
        str += `<button onclick="loadNoticeList(${pvo.endPage + 1})">&gt;</button>`;
    }

    pageArea.innerHTML = str;
}