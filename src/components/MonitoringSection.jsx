import React, { useState, useEffect, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Line } from "react-chartjs-2";
import { FaWifi, FaUser, FaNetworkWired } from "react-icons/fa";
import { VscDebugDisconnect } from "react-icons/vsc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
import zoomPlugin from "chartjs-plugin-zoom"; // Import zoom plugin
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
  //#region State Variables
  const { socketParams, isDisconnected } = useContext(SocketContext);
  const [logCounts, setLogCounts] = useState([]);
  const [sendLogCounts, setSendLogCounts] = useState([]);
  const [closeLogCounts, setCloseLogCounts] = useState([]);
  const [disconnectLogCounts, setDisconnectLogCounts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [logs, setLogs] = useState([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [sendMessageCount, setSendMessageCount] = useState(0);
  const [closeMessageCount, setCloseMessageCount] = useState(0);
  const [disconnectMessageCount, setDisconnectMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleRange, setVisibleRange] = useState({ min: null, max: null });
  const [zoomState, setZoomState] = useState({
    x: { min: null, max: null },
    y: { min: null, max: null },
  });
  const chartRef = useRef(null);
  //#endregion

  //#region Workers config
  useEffect(() => {
    if (socketParams.socketIP !== "") {
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
          protocol: socketParams.protocol,
          socketIP: socketParams.socketIP,
          port: socketParams.port,
          requestMessage: socketParams.requestMessage,
          ackDelay: socketParams.ackDelay,
          ackMessage: socketParams.ackMessage,
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
          } else if (event.data.type === "close") {
            console.log(
              `Main thread: Close from worker ${i + 1}:`,
              event.data.message
            );
            updateLogs(event.data.message);
            setCloseMessageCount((prev) => prev + 1);
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
      updateLogs("Please enter valid Socket IP");
    }
  }, [
    socketParams.protocol,
    socketParams.socketIP,
    socketParams.port,
    socketParams.threads,
  ]);
  //#endregion

  //#region Force disconnection
  useEffect(() => {
    if (isDisconnected) {
      updateLogs("Disconnected forcefully");
      setDisconnectMessageCount((prev) => prev + 1);
    }
  }, [isDisconnected]);
  //#endregion

  //#region Graph update
  useEffect(() => {
    if (!wsConnected) return;

    const updateGraph = () => {
      const currentTime = new Date().toLocaleTimeString();

      // Update datasets (store up to 1440 points)
      setLogCounts((prev) =>
        prev.length >= 1440
          ? [...prev.slice(1), messageCount]
          : [...prev, messageCount]
      );
      setSendLogCounts((prev) =>
        prev.length >= 1440
          ? [...prev.slice(1), sendMessageCount]
          : [...prev, sendMessageCount]
      );
      setCloseLogCounts((prev) =>
        prev.length >= 1440
          ? [...prev.slice(1), closeMessageCount]
          : [...prev, closeMessageCount]
      );
      setDisconnectLogCounts((prev) =>
        prev.length >= 1440
          ? [...prev.slice(1), disconnectMessageCount]
          : [...prev, disconnectMessageCount]
      );
      setLabels((prev) =>
        prev.length >= 1440
          ? [...prev.slice(1), currentTime]
          : [...prev, currentTime]
      );

      // Reset message counts
      setMessageCount(0);
      setSendMessageCount(0);
      setCloseMessageCount(0);
      setDisconnectMessageCount(0);

      // Update visible range to show the most recent 50 points
      const totalPoints = logCounts.length;
      if (totalPoints > 50) {
        setVisibleRange({
          min: totalPoints - 50,
          max: totalPoints - 1,
        });
      } else {
        setVisibleRange({ min: 0, max: totalPoints - 1 });
      }
    };

    requestAnimationFrame(updateGraph);
  }, [
    wsConnected,
    messageCount,
    sendMessageCount,
    closeMessageCount,
    disconnectMessageCount,
  ]);
  //#endregion

  //#region Scroll to bottom
  useEffect(() => {
    const logContainer = document.getElementById("log-container");
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }, [logs]);
  //#endregion

  //#region Update logs
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
  //#endregion

  //#region Max worker number
  const getMaxWorkerNumber = () => {
    if (isDisconnected) return 0;
    const workerNumbers = logs
      .map((log) => {
        const match = log.message.match(/Worker (\d+):/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((num) => num !== null);
    return workerNumbers.length > 0 ? Math.max(...workerNumbers) : 0;
  };
  //#endregion

  //#region Download Logs
  const downloadLogs = () => {
    const logText = logs.map(log => `${log.time}: ${log.message}`).join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logs.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  //#endregion

  //#region Chart Data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Received Messages",
        data: logCounts,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        tension: 0.5,
      },
      {
        label: "Sent Messages",
        data: sendLogCounts,
        borderColor: "rgb(0, 123, 255)",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.5,
      },
      {
        label: "Server disconnected",
        data: closeLogCounts,
        borderColor: "rgb(255, 0, 0)",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        tension: 0.5,
      },
      {
        label: "Forcefully Disconnected",
        data: disconnectLogCounts,
        borderColor: "rgb(255, 105, 180)",
        backgroundColor: "rgba(255, 105, 180, 0.2)",
        tension: 0.5,
      },
    ],
  };
  //#endregion

  //#region Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
          onPan: ({ chart }) => {
            const { min, max } = chart.scales.x;
            setVisibleRange({ min, max });
          },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
          onZoom: ({ chart }) => {
            const { min, max } = chart.scales.x;
            setVisibleRange({ min, max });
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        min: visibleRange.min,
        max: visibleRange.max,
      },
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, maxTicksLimit: 10 },
      },
    },
  };
  //#endregion

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
            <div className="flex gap-0">
              <FaUser className="text-white" />
              <h4 className="text-sm font-semibold text-white">
                Requested to connect: {socketParams.threads}
              </h4>
              {loading && (
                <AiOutlineLoading3Quarters className="animate-spin text-white" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <FaNetworkWired className="text-white" />
              <h4 className="text-sm font-semibold text-white">
                Max User Connected: {getMaxWorkerNumber()}
              </h4>
            </div>
          </div>

          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>

        {/* Logs Section */}
        <div className="p-4 border border-green-200 rounded-md shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-green-300">Live Logs</h4>
            <div className="flex gap-2">
              <input
                type="button"
                value="Clear Logs"
                onClick={() => setLogs([])}
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-all duration-200 text-xs"
              />
              <input
                type="button"
                value="Reset Zoom"
                onClick={() => {
                  const totalPoints = logCounts.length;
                  setVisibleRange({
                    min: totalPoints > 50 ? totalPoints - 50 : 0,
                    max: totalPoints - 1,
                  });
                }}
                className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-all duration-200 text-xs"
              />
              <input
                type="button"
                value="Download Logs"
                onClick={downloadLogs}
                className="bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-all duration-200 text-xs"
              />
            </div>
          </div>

          <div
            id="log-container"
            className="max-h-100 overflow-y-auto border border-gray-200 p-2 py-10 rounded-md bg-gray-900 text-green-300 text-xs"
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
