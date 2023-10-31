const express = require("express");
const app = express();
const { Server } = require("socket.io");
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});



server.listen(8000, () => {
    console.log('websocklet server live');
   
})

module.exports = io;