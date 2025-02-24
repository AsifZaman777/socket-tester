/// <summary>
/// ================================================================
/// Title         : Testing web socket server (max 1000 threads)
/// NameSpace     :
/// Author        : Asif Zaman
/// Purpose       : A web socket tester in order to test 1000 socket on mozilla (config 1000 socket), performance testing, response time graph
/// Creation date : 19-Feb-2025
/// =================================================================
/// Modification History
/// Author        Date      Description of change
/// ------------------------------------------------------------------
/// Asif zaman 20-Feb-2025 [FEATURE] Implemented logic to testable for 1000 threads on browser.
/// Asif zaman 23-Feb-2025 [FEATURE] Connection closing trace added to the log and graph.
/// Asif zaman 23-Feb-2025 [BUG]     Resolved the ack interval issue after the connection closure.
/// Asif zaman 23-Feb-2025 [FEATURE] Disconnect button to disconnect the socket instacnce forcefully.
/// Asif zaman 23-Feb-2025 [FEATURE] Ping the server continuously using exponential backoff retry technique to reconnect automatically when the server is up.
/// Asif zaman 24-Feb-2025 [UPDATE]  Graph notations updated.
/// Asif zaman 24-Feb-2025 [FEATURE] Implemented socket protocol dynamically.
/// Asif zaman 24-Feb-2025 [BUG]     Get max connected reset in the monitoringSection.
/// Asif zaman 24-Feb-2025 [BUG]     Null AckDelay handling for the sockets have by default ack.
 
/// ==================================================================
/// </summary>


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