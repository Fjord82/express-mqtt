var mqtt = require('mqtt');

class MqttHandler {
  constructor() {
    this.mqttClient = null;
    this.host = "wss://mqtt.flespi.io";
    this.username = "YOUR_USERNAME"; // mqtt credentials if these are needed
    this.password = "YOUR_PASSWORD";
  }

  connect() {
    //Connect mqtt with credentials (In case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      username: this.username,
      password: this.password
    });

    // Mqtt error callback
    this.mqttClient.on("error", err => {
      console.log(err);
      this.mqttClient.end();
    });

    //Connection callback
    this.mqttClient.on("connect", () => {
      console.log(`mqtt client connected`);
    });

    // Mqtt subscriptions with various topics
    this.mqttClient.subscribe("mytopic", { qos: 0 });
    this.mqttClient.subscribe("/sensor/#", { qos: 0 });

    // When a message arrive console log it
    this.mqttClient.on("message", function(topic, message) {
      if (topic == "/sensor/temp") {
        // DO something e.g. send to DB and websockets
      }
      console.log(message.toString());
    });

    this.mqttClient.on("close", () => {
      console.log("mqtt client disconnected");
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(message) {
    this.mqttClient.publish("mytopic", message);
  }

  // Sends a mqtt message to topic: /control/led
  setBrightnesLED(value) {
    this.mqttClient.publish("/control/led", value);
  }
}

module.exports = MqttHandler;