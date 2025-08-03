
const calculatorInvestmentsBarChartData = {
    labels: ["2026", "2027", "2028", "2029", "2030"],
    initialInvestment: 117500,
    datasets: [
      {
        label: "Investment return",
        color: "black",
        data: [ 117500, 117500, 117500, 117500, 117500],
      },
      {
        label: "Total rental income",
        color: "warning",
        data: [  13000,  17000,  20000,  23000,  26000],
      },
      {
        label: "Value appreciation",
        color: "success",
        data: [ 10000,  13000,  16000,  19000, 22000],
      },

    ],
  };

  export default calculatorInvestmentsBarChartData;
  