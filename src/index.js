const app = require("./config/app");
const db = require("./config/db");
const {port,env} = require('./constants/vars');
db.connect();




app.listen(port, () => {
    console.log(`${env} server running on port ${port}`)
    // logger.info(`${env} server running on port ${port}`)
})

module.exports = app;
