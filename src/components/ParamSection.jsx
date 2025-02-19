import React, { useState, useContext } from "react";
import { FaWifi } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import { SocketContext } from "../context/SocketContext";
import Swal from "sweetalert2";

const ParamSection = () => {
  const [socketIP, setSocketIP] = useState("");
  const [port, setPort] = useState("");
  const [threads, setThreads] = useState("");
  const [ackDelay, setAckDelay] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { setSocketParams } = useContext(SocketContext);

  const handleDone = () => {
    if (socketIP && port) {
      setSocketParams({ socketIP, port, ackDelay, requestMessage, threads });
      setIsConnected(true);
    } else {
      Swal.fire({
        background: "#1a202c",
        color: "#f7fafc",
        icon: "error",
        title: "Missing or invalid credentials",
        text: "Please fill in the required fields",
      });
    }
  };

  return (
    <div className="p-2 m-20 border-2 border-green-200 rounded-md shadow-md mt-5">
      <h2 className="text-md font-semibold text-green-300 border-b-1 mb-5">
        Socket Connection
      </h2>
      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="text-xs">Socket IP</label>
          <input
            type="text"
            value={socketIP}
            onChange={(e) => setSocketIP(e.target.value)}
            className="border p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder="e.g ws://192.168.120.28"
          />
        </div>
        <div>
          <label className="text-xs">Port</label>
          <input
            type="text"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="border p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder="e.g 8080"
          />
        </div>
        <div>
          <label className="text-xs">Ack Delay(ms)</label>
          <input
            type="text"
            value={ackDelay}
            onChange={(e) => setAckDelay(e.target.value)}
            className="border p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder="e.g 1000"
          />
        </div>
      
        <div>
          <label className="text-xs">Request connection message</label>
          <input
            type="text"
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            className="border p-2  rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder={`{"data":{"16":"mt010","37":4325},"mt":"LG"}`}
          />
        </div>
          <div>
          <label className="text-xs">No of Threads (Users)</label>
          <input
            type="text"
            value={threads}
            onChange={(e) => setThreads(e.target.value)}
            className="border p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder="e.g 10"
          />
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-green-600 text-white p-2 rounded mr-1 hover:bg-green-700 transition-all duration-200 text-sm"
          onClick={handleDone}
        >
          Open connection
        </button>
      </div>

      <div className="border-t-2 border-amber-200 mb-2 mt-2">
        {isConnected ? (
          <div className="flex items-center text-green-300 text-sm mt-2">
            <GiNetworkBars className="mr-1" />
            Connection established to {socketIP}:{port}
          </div>
        ) : (
          <div className="flex items-center text-red-300 text-sm mt-2 animate-pulse font-bold">
            <FaWifi className="mr-1" />
            Insert socket credentials
          </div>
        )}
      </div>
    </div>
  );
};

export default ParamSection;
