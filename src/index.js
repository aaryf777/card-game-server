const app = require("./config/app");
const db = require("./config/db");
const {port,env} = require('./constants/vars');
const server = require("http").Server(app)
db.connect();
server.listen(port, () => {
    console.log(`websocket server running on port ${port}`);
})
const io = require("socket.io")(server, { cors: { origin: "*" } });

module.exports = io;
