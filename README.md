# mqtt-mongo-player

This NodeJS application publish messages which stored by [mqtt-mongo-recorder](https://github.com/inhedron/mqtt-mongo-recorder) to MQTT

Example
=======

Clone the repository
```bash
$ git clone https://github.com/inhedron/mqtt-mongo-player.git
$ cd mqtt-mongo-player/mqtt-mongo-player
$ npm install
```

You can set options by environment variables
```bash
$ MQTT_HOSTNAME="192.168.0.1" node app.js
```


### Options

Option                 | Type          | Default              | Description
-----------------------|---------------|----------------------|----------------------------
MQTT_NAMESPACE | String | # | Matching topics will be published
MQTT_HOSTNAME | String | localhost | IP Or Hostname of mqtt broker
MQTT_PORT | Number | 1883 | Mqtt Broker Port Number
MONGODB_HOSTNAME | String | localhost | IP Or Hostname of MongoDB
MONGODB_PORT | String | 27017 | MongoDB Port Number
MONGODB_DATABASE | String | mqtt | The database name of stored records
MONGODB_COLLECTION | String | message | The collection name of stored records

### Arguments

You can set some options by command line arguments
```bash
$ node app.js --speed=2
```

Option                 | Type          | Default              | Description
-----------------------|---------------|----------------------|----------------------------
start | [Date-ISO8601](https://www.w3.org/TR/NOTE-datetime) or [Unix Time (milisecond)](https://en.wikipedia.org/wiki/Unix_time) | null | The player will be published message if the record time is greater than or equal to this option
end | [Date-ISO8601](https://www.w3.org/TR/NOTE-datetime) or [Unix Time (milisecond)](https://en.wikipedia.org/wiki/Unix_time) | null | The player will be published message if the record time is less than or equal to this option
speed | Number | 1 | Indicates the current playback speed of stored records. 1.0 is normal speed. 0.5 is half speed (slower). 2.0 is double speed (faster)
