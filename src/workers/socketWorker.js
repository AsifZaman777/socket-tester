self.onmessage = function (e) {
  const { socketIP, port, requestMessage, ackDelay, ackMessage, threadId } = e.data;
  const socketUrl = `ws://${socketIP}:${port}`;
  const socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    console.log(`Worker ${threadId}: WebSocket connected`);
    socket.send(requestMessage);
    setInterval(() => {
      socket.send(ackMessage);
      self.postMessage({ type: 'ack', message: ackMessage });
    }, ackDelay);
  };

  socket.onmessage = (event) => {
    console.log(`Worker ${threadId}: Message received:`, event.data);
    self.postMessage({ type: 'message', message: event.data });
  };

  socket.onclose = () => {
    console.log(`Worker ${threadId}: WebSocket disconnected`);
  };

  socket.onerror = (err) => {
    console.error(`Worker ${threadId}: WebSocket error:`, err);
  };
};



{
  /**
   process of socket handling
Worker Initialization: In the MonitoringSection.jsx file, multiple Web Workers are created based on the number of threads specified by the user. This is done using a loop that iterates numThreads times.

Worker Configuration: Each worker is initialized with the WebSocket parameters (socketIP, port, requestMessage, ackDelay, threadId) by posting a message to the worker.

Worker Message Handling: Each worker listens for messages from the WebSocket server. When a message is received, the worker posts the message back to the main thread. Similarly, when an ACK message is sent, the worker also posts this back to the main thread.

Main Thread Handling: The main thread listens for messages from the workers. Depending on the type of message (either a regular message or an ACK), it updates the logs and increments the message count or send message count.

Graph Updates: The main thread periodically updates the graph data (logCounts and sendLogCounts) based on the message counts received from the workers. This ensures that the graph reflects the real-time data of received and sent messages.

Session Management: When the "Send Session" button is clicked, the main thread sends a message to all workers to send the session message to the WebSocket server.
   */
}