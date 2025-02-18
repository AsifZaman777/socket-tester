import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
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
import { SocketContext } from "../context/SocketContext"; // Import SocketContext

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

const MonitoringSection = () => {
  const { socketParams } = useContext(SocketContext); // Consume SocketContext
  const [logCounts, setLogCounts] = useState([]);
  const [sendLogCounts, setSendLogCounts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [logs, setLogs] = useState([]);
  const [ws, setWs] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [sendMessageCount, setSendMessageCount] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    // Use the dynamic socket IP and port from context
    if (socketParams.socketIP !== "" && socketParams.port !== "") {
      const socketUrl = `ws://${socketParams.socketIP}:${socketParams.port}`;
      const socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        console.log("WebSocket connected");
        updateLogs("Connection established");
        setWsConnected(true);
      };

      socket.onmessage = (e) => {
        console.log("Message received:", e.data);
        setMessageCount((prev) => prev + 1);
        updateLogs(e.data);
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        updateLogs("Connection closed");
      };

      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      setWs(socket);

      return () => {
        socket.close();
      };
    } else {
      updateLogs("Please enter valid Socket IP and Port");
    }
  }, [socketParams.socketIP, socketParams.port]); // Depend on socketParams to update if IP/Port changes

  useEffect(() => {
    if(wsConnected) {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();

      setLogCounts((prev) =>
        prev.length >= 20
          ? [...prev.slice(1), messageCount]
          : [...prev, messageCount]
      );
      setSendLogCounts((prev) =>
        prev.length >= 20
          ? [...prev.slice(1), sendMessageCount]
          : [...prev, sendMessageCount]
      );
      setLabels((prev) =>
        prev.length >= 20
          ? [...prev.slice(1), currentTime]
          : [...prev, currentTime]
      );

      setMessageCount(0);
      setSendMessageCount(0);
    }, 1000);
    

    return () => clearInterval(interval);
  }
  }, [messageCount, sendMessageCount]);

  useEffect(() => {
    const logContainer = document.getElementById("log-container");
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [logs]);

  const updateLogs = (data) => {
    const currentTime = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time: currentTime, message: data }]);
  };

  const sendSession = () => {
    if (socketParams.socketIP !== "" && socketParams.port !== "" && socketParams.requestMessage !== "") {
      console.log("mt:LG");
      const message = socketParams.requestMessage;
      ws.send(message);
      setSendMessageCount((prev) => prev + 1);
      setInterval(sendAck, 5000);
    } else {
      Swal.fire({
        background: "#1a202c",
        color: "#f7fafc",
        icon: "error",
        title: "Invalid Input",
        text: "Please enter a valid Socket IP, Port, or Request Message!",
      });
    }
  };

  const sendAck = () => {
    if (ws) {
      const ackMessage = '{"mt":"AC","data":{}}';
      ws.send(ackMessage);
      setSendMessageCount((prev) => prev + 1);
      updateLogs("Sent: " + ackMessage);
    }
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Received Messages Per Second",
        data: logCounts,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.3,
      },
      {
        label: "Send Messages Per Second",
        data: sendLogCounts,
        borderColor: "rgb(0, 123, 255)",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.2,
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
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, maxTicksLimit: 10 },
      },
    },
  };

  return (
    <div className="p-4 m-10 border-2 border-green-200 rounded-md shadow-md">
      <h2 className="text-md font-semibold text-green-300 border-b-1 mb-5">
        Socket Monitoring
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Graph Section */}
        <div className="p-4 border border-green-200 rounded-md shadow-md">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Logs Section */}
        <div className="p-4 border border-green-200 rounded-md shadow-md">
          <h4 className="text-sm font-semibold text-green-300 mb-2">
            Live Logs
          </h4>
          <div
            id="log-container"
            className="max-h-96 overflow-y-auto border border-gray-200 p-2 rounded-md bg-gray-900 text-green-300 text-xs"
          >
            {logs.map((log, index) => (
              <div key={index}>
                <span className="font-bold text-blue-400">{log.time}:</span>{" "}
                {log.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Send Session Button */}
      <button
        className="mt-4 px-4 py-2 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
        onClick={sendSession}
      >
        Send Session
      </button>
    </div>
  );
};

export default MonitoringSection;
