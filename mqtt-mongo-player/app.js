var mongodb = require('mongodb');
var mqtt = require('mqtt');
var mqtt_regex = require("mqtt-regex");
var config = require('./config');

var mqttUri = 'mqtt://' + config.mqtt.hostname + ':' + config.mqtt.port;
var client = mqtt.connect(mqttUri);

client.on('connect', function () {
    client.subscribe(config.mqtt.namespace);
});

var mongoUri = 'mongodb://' + config.mongodb.hostname + ':' + config.mongodb.port + '/' + config.mongodb.database;
mongodb.MongoClient.connect(mongoUri, function (error, database) {
    if (error != null) {
        throw error;
    }

    var collection = database.collection(config.mongodb.collection);
    collection.createIndex({ "topic": 1, "ts": -1 });

    client.on('message', function (topic, message) {
        var json = {};
        try {
            json = JSON.parse(String(message));
        } catch (e) {
            console.log(e);
        }
        var messageObject = {
            ts: new Date(),
            topic: topic,
            message: message.toString(),
            json: json
        };

        collection.insert(messageObject, function (error, result) {
            if (error != null) {
                console.log("ERROR: " + error);
            }
        });
    });
});
