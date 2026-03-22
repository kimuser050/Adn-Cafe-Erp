// 1. 차트 인스턴스 전역 관리 (중복 생성 방지용)
let storeDonut = null;
let storeBar = null;
let productDonut = null;
let productBar = null;

// 2. 지점별 매출 차트 함수
async function loadStoreCharts() {
    const salesDate = document.querySelector("#salesDate").value;
    try {
        const resp = await fetch(`/dailySales/storeIncomeData?salesDate=${salesDate}`);
        const data = await resp.json();
        const voList = (data && Array.isArray(data.voList)) ? data.voList : [];

        if (voList.length > 0) {
            const labels = voList.map(vo => vo.storeName);
            const values = voList.map(vo => Number(vo.totalSales));
            const colors = ['#6A4328', '#596E79', '#778A35', '#BC6C25', '#8B7E74', '#DDA15E', '#A9907E', '#4E5945', '#C7B198', '#3E4A59'];

            // 지점 도넛
            const ctxDonut = document.getElementById('storeDoughnutChart').getContext('2d');
            if (storeDonut) storeDonut.destroy();
            storeDonut = new Chart(ctxDonut, {
                type: 'doughnut',
                data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
            });

            // 지점 막대
            const ctxBar = document.getElementById('storeBarChart').getContext('2d');
            if (storeBar) storeBar.destroy();
            storeBar = new Chart(ctxBar, {
                type: 'bar',
                data: { labels, datasets: [{ label: '매출액(원)', data: values, backgroundColor: colors.map(c => c + 'BB')
                    , borderColor: colors,borderWidth: 1, borderRadius: 4, barThickness: 20 }] },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
            });
        }
    } catch (e) { console.error("지점 차트 로드 실패:", e); }
}

// 3. 상품별 매출 차트 함수
async function loadProductCharts() {
    const salesDate = document.querySelector("#salesDate").value;
    try {
        const resp = await fetch(`/dailySales/productIncomeData?salesDate=${salesDate}`);
        const data = await resp.json();
        const voList = (data && Array.isArray(data.voList)) ? data.voList : [];

        if (voList.length > 0) {
            const labels = voList.map(vo => vo.productName);
            const values = voList.map(vo => Number(vo.totalSales));
            const colors = [
                '#E07A5F', // 01. 테라코타 (메인 따뜻한 색)
    '#F2CC8F', // 02. 소프트 샌드 옐로우
    '#E89A9A', // 03. 더스티 로즈 핑크
    '#DDA15E', // 04. 머스타드 오렌지
    '#BC6C25', // 05. 번트 시에나 (깊은 오렌지)
    '#F4A261', // 06. 파스텔 감귤
    '#E9C46A', // 07. 사프란 옐로우
    '#B5838D', // 08. 뮤트 로즈 퍼플
    '#E5989B', // 09. 연한 산호색
    '#CD8D7A'  // 10. 빈티지 레드 브라운
            ];

            // 상품 도넛
            const ctxDonut = document.getElementById('productDoughnutChart').getContext('2d');
            if (productDonut) productDonut.destroy();
            productDonut = new Chart(ctxDonut, {
                type: 'doughnut',
                data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
            });

            // 상품 막대
            const ctxBar = document.getElementById('productBarChart').getContext('2d');
            if (productBar) productBar.destroy();
            productBar = new Chart(ctxBar, {
                type: 'bar',
                data:{ labels, datasets: [{ label: '매출액(원)', data: values, backgroundColor: colors.map(c => c + 'BB')
                    , borderColor: colors,borderWidth: 1, borderRadius: 4, barThickness: 20 }] },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
            });
        }
    } catch (e) { console.error("상품 차트 로드 실패:", e); }
}

// 4. 초기화 및 이벤트 바인딩 (하나의 리스너로 통합)
document.addEventListener("DOMContentLoaded", () => {
    // 페이지 로드 시 전체 실행
    loadStoreCharts();
    loadProductCharts();

    // 날짜 변경 시 전체 갱신
    const dateInput = document.querySelector("#salesDate");
    if (dateInput) {
        dateInput.addEventListener("change", () => {
            loadStoreCharts();
            loadProductCharts();
        });
    }
});