require('dotenv').config();
const express = require('express');
const app = express();
const router = require('./src/routes');
const {port} = require("./src/config");

console.log("port", process.env.PORT)
app.use(express.json());
app.use('/', router);

app.listen(port, () => {
    console.log("App is running on port:::", port);
})