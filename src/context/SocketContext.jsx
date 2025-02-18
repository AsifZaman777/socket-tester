import React, { createContext, useState } from 'react';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketParams, setSocketParams] = useState({
    socketIP: '',
    port: '',
    ackDelay: '',
    requestMessage: ''
  });

  console.log(socketParams.requestMessage);

  return (
    <SocketContext.Provider value={{ socketParams, setSocketParams }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;