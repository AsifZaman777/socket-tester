import React, { createContext, useState } from 'react';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketParams, setSocketParams] = useState({
    socketIP: '',
    port: '',
    ackDelay: '',
    requestMessage: '',
    ackMessage: '', // Add ackMessage
    threads: null,
  });

  const [isDisconnected, setIsDisconnected] = useState(false); // Add isDisconnected state

  console.log(socketParams.requestMessage);

  return (
    <SocketContext.Provider value={{ socketParams, setSocketParams, isDisconnected, setIsDisconnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;