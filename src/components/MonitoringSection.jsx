import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const stockSymbols = ["AAPL", "GOOGL", "TSLA", "MSFT", "AMZN"];

const MonitoringSection = () => {
  const [logCounts, setLogCounts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      const logCount = Math.floor(Math.random() * 5) + 1; // Random log count per second (1 to 5)

      let newLogs = [];
      for (let i = 0; i < logCount; i++) {
        const randomStock =
          stockSymbols[Math.floor(Math.random() * stockSymbols.length)];
        const randomPrice = (Math.random() * 1000).toFixed(2);
        newLogs.push({
          symbol: randomStock,
          price: `$${randomPrice}`,
          timestamp: currentTime,
        });
      }

      // Update graph data
      setLogCounts((prev) =>
        prev.length >= 10 ? [...prev.slice(1), logCount] : [...prev, logCount]
      );
      setLabels((prev) =>
        prev.length >= 10
          ? [...prev.slice(1), currentTime]
          : [...prev, currentTime]
      );

      // Update logs
      setLogs((prev) => [...prev, ...newLogs]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Logs Per Second",
        data: logCounts,
        borderColor: "rgb(34, 197, 94)", // Green-200
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 1, maxTicksLimit: 5 } }, // Zoomed out
    },
  };

  return (
    <div className="p-4 m-10 border-2 border-green-200 rounded-md shadow-md">
      <h2 className="text-lg font-semibold text-green-300 border-b-1 mb-5">
        Socket Monitoring
      </h2>

      <h2 className="text-sm font-semibold text-green-100">
        Incoming data monitor
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Graph Section */}
        <div className="p-4 border-1 border-green-200 rounded-md shadow-md">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Logs Section */}
        <div className="p-4 border-1 border-green-200 rounded-md shadow-md">
          <h4 className="text-sm font-semibold text-green-300 mb-2">
            Logs (Random Stock Prices)
          </h4>
          <div className="max-h-96 overflow-y-auto border border-gray-200 p-2 rounded-md bg-gray-900 text-green-300 text-xs">
            {logs.map((log, index) => (
              <div key={index}>{JSON.stringify(log, null, 2)}</div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default MonitoringSection;
