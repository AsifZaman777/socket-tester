import React from 'react';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import ParamSection from './components/ParamSection';
import MonitoringSection from './components/MonitoringSection';

const App = () => {
  return (
    <SocketProvider>
      <Navbar />
      <ParamSection />
      <MonitoringSection />
    </SocketProvider>
  );
};

export default App;