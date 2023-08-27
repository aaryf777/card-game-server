const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors : {origin : '*'}});

server.listen(8000, () => {
    console.log('websocklet server live');
})

module.exports = io;