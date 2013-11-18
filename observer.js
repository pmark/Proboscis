// observer.js

var Observer = function(adaptor, apiName) {
	this.adaptor = adaptor;
	this.apiName = apiName;
};

Observer.prototype = {
	constructor: Observer,

	eventHandlerFor: function(eventName) {
		return function() {
			console.log("Triggered", eventName);
		};
	}



}

exports.Observer = Observer;
