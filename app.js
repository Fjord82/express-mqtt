const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const mqttHandler = require("./mqtt-handler");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connected to database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const mqttClient = new mqttHandler();
mqttClient.connect();

//Routes
app.post('/send-mqtt', function (req, res) {
    mqttClient.sendMessage(req.body.message);
    res.status(200).send('Message sent to mqtt');
});

app.post("/set-led", function(req, res) {
    mqttClient.setBrightnesLED(req.body.value);
  res.status(200).send("Value sent to mqtt");
});

const server = app.listen(3000, function () {
    console.log('app running on port.', server.address().port);
});