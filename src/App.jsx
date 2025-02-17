import React from 'react';
import Navbar from './components/Navbar';
import ParamSection from './components/ParamSection';
import MonitoringSection from './components/MonitoringSection';

const App = () => {
  return (
    <div>
      <Navbar />
      <ParamSection />
      <MonitoringSection />
    </div>
  );
};

export default App;