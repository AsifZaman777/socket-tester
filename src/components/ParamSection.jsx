import React, { useState, useContext } from "react";
import { VscDebugDisconnect } from "react-icons/vsc";
import { GiNetworkBars } from "react-icons/gi";
import { SocketContext } from "../context/SocketContext";

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
      setSocketParams({ socketIP, port, ackDelay, requestMessage });
      setIsConnected(true);
    } else {
      alert("Please enter valid Socket IP and Port");
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
        {/* <div>
          <label className="text-xs">No of Threads (Users)</label>
          <input
            type="text"
            value={threads}
            onChange={(e) => setThreads(e.target.value)}
            className="border p-2 rounded w-full hover:border-green-200 transition-all duration-150 text-green-300 text-xs focus-visible:outline-none"
            placeholder="e.g 10"
          />
        </div> */}
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
      </div>
      <div className="mt-5">
        <button
          className="bg-blue-500 text-white p-2 rounded mr-1 hover:bg-blue-600 transition-all duration-200 text-xs"
          onClick={handleDone}
        >
          Done
        </button>
      </div>

      <div className="border-t-2 border-amber-200 mb-2 mt-2">
        {isConnected ? (
          <div className="flex items-center text-green-300 text-sm mt-2">
            <GiNetworkBars className="mr-1" />
            Connected to the socket
          </div>
        ) : (
          <div className="flex items-center text-red-300 text-sm mt-2">
            <VscDebugDisconnect className="mr-1" />
            Not connected to the socket
          </div>
        )}
      </div>
    </div>
  );
};

export default ParamSection;
