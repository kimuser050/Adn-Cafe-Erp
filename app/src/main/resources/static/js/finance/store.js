async function storeChart() {

    const salesDate = document.querySelector("#salesDate").value;

    try {
        const resp = await fetch(`/dailySales/storeIncomeData?salesDate=${salesDate}`);
        const data = await resp.json();
        const voList = (data && Array.isArray(data.voList)) ? data.voList : [];

        if (voList.length > 0) {
            const labels = voList.map(vo => vo.storeName); // 👈 지점명
            const values = voList.map(vo => Number(vo.totalSales)); // 👈 매출액(숫자변환)

            // 브라운 톤과 잘 어울리는 지점별 색상 팔레트
            const colors = [
                '#6A4328', // 01. 시그니처 브라운 (Main)
                '#596E79', // 02. 블루 그레이 (Point)
                '#778A35', // 03. 올리브 그린 (Point)
                '#BC6C25', // 04. 테라코타
                '#8B7E74', // 05. 웜 그레이
                '#DDA15E', // 06. 머스타드 샌드
                '#A9907E', // 07. 토프 브라운
                '#4E5945', // 08. 딥 카키 (New)
                '#C7B198', // 09. 연한 베이지
                '#3E4A59'  // 10. 미드나잇 블루 그레이 (New)
            ];

            // --- 1. 지점별 도넛 차트 ---
            const ctxDonut = document.getElementById('storeDoughnutChart').getContext('2d');
            if (window.myStoreDonut) window.myStoreDonut.destroy();
            window.myStoreDonut = new Chart(ctxDonut, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // 👈 비율 고정 해제
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#6a4328', font: { weight: 'bold' } } }
                    }
                }
            });

            // --- 2. 지점별 막대 차트 ---
            const ctxBar = document.getElementById('storeBarChart').getContext('2d');
            if (window.myStoreBar) window.myStoreBar.destroy();
            window.myStoreBar = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '지점별 매출액',
                        data: values,
                        backgroundColor: colors.map(c => c + 'CC'), // 살짝 투명하게
                        borderWidth: 0
                    }]
                },
                options: {
                    indexAxis: 'y', // 가로 막대
                    responsive: true,
                    maintainAspectRatio: false, // 👈 비율 고정 해제
                    scales: {
                        x: { beginAtZero: true, grid: { display: false } },
                        y: { grid: { display: false } }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
        alert("차트 로드 실패");
    }

}

document.addEventListener("DOMContentLoaded", () => {
    storeChart(); // 처음 로드될 때 실행

    // 날짜 변경될 때도 실행되도록 추가!
    const dateInput = document.querySelector("#salesDate");
    if (dateInput) {
        dateInput.addEventListener("change", storeChart);
    }
});