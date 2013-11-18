// proboscis.js
// 2013/11/17
// P. Mark Anderson

var five = require("johnny-five");
var config = require('./config');
var Device = require('./device').Device;
var devices = {};
var board = null;

exports.connectDevices = function() {
	board = new five.Board();
	
	board.on("ready", function() {

	  // Set up devices
	  for (var deviceName in config.board) {
	    if (config.board.hasOwnProperty(deviceName)) {
        console.log("new device:", deviceName);
	      devices[deviceName] = new Device(config.board[deviceName]);
	    }
	  }

	  addTriggers();
	});
};


//
// For each configured trigger,
// make it so that the sender's event invokes the observer's action.
//
var addTriggers = function() {
  // Set up devices
  for (var deviceName in config.triggers) {
    if (!config.triggers.hasOwnProperty(deviceName)) {
      continue;
    }
    if (!devices[deviceName]) {
      console.log("WARNING: No device found for trigger:", deviceName);
      continue;
    }

    // Store triggers with their devices
    var sender = devices[deviceName];
    sender.triggers = sender.triggers || {};
    var triggerData = config.triggers[deviceName];

    for (var triggeredEventName in triggerData) {
      // Each triggered event may have many observers
      var observerData = triggerData[triggeredEventName];

      for (var observerName in observerData) {
        var observer = devices[observerName];
        var targetEventName = observerData[observerName];

        // Now we know which event to emit 
        // on which observer
        // for an event triggered on a sender.

        (function(observer, triggeredEventName, targetEventName) {          
          sender.addEventHandler(triggeredEventName, function(data) {
            observer.notify(targetEventName, data);
          });
        })(observer, triggeredEventName, targetEventName);


      } // End target events
    } // End triggered events
  } // End triggers
};

