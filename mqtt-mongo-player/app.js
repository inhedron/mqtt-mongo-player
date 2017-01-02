var mongodb = require('mongodb');
var mqtt = require('mqtt');
var mqtt_regex = require("mqtt-regex");
const commandLineArgs = require('command-line-args');
var config = require('./config');

const optionDefinitions = [
    { name: 'start', type: String },
    { name: 'end', type: String },
    { name: 'speed', type: Number, defaultValue: 1}
]
var options = {};

try {
    options = commandLineArgs(optionDefinitions);
} catch (e) {
    console.log(e);
}


if (options.start) {

    if (!isNaN(Date.parse(options.start))) {
        options.start = new Date(Date.parse(options.start));
    } else {
        options.start = new Date(parseInt(options.start));
    }

    if (isNaN(options.start.getTime())) {
        options.start = null;
    }
}

if (options.end) {

    if (!isNaN(Date.parse(options.end))) {
        options.end = new Date(Date.parse(options.end));
    } else {
        options.end = new Date(parseInt(options.end));
    }

    if (isNaN(options.end.getTime())) {
        options.end = null;
    }
}



var mqttUri = 'mqtt://' + config.mqtt.hostname + ':' + config.mqtt.port;
var client = mqtt.connect(mqttUri);

client.on('error', function (error) {
    console.log("MQTT ERROR: " + error);
});

client.on('connect', function (connack) {
    var mongoUri = 'mongodb://' + config.mongodb.hostname + ':' + config.mongodb.port + '/' + config.mongodb.database;
    mongodb.MongoClient.connect(mongoUri, function (error, database) {
        if (error != null) {
            throw error;
        }

        var topic_checker = mqtt_regex(config.mqtt.namespace).exec;

        var collection = database.collection(config.mongodb.collection);
        collection.createIndex({ "ts": -1 });
        collection.createIndex({ "topic": 1 });

        var query = {};

        if (options.start && options.end) {
            query.ts = {
                $gte: options.start,
                $lt: options.end
            };
        } else if (options.start) {
            query.ts = {
                $gte: options.start
            };
        } else if (options.end) {
            query.ts = {
                $lt: options.end
            };
        }

        var cursor = collection.find(query).sort("ts", 1);
        var lastTime = null;


        cursor.count(function (err, count) {
            if (err) {
                console.log("ERROR: " + err);
            } else {
                console.log("count:", count);
            }
        });

        cursor.forEach(function (doc) {
            if (doc) {
                if (topic_checker(doc.topic)) {
                    if (lastTime) {
                        console.log("time diff:", doc.ts.getTime() - lastTime);
                        if ((doc.ts.getTime() - lastTime) < 0) {
                            console.log("time error");
                        }
                    }
                    //if (!last_ts || ) {
                    lastTime = doc.ts.getTime();
                    console.log("topic:", doc.topic);
                    client.publish(doc.topic, doc.message);
                    //}

                }
            }
        }, function (err) {
            if (err) {
                console.log("ERROR: " + err);
            }
            database.close();
        });
    });
});

