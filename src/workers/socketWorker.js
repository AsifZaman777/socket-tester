self.onmessage = function (e) {
  const { socketIP, port, requestMessage, ackDelay, threadId } = e.data;
  const socketUrl = `ws://${socketIP}:${port}`;
  const socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    console.log(`Worker ${threadId}: WebSocket connected`);
    socket.send(requestMessage);
    setInterval(() => {
      const ackMessage = '{"mt":"AC","data":{}}';
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
