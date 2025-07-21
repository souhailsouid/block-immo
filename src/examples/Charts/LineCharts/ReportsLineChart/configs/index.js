function configs(labels, datasets) {
  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          tension: 0,
          pointRadius: 3,
          pointBorderColor: "transparent",
          pointBackgroundColor: "#44a047",
          borderColor: "#44a047",
          borderWidth: 2,
          backgroundColor: "transparent",
          fill: true,
          data: datasets.data,
          maxBarThickness: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            borderDash: [5, 5],
            color: "#e5e5e5",
          },
          ticks: {
            display: true,
            color: "#747474",
            padding: 10,
            font: {
              size: 14,
              weight: 400,
              family: "Inter",
              style: "normal",
              lineHeight: 2,
            },
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
            borderDash: [5, 5],
          },
          ticks: {
            display: true,
            color: "#747474",
            padding: 10,
            font: {
              size: 14,
              weight: 400,
              family: "Inter",
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
