const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const routes = require('../api/routes/v1')

const app  = express();

app.use(cors());
app.use(express.json())
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use("/v1", routes);



//app.use(auth.verifyJwt)
// app.use('/v1',routes)

module.exports = app;