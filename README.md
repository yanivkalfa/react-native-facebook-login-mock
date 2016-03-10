Snowplow react native tracker
=========================

Snowplow tracker for react and react-native

Snowplow react native tracker works exactly like [Snowplow Node.js Tracker](https://github.com/snowplow/snowplow-nodejs-tracker) because its the base of this package.

The documentation i will provide here will be limited however here you can find [extended documentation](https://github.com/snowplow/snowplow/wiki/Node.js-Tracker#set-platform)


## Installing

Using npm:

```bash
$ npm install snowplow-react-native-tracker --save
```

## Initialization

```javascript
var snowplow = require('snowplow-react-native-tracker');
var emitter = snowplow.emitter;
var tracker = snowplow.tracker;
First, initialize an emitter instance. This object will be responsible for how and when events are sent to Snowplow.

var e = emitter(
  'myscalastreamcollector.net', // Collector endpoint
  'http', // Optionally specify a method - http is the default
  8080, // Optionally specify a port
  'POST', // Method - defaults to GET
  5, // Only send events once n are buffered. Defaults to 1 for GET requests and 10 for POST requests.
  function (error, body, response) { // Callback called for each request
    if (error) {
      console.log("Request to Scala Stream Collector failed!");
    }
  }
);
```

Initialise a tracker instance like this:
```javascript
var t = tracker([e], 'myTracker', 'myApp', false);
```

You can continue reading the [extended documentation](https://github.com/snowplow/snowplow/wiki/Node.js-Tracker#set-platform) for more info.