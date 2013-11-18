// device.js
// 2013/11/17
// P. Mark Anderson

var util = require("util");
var five = require("johnny-five");
var EventEmitter = require("events").EventEmitter;

var Device = function(options) {
	options = options || {};
	this.type = options.type;
	this.pin = options.pin;
	this.state = "";

	var typeData = DEVICE_TYPES[this.type];

	if (!typeData) {
		throw new Error("Invalid device type: " + this.type);
	}

	for (var key in typeData) {
		this[key] = typeData[key];
	}

	this.api = this.init(this.pin);
	this.eventEmitter = new EventEmitter();
};

Device.prototype = {
	constructor: Device,

	addEventHandler: function(triggeredEventName, callback) {
		console.log("[ DEVICE", this.pin, "] addEventHandler", triggeredEventName);

		var self = this;

		var fn = function(argument) {
			console.log("[ DEVICE", self.pin, "] triggered", triggeredEventName);
			callback.call(arguments);
		};

		if (typeof(this.api.addListener) === 'function') {
			this.api.addListener(triggeredEventName, fn);
		}

		// TODO: Confirm that duplicate events are not
		// being sent for devices with API event listeners
		// that also observe another device's events.
		this.eventEmitter.on(triggeredEventName, fn);
	},

	notify: function(targetEventName, data) {
		if (this.events) {
			var e = this.events[targetEventName];

			if (e.action) {
				e.action(this.api, data);
			}

			this.state = e.state;
			console.log("[ DEVICE", this.pin, "] notify:", targetEventName, "  state:", this.state);
		}

		this.eventEmitter.emit(targetEventName, data);
	}
};

exports.Device = Device;



//
// DEVICE_TYPES
// All supported johnny-five APIs appear here.
// These API names match johnny-fives.
// See https://github.com/rwaldron/johnny-five
//
// Each API has an init function that configures a pin.
// Each API also has a collection of events.
// Each event sets a state and can run a function when triggered.
//
var DEVICE_TYPES = {
	"IR.Motion": {
		init: function(pin) {
			return new five.IR.Motion(pin);
		},
		events: {
			motionstart: {
				state: "triggered"
			},
			motionend: {
				state: "ready"
			}
		}
	},

	"Led": {
		init: function(pin) {
			return new five.Led(pin);
		},
		events: {
			on: {
				state: "on",
				action: function(api) {
					api.on();
				}
			}, 
			off: {
				state: "off",
				action: function(api) {
					api.off();
				}
			}
		}
	}
};
