import React, { useState, useContext } from "react";
import { FaWifi } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import { SocketContext } from "../context/SocketContext";
import Swal from "sweetalert2";

const ParamSection = () => {
  const [protocol, setProtocol] = useState("ws://");
  const [socketIP, setSocketIP] = useState("");
  const [port, setPort] = useState("");
  const [threads, setThreads] = useState("");
  const [ackDelay, setAckDelay] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [ackMessage, setAckMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const { setSocketParams, setIsDisconnected } = useContext(SocketContext);

  const handleDone = () => {
    if (socketIP && port) {
      setSocketParams({ protocol, socketIP, port, ackDelay, requestMessage, ackMessage, threads });
      setIsConnected(true);
      setIsDisconnected(false);
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

  const handleDisconnect = () => {
    setSocketParams({ protocol: "", socketIP: "", port: "", ackDelay: "", requestMessage: "", ackMessage: "", threads: null });
    setIsConnected(false);
    setIsDisconnected(true);
    Swal.fire({
      background: "#1a202c",
      color: "#f7fafc",
      icon: "success",
      title: "Disconnected",
      text: "All socket connections have been closed.",
    });
  };

  return (
    <div className="p-2 m-20 border-2 border-green-200 rounded-md shadow-md mt-5">
      <h2 className="text-md font-semibold text-green-300 border-b-1 mb-5">Socket Connection</h2>
      <div className="grid grid-cols-4 gap-2">
        <div>
          <label className="text-xs">Protocol</label>
          <select
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            className="border bg-black p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
          >
            <option value="ws://">ws://</option>
            <option value="wss://">wss://</option>
            <option value="">null</option>
          </select>
        </div>
        <div>
          <label className="text-xs">Socket IP</label>
          <input
            type="text"
            value={socketIP}
            onChange={(e) => setSocketIP(e.target.value)}
            className="border p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder="e.g 192.168.120.28"
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
          <label className="text-xs">Ack Delay (ms)</label>
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
            className="border p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder={`{"data":{"16":"mt010","37":4325},"mt":"LG"}`}
          />
        </div>
        <div>
          <label className="text-xs">Ack message</label>
          <input
            type="text"
            value={ackMessage}
            onChange={(e) => setAckMessage(e.target.value)}
            className="border p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder={`{"mt":"AC","data":{}}`}
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
        <button className="bg-neutral-800 border-2 border-green-500 text-white p-2 rounded mr-1 hover:border-green-400 transition-all duration-200 text-sm" onClick={handleDone}>
          Connect
        </button>
        <button className="bg-neutral-800 border-2 border-red-400 text-white p-2 rounded hover:border-red-300 transition-all duration-200 text-sm" onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>

      <div className="border-t-2 border-amber-200 mb-2 mt-2">
        {isConnected ? (
          <div className="flex items-center text-green-300 text-sm mt-2">
            <GiNetworkBars className="mr-1" />
            Connection established to {protocol}{socketIP}:{port}
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
