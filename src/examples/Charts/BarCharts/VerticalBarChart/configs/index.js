// Material Dashboard 3 PRO React base styles
import typography from "assets/theme/base/typography";

const thresholds = [ 1, 10,100,1000,2000, 3000, 5000, 10000, 20000, 50000, 100000, 500000, 1000000];

function closestLowerThreshold(value, thresholds) {
  return thresholds
    .filter(t => t <= value)       // Garde les seuils inférieurs ou égaux
    .sort((a, b) => b - a)[0];     // Prend le plus grand parmi eux
}

function configs(labels, datasets) {
  const minValue = closestLowerThreshold(datasets[0].data[0], thresholds);

  return {
    data: {
      labels,
      datasets: [...datasets],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          stacked: true,
          beginAtZero: false,
          min: minValue,
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            padding: 10,
            color: "#9ca2b7",
            font: {
              size: 11,
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 2,
            },
            
          },
        },
        x: {
          stacked: true,
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: true,
            drawTicks: true,
          },
          ticks: {
            display: true,
            color: "#9ca2b7",
            padding: 10,
            font: {
              size: 11,
              family: typography.fontFamily,
              style: "normal",
              lineHeight: 2,
            },
          },
        },
      },
    },
  };
}

export default configs;
