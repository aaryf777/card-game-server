const WebSocket = require("ws");
const websocketServer = new WebSocket.Server({
    noServer: true,
    path: "/websockets",
  });
module.exports =  websocketServer;
