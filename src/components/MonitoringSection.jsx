import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { Line } from "react-chartjs-2";
import { FaWifi, FaUser } from "react-icons/fa";
import { VscDebugDisconnect } from "react-icons/vsc";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import loading icon
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
import zoomPlugin from 'chartjs-plugin-zoom'; // Import zoom plugin
import { SocketContext } from "../context/SocketContext";

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin // Register zoom plugin
);

const MonitoringSection = () => {
  const { socketParams } = useContext(SocketContext);
  const [logCounts, setLogCounts] = useState([]);
  const [sendLogCounts, setSendLogCounts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [logs, setLogs] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [sendMessageCount, setSendMessageCount] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (socketParams.socketIP !== "" && socketParams.port !== "") {
      const numThreads = parseInt(socketParams.threads, 10);
      const newWorkers = [];

      for (let i = 0; i < numThreads; i++) {
        const worker = new Worker(
          new URL("../workers/socketWorker.js", import.meta.url),
          {
            type: "module",
          }
        );

        worker.postMessage({
          socketIP: socketParams.socketIP,
          port: socketParams.port,
          requestMessage: socketParams.requestMessage,
          ackDelay: socketParams.ackDelay,
          ackMessage: socketParams.ackMessage, // Pass ackMessage to worker
          threadId: i + 1,
        });

        worker.onmessage = (event) => {
          if (event.data.type === "message") {
            console.log(
              `Main thread: Message from worker ${i + 1}:`,
              event.data.message
            );
            updateLogs(`Worker ${i + 1}: ${event.data.message}`);
            setMessageCount((prev) => prev + 1);
            setLoading(false); // Stop loading when first message is received
          } else if (event.data.type === "ack") {
            console.log(
              `Main thread: ACK from worker ${i + 1}:`,
              event.data.message
            );
            updateLogs(`Worker ${i + 1}: Sent ACK`);
            setSendMessageCount((prev) => prev + 1);
          }
        };

        worker.onerror = (err) => {
          console.error(`Main thread: Error from worker ${i + 1}:`, err);
        };

        newWorkers.push(worker);
      }

      setWorkers(newWorkers);
      setWsConnected(true);

      return () => {
        newWorkers.forEach((worker) => worker.terminate());
      };
    } else {
      updateLogs("Please enter valid Socket IP and Port");
    }
  }, [socketParams.socketIP, socketParams.port, socketParams.threads]);

  useEffect(() => {
    if (!wsConnected) return;

    const updateGraph = () => {
      const currentTime = new Date().toLocaleTimeString();

      setLogCounts((prev) =>
        prev.length >= 50
          ? [...prev.slice(1), messageCount]
          : [...prev, messageCount]
      );
      setSendLogCounts((prev) =>
        prev.length >= 50
          ? [...prev.slice(1), sendMessageCount]
          : [...prev, sendMessageCount]
      );
      setLabels((prev) =>
        prev.length >= 50
          ? [...prev.slice(1), currentTime]
          : [...prev, currentTime]
      );

      setMessageCount(0);
      setSendMessageCount(0);
    };

    requestAnimationFrame(updateGraph);
  }, [wsConnected, messageCount, sendMessageCount]);

  useEffect(() => {
    const logContainer = document.getElementById("log-container");
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [logs]);

  const updateLogs = (data) => {
    const currentTime =
      new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + `.${new Date().getMilliseconds()}`;
    setLogs((prev) => [...prev, { time: currentTime, message: data }]);
  };

  const getMaxWorkerNumber = () => {
    const workerNumbers = logs
      .map(log => {
        const match = log.message.match(/Worker (\d+):/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter(num => num !== null);
    return workerNumbers.length > 0 ? Math.max(...workerNumbers) : 0;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Received Messages Per Second",
        data: logCounts,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.5,
      },
      {
        label: "Send Messages Per Second",
        data: sendLogCounts,
        borderColor: "rgb(0, 123, 255)",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
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

      {/* Monitoring Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Graph Section */}
        <div className="p-0 border border-green-200 rounded-md shadow-md">
          <div
            className={`flex items-center gap-10 px-4 py-2 rounded-none shadow-md ${
              wsConnected ? "bg-green-700" : "bg-red-500"
            }`}
          >
        
            {/* Status icons */}
            <div className="flex items-center gap-2">
              {wsConnected ? (
                <FaWifi className="text-white" />
              ) : (
                <VscDebugDisconnect className="animate-pulse" color="white" />
              )}
              {/* Status Text */}
              <h4 className="text-sm font-semibold text-white">
                Status: {wsConnected ? "Connected" : "Disconnected"}
              </h4>
            </div>

            {/* User connected */}
            <div className="flex items-center gap-2">
              <FaUser className="text-white" />
              <h4 className="text-sm font-semibold text-white">
                Users: {socketParams.threads} (Max Worker: {getMaxWorkerNumber()})
              </h4>
              {loading && (
                <AiOutlineLoading3Quarters className="animate-spin text-white" />
              )}
            </div>
          </div>

          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Logs Section */}
        <div className="p-4 border border-green-200 rounded-md shadow-md">
          <h4 className="text-sm font-semibold text-green-300 mb-2">
            Live Logs
          </h4>
          <div
            id="log-container"
            className="max-h-96 overflow-y-auto border border-gray-200 p-4 py-10 rounded-md bg-gray-900 text-green-300 text-xs"
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
    </div>
  );
};

export default MonitoringSection;
