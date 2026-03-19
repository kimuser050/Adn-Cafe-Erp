async function productChart() {

    const salesDate = document.querySelector("#salesDate").value;

    try {
        const resp = await fetch(`/dailySales/productIncomeData?salesDate=${salesDate}`);
        const data = await resp.json();

        const voList = (data && Array.isArray(data.voList)) ? data.voList : [];

        if (voList.length > 0) {
            const labels = voList.map(vo => vo.productName);
            const values = voList.map(vo => Number(vo.totalSales));

            console.log("변환된 데이터:", values); // 숫자로 잘 나오는지 확인용

            // 공통 색상 팔레트
            const colors = [
                '#E07A5F',// 01. 테라코타 로즈
                '#3D5A80', // 02. 딥 오션 블루
                '#81B29A', // 03. 세이지 그린
                '#F2CC8F', // 04. 부드러운 옐로우
                '#6D597A', // 05. 뮤트 퍼플
                '#98C1D9', // 06. 스카이 블루
                '#AD8B73', // 07. 밀크 초코
                '#E89A9A', // 08. 더스티 핑크
                '#5F797B', // 09. 오팔 그린 (New)
                '#A67C52'  // 10. 카라멜 브라운 (New)
            ];

            // --- 1. 왼쪽 도넛 차트 ---
            const ctxDonut = document.getElementById('productDoughnutChart').getContext('2d');
            if (window.myDonutChart) window.myDonutChart.destroy();

            window.myDonutChart = new Chart(ctxDonut, {
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
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            align: 'center', // 중앙 정렬
                            labels: {
                                boxWidth: 12,    // 색상 박스 크기 조절
                                padding: 20,     // 항목 간 간격
                                font: { size: 12, family: 'Pretendard' }
                            }
                        }
                    }
                }
            });

            // --- 2. 오른쪽 막대 차트 ---
            const ctxBar = document.getElementById('productBarChart').getContext('2d');
            if (window.myBarChart) window.myBarChart.destroy();

            window.myBarChart = new Chart(ctxBar, {
                type: 'bar', // 가로 막대를 원하시면 'bar' 유지 후 indexAxis: 'y' 추가
                data: {
                    labels: labels,
                    datasets: [{
                        label: '매출액 (원)',
                        data: values,
                        backgroundColor: colors.map(c => c + 'AA'), // 약간 투명하게
                        borderColor: colors,
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y', // 가로 막대 그래프로 설정 (목록이 많을 때 보기 편함)
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { display: false } // 막대는 레이블이 있어서 범례 생략 가능
                    }
                }
            });
            console.log("받은 데이터:", data.voList);
        }
    } catch (error) {
        console.log(error);
        alert("차트 로드 실패");
    }
}

document.addEventListener("DOMContentLoaded", productChart);
document.querySelector("#salesDate").addEventListener("change", productChart);