import React, { createContext, useState } from "react";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketParams, setSocketParams] = useState({
    protocol: "ws://",
    socketIP: "",
    port: "",
    ackDelay: "",
    requestMessage: "",
    ackMessage: "",
    threads: null,
  });

  const [isDisconnected, setIsDisconnected] = useState(false);

  return (
    <SocketContext.Provider value={{ socketParams, setSocketParams, isDisconnected, setIsDisconnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
