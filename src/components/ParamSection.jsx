import React, { useState } from "react";

const ParamSection = () => {
  const [socketIP, setSocketIP] = useState("");
  const [port, setPort] = useState("");
  const [threads, setThreads] = useState("");
  const [ackDelay, setAckDelay] = useState("");

  const handleConnect = () => {
    // Handle connect to socket logic
  };

  const handleSendAck = () => {
    // Handle send ack logic
  };

  return (
    <div className="p-2 m-20 border-2 border-green-200 rounded-md shadow-md mt-5">
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
          onClick={handleConnect}
          className="bg-blue-500 text-white p-2 rounded mr-1 hover:bg-blue-600 transition-all duration-200 text-xs"
        >
          Connect to the socket
        </button>
        <button
          onClick={handleSendAck}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-all duration-200 text-xs"
        >
          Send ack
        </button>
      </div>
    </div>
  );
};

export default ParamSection;
